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

var proxyquire	= require('proxyquire');
var util 		= require('util');
var events		= require('events');
var chai 		= require('chai');
var assert 		= chai.assert;

var Armband		= require('../../lib/core/armband');

// Mock noble definition
//
function MockNoble() {
	this.startScanning	= function() {};
	this.stopScanning	= function() {};
}

util.inherits(MockNoble, events.EventEmitter);

describe('MyoDiscoveryAgent', function() {

	describe('#discover()', function() {

		it('emits error when noble state is other than "poweredOn"', function(done) {
			// Arrange
			//
			var mockNoble = new MockNoble();
			var PoweredOffMyoDiscoveryAgent = proxyquire('../../lib/discovery/myo-discovery-agent', { 
				'noble': mockNoble
			});
			var agent = new PoweredOffMyoDiscoveryAgent();

			// Assert
			//
			agent.on('error', function() {
				agent.removeAllListeners();
				agent.stopDiscovering();
				done();
			});

			// Act
			//
			agent.discover();
			mockNoble.emit('stateChange', 'poweredOff');
		});

		it('starts scanning for Myo control service UUID when noble state is "poweredOn"', function(done) {
			// Arrange
			//
			var mockNoble = new MockNoble();
			var PoweredOffMyoDiscoveryAgent = proxyquire('../../lib/discovery/myo-discovery-agent', { 
				'noble': mockNoble
			});
			var agent = new PoweredOffMyoDiscoveryAgent();
			var myoControlServiceUuid = 'd5060001a904deb947482c7f4a124842';

			// Assert
			//
			mockNoble.startScanning = function(uuid) {
				assert.equal(uuid, myoControlServiceUuid);
				agent.stopDiscovering();
				done();
			};

			// Act
			//
			agent.discover();
			mockNoble.emit('stateChange', 'poweredOn');
		});
	});
});