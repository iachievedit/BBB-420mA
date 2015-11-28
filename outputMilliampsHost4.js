// Copyright (c) 2015, iAchieved.it LLC
// Permission to use, copy, modify, and/or distribute this software for any
// purpose with or without fee is hereby granted, provided that the above
// copyright notice and this permission notice appear in all copies.
// THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
// WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
// MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY
// SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
// WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION
// OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF OR IN
// CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.

var fs  = require('fs')
var SPI = require('spi')

var milliamps = process.argv[2]

var milliamps = process.argv[2] || 12

if (milliamps < 4 || milliamps > 20) {
  console.log("Invalid argument:  mA must be between 4 and 20")
  process.exit()
}

var receiver1 = new SPI.Spi('/dev/spidev2.0', {
  'mode':SPI.MODE['MODE_0'], 
  'chipSelect':SPI.CS['low']
}, function(s){s.open()})

var transmitter4 = new SPI.Spi('/dev/spidev2.2', {
  'mode':SPI.MODE['MODE_0'], 
  'chipSelect':SPI.CS['low']
}, function(s){s.open()})

// 4-20mA click board performs linear conversion of input number
// from range 800 - 4095 into current in range 4mA - 20mA.
function milliampsToMikro(milliamps) {
  var mikro = (205.9375*milliamps) - 23.75
  if (mikro < 800)  mikro = 800
  if (mikro > 4095) mikro = 4095
  return mikro
}

function mikroToMilliamps(mikro) {
  var milliamps = (mikro*0.004855842) + 0.115326252
  return milliamps
}

var mikro = milliampsToMikro(milliamps)

console.log("Milliamps:              " + milliamps)
console.log("Output to Transmitter:  " + mikro)

var val = mikro |= 0x3000
var mbuf = new Buffer(2)
mbuf.writeUInt16BE(val,0)

fs.writeFile('/sys/class/gpio/gpio68/value', 0, function() {
  transmitter4.transfer(mbuf, mbuf)
  fs.writeFile('/sys/class/gpio/gpio68/value', 1, readReceiver)
})

function readReceiver() {
  var outbuf = new Buffer(2)
  receiver1.transfer(outbuf, outbuf)
  var adc = (outbuf.readUInt16BE() & 0x1fff) >> 1
  console.log("Input from Receiver:    " + adc)
  console.log("Millamps:               " + mikroToMilliamps(adc))
}
