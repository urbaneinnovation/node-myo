# node-myo

node-myo is a Node.js library for connecting directly to Myo armbands via Thalmic Lab's published Bluetooth protocol. Created for use on Mac OS or Linux out of the box, with Windows support contingent on having the Windows Developer SDK installed on your system. The project is WIP and can be used to connect to armband, retrieve band's information and EMG data.

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

## Promises

All functions to node-myo Armband returns promises that can be used instead of callbacks:

## Discovering

The following will start scanning for Myo armbands, and log those found.

```javascript
var nm = require('node-myo');

var agent = new nm.MyoDiscoveryAgent();

// Register listener
//
agent.on('found', function(armband) {
	console.log(armband);
});

// Begin discovery
//
agent.discover();
```

## Connect

To connect to discovered armband call `connect` function:

```javascript
armband.connect(function (err) {
	if (err) { console.error('Armband connect error:', err); }
	else { console.log('Successfully connected to the armband'); }
});
```

or promised version:

```javascript
armband.connect().then(function () {
	console.log('Successfully connected to the armband');
}, function (err) {
	console.error('Armband connect error:', err);
});
```

## Get band info

To retrieve information about armband call `getInfo`, `getFirmware` and `getBattery`:

```javascript
armband.getBattery(function (err, lvl) {
	if (err) { console.error('Armband get battery level error:', err); }
	else { console.log('Battery level is ', lvl); }
});
```

or promised version:

```javascript
armband.getInfo().then(function () {
	console.log('Battery level is ', lvl);
}, function (err) {
	console.error('Armband get battery level error:', err);
});
```

or [co](https://github.com/tj/co)-way:

```javascript
co(function* () {
	var info = yield armband.getInfo();
	console.log('INFO: info: ', info);
	var fw = yield armband.getFirmware();
	console.log('INFO: firmware: ', fw);
	var bat = yield armband.getBattery();
	console.log('INFO: battery: ', bat);
});
```

## Set mode

Before subscribing for armband data you need to set it to the appropriate mode. You want to call `setMode` function to it. It accepts 3 string
arguments:

 - EMG mode - possible values: 'none', 'filtered', 'raw'
 - IMU mode - possible values: 'none', 'data', 'events', 'all', 'raw'
 - Classifier mode - possible values: 'disabled', 'enabled'

More of the modes [here](https://github.com/thalmiclabs/myo-bluetooth/blob/master/myohw.h#L162)

```javascript
armband.setMode('raw', 'none', 'disabled').then(function () {
	console.log('Set mode succeed');
}, function (err) {
	console.error('Set mode failed:', err);
});
```

## Subscribe to EMG data

After you set the desired armband functionality mode you can subscribe to EMG data. To get the EMG data you want to subsribe to 'emg' event of Armband object.

```javascript
armband.subscribeToEMG().then(function () {
	console.log('Subscribed for EMG data');
}, function (err) {
	console.error('Subscription for EMG data failed:', err);
});
```

## Debug

Module is using [debug](https://github.com/visionmedia/debug) module. To turn on debug messages, set environment variable DEBUG to myo:*. Example:

```javascript
DEBUG=myo:* node exampleMyo.js
```
