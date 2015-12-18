/*
 * The MIT License (MIT)
 *
 * Copyright (c) 2015 Urbane Innovation, LLC
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

var util		    = require('util');
var events		  = require('events');
var noble 		  = require('noble');
var debug		    = require('debug')('myo:discovery');
var error		    = require('debug')('myo:discovery:error');
var myoProtocol = require('../myo-protocol');
var conversion  = require('../utils/conversion');

var Armband     = require('../core/armband');

// Handles noble 'discover' events.
//
var _handleNobleDiscover = function(peripheral) {

	// Assume that if a service UUID is found that matches that specified in Myo's published protocol,
	// we've found a Myo armband.
	//
	// Fires a 'found' event when the armband is found, and attached the `Armband` instance to it.
	//
	debug('INFO: Found new armband! Adding to device list.');
	var armband = new Armband(peripheral);
	this.emit('found', armband);
};

// Handle noble 'stateChange' events
//
var _handleNobleStateChange = function(state) {

	// If the device is unpowered, or the state is anything other than 'poweredOn',
	// we stop scanning and emit an 'error' event. Otherwise, noble#startScanning()
	// will fire a 'discover' event when a device is found with the provided UUID(s).
	//
	if (state === 'poweredOn') {
		debug('INFO: Started BLE scan for devices offering Myo Control Service UUID (' + myoProtocol.services.control.id + ')');
		noble.startScanning([myoProtocol.services.control.id]);
	}
	else {
		error('ERROR: State was ' + state + ' instead of "poweredOn." Ending BLE scan.');
		noble.stopScanning();

		this.emit('error', 'ERROR: Device is ' + state + '. Unable to begin device scan!');
	}
};

/**
 * Object creation
 */
function MyoDiscoveryAgent() {
	events.EventEmitter.call(this);
}

util.inherits(MyoDiscoveryAgent, events.EventEmitter);

MyoDiscoveryAgent.prototype.constructor = MyoDiscoveryAgent;

MyoDiscoveryAgent.prototype.discover = function() {

	debug('INFO: Beginning Myo discovery');

	// Attach listeners
	//
	noble.on('discover', _handleNobleDiscover.bind(this));
	noble.on('stateChange', _handleNobleStateChange.bind(this));
};

MyoDiscoveryAgent.prototype.stopDiscovering = function() {

	debug('INFO: Ending Myo discovery');

	// End subcription to noble 'stateChange' events.
	//
	noble.removeAllListeners('stateChange', _handleNobleDiscover.bind(this));
	noble.removeAllListeners('discover', _handleNobleStateChange.bind(this));
};

/**
 * Object export
 */
module.exports = MyoDiscoveryAgent;
