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

'use strict';

const util					= require('util');
const EventEmitter	= require('events');
const debug					= require('debug')('myo:armband');
const error 				= require('debug')('myo:armband:error');
const myoProtocol 	= require('../myo-protocol');
const Service				= require('./service');
const co						= require('co');

// Handles EMG data from the armband
//
var _handleEMGData = function(num, data) {
	this.emit('emg', [num, data]);
};

/**
 * Object creation
 */
function Armband(peripheral) {
	this._peripheral = peripheral;
	this._services = {};
	debug("INFO: Created new armband!");
	EventEmitter.call(this);
}

util.inherits(Armband, EventEmitter);

Armband.prototype.constructor = Armband;

/**
 * Object functionality
 */
Armband.prototype.connect = function(callback) {
	var self = this;
	return new Promise(function(resolve, reject) {

		if (self._peripheral.state === 'connected') {
			debug('WARN: Device already connected');
			if (typeof callback === 'function') { callback(); }
			resolve();
		}
		else {
			// Listen for noble 'connect' events, and re-emit them in the Armband
			// object for clients to listen for.
			//
			self._peripheral.on('connect', function(e) {
				self.emit('connect', e);
			});

			// Execute noble connect
			//
			self._peripheral.connect(function(err) {
				if (err) {
					if (typeof callback === 'function') { callback(err); }
					reject(err);
				}
				else {
					if (typeof callback === 'function') { callback(); }
					resolve();
				}
			});
		}
	});
};

/**
 * Returns the requested service from GATT server
 * @param service - service dictionary from myo-protocol.js
 */
Armband.prototype._getService = function (service) {
	var self = this;
	return new Promise(function (resolve, reject) {
		if (self._services[service.id] !== undefined) {
			resolve(self._services[service.id]);
			return;
		} else {
			var aService = new Service(service.id, self._peripheral);
			aService.discover().then(function () {
				self._services[service.id] = aService;
				resolve(aService);
			}, function (err) {
				reject(err);
			});
		}
	});
}

/**
 * Returns information about the armband
 * @param callback - function to call on result (err, dict)
 */
Armband.prototype.getInfo = function (callback) {
	var self = this;
	var promise = co(function *() {
		var service = yield self._getService(myoProtocol.services.control);
		var data = yield service.readChar(myoProtocol.services.control.MYO_INFO);
		if (data.length === 20) {
			var obj = {}, offset = 0, n;
			obj.serial = new Buffer(data.slice(offset, 6)); offset += 6;
			n = data.readUInt16LE(offset); offset += 2;
			if (myoProtocol.unlockPoses[n] !== undefined) obj.unlockPose = myoProtocol.unlockPoses[n];
			else obj.unlockPose = myoProtocol.unlockPoses[0xffff];
			obj.activeClassifierType = data.readUInt8(offset++);
			obj.activeClassifierIdx = data.readUInt8(offset++);
			obj.hasCustomClassifier = data.readUInt8(offset++);
			obj.streamIndicating = data.readUInt8(offset++);
			n = data.readUInt8(offset++);
			if (myoProtocol.SKU[n] !== undefined) obj.SKU = myoProtocol.SKU[n];
			else obj.SKU = myoProtocol.SKU[0x0];
			if (typeof callback === 'function') callback(undefined, obj);
			return obj;
		} else {
			var err = new Error('Unable to retrieve armband info');
			if (typeof callback === 'function') callback(err);
			yield Promise.reject(err);
		}
	});
	if (typeof callback === 'function') {
		promise.then(function (val) { callback(undefined, val); }, function (err) { callback(err); } );
	}
	return promise;
};

/**
 * Returns firmware information
 * @param callback - function to call on result (err, string)
 */
Armband.prototype.getFirmware = function (callback) {
	var self = this;
	var promise = co(function *() {
		var service = yield self._getService(myoProtocol.services.control);
		var data = yield service.readChar(myoProtocol.services.control.FIRMWARE_VERSION);
		if (data.length === 8) {
			var res = '', offset = 0, num = 0;
			num = data.readUInt16LE(offset); offset += 2; res += num+'.';
			num = data.readUInt16LE(offset); offset += 2; res += num+'.';
			num = data.readUInt16LE(offset); offset += 2; res += num+' ';
			num = data.readUInt16LE(offset);
			if (myoProtocol.HW_REV[num] !== undefined) res += myoProtocol.HW_REV[num];
			else res += myoProtocol.HW_REV[0x0];
			if (typeof callback === 'function') callback(undefined, res);
			return res;
		} else {
			var err = new Error('Unable to retrieve armband info');
			if (typeof callback === 'function') callback(err);
			yield Promise.reject(err);
		}
		return data;
	});
	if (typeof callback === 'function') {
		promise.then(function (val) { callback(undefined, val); }, function (err) { callback(err); } );
	}
	return promise;
};

/**
 * Returns battery level of the armband
 * @param callback - function to call on result (err, batteryValue)
 */
Armband.prototype.getBattery = function (callback) {
	var self = this;
	var promise = co(function *() {
		var service = yield self._getService(myoProtocol.services.battery);
		var data = yield service.readChar(myoProtocol.services.battery.BATTERY_LEVEL);
		return data.readUInt8(data);
	});
	if (typeof callback === 'function') {
		promise.then(function (val) { callback(undefined, val); }, function (err) { callback(err); } );
	}
	return promise;
};

/**
 * Sets Armband modes
 * @param emgMode - possible values: 'none', 'filtered', 'raw'
 * @param imuMode - possible values: 'none', 'data', 'events', 'all', 'raw'
 * @param classifierMode - possible values: 'disabled', 'enabled'
 * @param callback - function to call on result (err)
 */
Armband.prototype.setMode = function (emgMode, imuMode, classifierMode, callback) {
	var self = this;
	var promise = co(function *() {
		var service = yield self._getService(myoProtocol.services.control);
		var data = new Buffer(5);
		data[0] = myoProtocol.MyoCommand.SET_MODE;
		data[1] = 0x3;
		data[2] = myoProtocol.EmgMode[emgMode.toUpperCase()];
		data[3] = myoProtocol.EmgMode[imuMode.toUpperCase()];
		data[4] = myoProtocol.EmgMode[classifierMode.toUpperCase()];
		return service.writeChar(myoProtocol.services.control.COMMAND, data);
	});
	if (typeof callback === 'function') {
		promise.then(function (val) { callback(undefined, val); }, function (err) { callback(err); } );
	}
	return promise;
};
/**
 * Subscribes for the EMG data. EMG data will emit 'emg' event with format [emgInd, data]
 * @param callback - function to call with subscribe result
 */
Armband.prototype.subscribeForEMG = function (callback) {
	var self = this;
	var promise = co(function *() {
		var service = yield self._getService(myoProtocol.services.emgData);
		return co(function *() {
			return yield [
				service.subscribeChar(myoProtocol.services.emgData.EMG_DATA_0, false, _handleEMGData.bind(self,0)),
				service.subscribeChar(myoProtocol.services.emgData.EMG_DATA_1, false, _handleEMGData.bind(self,1)),
				service.subscribeChar(myoProtocol.services.emgData.EMG_DATA_2, false, _handleEMGData.bind(self,2)),
				service.subscribeChar(myoProtocol.services.emgData.EMG_DATA_3, false, _handleEMGData.bind(self,3))
			];
		});
	});
	if (typeof callback === 'function') {
		promise.then(function (val) { callback(undefined, val); }, function (err) { callback(err); } );
	}
	return promise;
};

/**
 * Object export
 */
module.exports = Armband;
