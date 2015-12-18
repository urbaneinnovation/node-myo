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

const util		     = require('util');
const debug		     = require('debug')('myo:service');
const co           = require('co');
const Characteristic = require('./characteristic');

function Service(uuid, peripheral) {
  this._characteristics = []; // Discovered characteristics
  Object.defineProperty(this, "id", { get: function () { return uuid; } });
  Object.defineProperty(this, "peripheral", { get: function () { return peripheral; } });
  this._service = null;
}

/**
 * Discovers service on the peripheral
 */
Service.prototype.discover = function () {
  var self = this;
  return new Promise(function (resolve, reject) {
    if (self._service !== null) { resolve(); return; }
    debug('Trying to discover service with UUID ' + self.id);
    self.peripheral.discoverServices([self.id], function (err, services) {
      if (err) {
        error('Error discovering service with UUID ' + self.id + ': ' + err.message);
				reject(err);
      } else {
        if (services.length > 0) {
          debug('Service with UUID ' + self.id + ' discovered');
					self._service = services[0];
					resolve();
				} else {
					var err = new Error('Service ' + self.id + ' not found');
					error('Error discovering services with UUID ' + self.id + ': ' + err.message);
					reject(err);
				}
      }
    });
  });
};
/**
 * Returns the characteristic of the service
 * @param charUUID - UUID of the characteristic to retrieve
 */
Service.prototype._getChar = function (charUUID) {
  var self = this;
  return new Promise(function (resolve, reject) {
    if (self._characteristics[charUUID] !== undefined) {
      resolve(self._characteristics[charUUID]);
      return;
    } else {
      var aCharacteristic = new Characteristic(charUUID, self);
      aCharacteristic.discover().then(function () {
        self._characteristics[charUUID] = aCharacteristic;
        resolve(aCharacteristic);
      }, function (err) {
        reject(err);
      });
    }
  });
};

/**
 * Reads the characteristic of the service
 * @param charUUID - UUID of the characteristic to read
 */
Service.prototype.readChar = function (charUUID) {
  var self = this;
  return co(function *() {
    debug('Trying to read characteristic with UUID ' + charUUID + ' of service ' + self.id);
    var char = yield self._getChar(charUUID);
    if (char.isReadable) {
      return yield char.read();
    } else {
      error('Characteristic with UUID ' + charUUID + ' of service ' + self.id + ' is not readable');
      yield Promise.reject(new Error('Characteristic is not readable'));
    }
  });
};

/**
 * Writes data to the characteristic of the service
 * @param charUUID - UUID of the characteristic to write
 * @param data - data to write
 * @param reliable - is it a reliable write?
 */
Service.prototype.writeChar = function (charUUID, data, reliable) {
  var self = this;
  return co(function *() {
    debug('Trying to write data to characteristic with UUID ' + charUUID + ' of service ' + self.id);
    var char = yield self._getChar(charUUID);
    if (char.isWritable) {
      return yield char.write(data, reliable);
    } else {
      error('Characteristic with UUID ' + charUUID + ' of service ' + self.id + ' is not writable');
      yield Promise.reject(new Error('Characteristic is not writable'));
    }
  });
};

/**
 * Subscribes for the characteristic of the service
 * @param charUUID - UUID of the characteristic to subscribe for
 * @param reliable - false:notify / true:indicate
 * @param dataCB - function to call on data received
 */
Service.prototype.subscribeChar = function (charUUID, reliable, dataCB) {
  var self = this;
  return co(function *() {
    debug('Trying to subscribe for characteristic with UUID ' + charUUID + ' of service ' + self.id);
    var char = yield self._getChar(charUUID);
    reliable = reliable | false;

    if ((!reliable && char.isNotifyable) || (reliable && char.isIndicatable)) {
      return yield char.subscribe(reliable, dataCB);
    } else {
      error('Characteristic with UUID ' + charUUID + ' of service ' + self.id + ' is not notifyable / indicatable');
      yield Promise.reject(new Error('Characteristic is not notifyable / indicatable'));
    }
  });
};

module.exports = Service;
