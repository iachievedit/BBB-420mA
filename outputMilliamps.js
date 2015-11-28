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

// See http://dev.iachieved.it/iachievedit/adventures-in-beaglebone-black-device-overlays-and-spi/
// This code assumes you have a mikroBUS cape with:
//
// a 4-20mA receiver clickboard in cape slot 1
// a 4-20mA transmitter clickboard in cape slot 2

var SPI = require('spi')

var milliamps = process.argv[2] || 12

if (milliamps < 4 || milliamps > 20) {
  console.log("Invalid argument:  mA must be between 4 and 20")
  process.exit()
}

var receiver1 = new SPI.Spi('/dev/spidev2.0', {
  'mode':SPI.MODE['MODE_0'], 
  'chipSelect':SPI.CS['low']
}, function(s){s.open()})

var transmitter2 = new SPI.Spi('/dev/spidev2.1', {
  'mode':SPI.MODE['MODE_0'], 
  'chipSelect':SPI.CS['low']
}, function(s){s.open()})

// 4-20mA transmitter click board performs linear conversion
// of input number from range 800 - 4095 into current into
// range 4mA - 20mA.
function milliampsToMikro(milliamps) {
  var mikro = (205.9375*milliamps) - 23.75
  if (mikro < 800)  mikro = 800
  if (mikro > 4095) mikro = 4095
  return mikro
}

//
function adcToMilliamps(adc) {
  if (adc < 800 || adc > 4095) return NaN
  var milliamps = (adc*0.004855842) + 0.115326252
  return milliamps
}

var mikro = milliampsToMikro(milliamps)

console.log("Milliamps:              " + milliamps)
console.log("Output to transmitter:  " + mikro)

var val = mikro |= 0x3000
var mbuf = new Buffer(2)
mbuf.writeUInt16BE(val,0)

transmitter2.transfer(mbuf, mbuf)

var outbuf = new Buffer(2)
receiver1.transfer(outbuf, outbuf)
var adc = (outbuf.readUInt16BE() & 0x1fff) >> 1
console.log("Input from receiver:    " + adc)
console.log("Millamps:               " + adcToMilliamps(adc))
