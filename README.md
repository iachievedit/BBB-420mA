# BBB-420mA
BeagleBone Black and 4-20mA SPI

For use with the mikroBUS cape and 4-20mA transmitter and receiver clickboards.

Companion tutorial can be found at http://dev.iachieved.it/iachievedit/adventures-in-beaglebone-black-device-overlays-and-spi/

```
git clone git@github.com:iachievedit/BBB-420mA
cd BBB-420mA
git checkout linux-4.3
```

### Node >=0.12 Required!
```make node # Installs node4.x on your BeagleBone Black```

### Install SPI NPM module
```make npm```

Yes, I should write a ```package.json``` file.

### Compiling and Installing Overlay
```make dtbo```

### Loading the Overlay
```echo BB-SPICAPE-01 > /sys/devices/platform/bone_capemgr/slots```

### Examples
```node transmitReceive420.js 9 12```

Output
```
----
Output to Transmitter(/dev/spidev2.1):  1829.6875 (9 mA)
Input from Receiver(/dev/spidev2.0):  1802 (8.9) mA
----
Output to Transmitter(/dev/spidev1.0):  2447.5 (12 mA)
Input from Receiver(/dev/spidev2.2):  2462 (12) mA
----
```

