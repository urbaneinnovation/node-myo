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

// Prints a list of all found armbands to the console.
//

var MyoDiscoveryAgent = require('../lib/discovery/myo-discovery-agent');

var agent = new MyoDiscoveryAgent();

// Catch errors
//
agent.on('error', function(error) {
  	console.log(error);
  	agent.stopDiscovering();
});

// Discover/scan
//
console.log('INFO: Discovering armbands...');
agent.discover();

// Log when discovered
//
agent.on('found', function(armband) {
	console.log('INFO: Found an armband:');
  	console.log(armband);
});

// Stop discovering after five seconds
//
setTimeout(function() {
	agent.stopDiscovering();

	console.log('INFO: Ended discovery!');
	console.log('INFO: Exiting...');

	process.exit();

}, 5 * 1000);