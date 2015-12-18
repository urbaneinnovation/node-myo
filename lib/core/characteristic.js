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
const debug		     = require('debug')('myo:characteristic');
const error		     = require('debug')('myo:characteristic:error');

function Characteristic(uuid, service) {
  Object.defineProperty(this, "id", { get: function () { return uuid; } });
  Object.defineProperty(this, "service", { get: function () { return service; } });
  this._char = null;

  Object.defineProperty(this, "isReadable", { get: function () { return this._char.properties.includes('read'); } });
  Object.defineProperty(this, "isWritable", { get: function () { return this._char.properties.includes('write'); } });
  Object.defineProperty(this, "isNotifyable", { get: function () { return this._char.properties.includes('notify'); } });
  Object.defineProperty(this, "isIndicatable", { get: function () { return this._char.properties.includes('indicate'); } });
}


/**
 * Discovers service on the peripheral
 */
Characteristic.prototype.discover = function () {
  var self = this;
  return new Promise(function (resolve, reject) {
    if (self._char !== null) { resolve(); return; }
    debug('Trying to discover characteristic with UUID ' + self.id + 'in service ' + self.service.id);
    self.service._service.discoverCharacteristics([self.id], function (err, chars) {
      if (err) {
        error('Error discovering characteristic with UUID ' + self.id + ': ' + err.message);
				reject(err);
      } else {
        if (chars.length > 0) {
          debug('Characteristic with UUID ' + self.id + ' discovered');
					self._char = chars[0];
          resolve();
				} else {
					var err = new Error('Characteristic ' + self.id + ' not found');
					error('Error discovering characteristic with UUID ' + self.id + ': ' + err);
					reject(err);
				}
      }
    });
  });
};

/**
 * Reads from the characteristic
 */
Characteristic.prototype.read = function () {
  var self = this;
  return new Promise(function (resolve, reject) {
    debug('Reading characteristic with UUID ' + self.id + ' of service' + self.service.id);
    self._char.read(function (err, data) {
      if (err) { reject(err); }
      else { resolve(data); }
    });
  });
};

/**
 * Write to the characteristic
 * @param data - data to write
 * @param reliable - if need a reliable write. Default false
 */
Characteristic.prototype.write = function (data, reliable) {
  var self = this;
  reliable = reliable | false;
  return new Promise(function (resolve, reject) {
    debug('Writing to characteristic with UUID ' + self.id + 'of service' + self.service.id);
    self._char.write(data, reliable, function (err) {
      if (err) { reject(err); }
      else { resolve(true); }
    });
  });
};

/**
 * Subscribe for the characteristic
 * @param reliable - false:notify / true:indicate
 * @param dataCB - function to call on data received
 */
Characteristic.prototype.subscribe = function (reliable, dataCB) {
  var self = this;
  return new Promise(function (resolve, reject) {
    debug('Subscribing for characteristic with UUID ' + self.id + ' of service ' + self.service.id);
    self._char.notify(!reliable, function (err) {
      if (err) { reject(err); }
      else { resolve(true); }
    });
    self._char.on('data', dataCB);
  });
};

module.exports = Characteristic;

// Polyfill for includes
if (![].includes) {
  require('array-includes').shim();
}
