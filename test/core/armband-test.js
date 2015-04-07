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

var util 	= require('util');
var events	= require('events');
var chai 	= require('chai');
var assert 	= chai.assert;

var Armband = require('../../lib/core/armband');

// Mock peripheral definition
//
function MockPeripheral(state) {
	this.state = state;
}
util.inherits(MockPeripheral, events.EventEmitter);


MockPeripheral.prototype.connect = function(e) {
	this.emit('connect', e);
};

describe('Armband', function() {
	describe('#connect()', function() {
		it('should propagate connect event', function(done) {

			// Create mock event data
			//
			var mockEventData = 'foo';

			// Instantiate Subject Under Test
			//
			var sut = new Armband(new MockPeripheral('disconnected'));

			// Add connect listener and test case pass
			//
			sut.on('connect', function(e) {
				assert.equal(e, mockEventData);
				done();
			});

			// Act
			//
			sut.connect(mockEventData);

		});
	});
});