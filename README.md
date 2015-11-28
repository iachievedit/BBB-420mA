# BBB-420mA
BeagleBone Black and 4-20mA SPI

For use with the mikroBUS cape and 4-20mA transmitter and receiver clickboards.

Companion tutorial can be found at http://dev.iachieved.it/iachievedit/adventures-in-beaglebone-black-device-overlays-and-spi/

```
git clone git@github.com:iachievedit/BBB-420mA
cd BBB-420mA
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
```node outputMilliamp.js 8 # Output 8 mA```


