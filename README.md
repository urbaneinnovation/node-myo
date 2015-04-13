# node-myo

node-myo is a Node.js library for connecting directly to Myo armbands via Thalmic Lab's published Bluetooth protocol. Created for use on Mac OS or Linux out of the box, with Windows support contingent on having the Windows Developer SDK installed on your system.

## Install

For running on Linux, you will need Bluez5 installed (Bluez4 does not support BLE devices); on Mac, you will need XCode installed. See https://github.com/sandeepmistry/noble for more detailed prerequisites.

```sh
npm install node-myo
```

## Test

After cloning the repository, run the following command:

```sh
npm test
```


## Use

The following will start scanning for Myo armbands, and log those found.

```javascript
var nm = require('node-myo');

var agent = new nm.MyoDiscoveryAgent();

// Register listener
//
agent.on('discover', function(armband) {
	console.log(armband);
});

// Begin discovery
//
agent.discover();
```