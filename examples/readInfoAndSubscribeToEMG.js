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

var MyoDiscoveryAgent = require('..').MyoDiscoveryAgent;
var co = require('co');

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

// Connect to armband on discovery
//
agent.on('found', function(armband) {
	console.log('INFO: Found an armband! Attempting to connect...');

  co(function* () {
  	// Connect
  	//
    yield armband.connect();
    console.log('INFO: Armband connected!');

    console.log('INFO: Stop discovering...');
		agent.stopDiscovering();

    var info = yield armband.getInfo();
    console.log('INFO: info: ', info);

    var fw = yield armband.getFirmware();
    console.log('INFO: firmware: ', fw);

    var bat = yield armband.getBattery();
    console.log('INFO: battery: ', bat);

    var modeRes = yield armband.setMode('raw', 'none', 'disabled');
    console.log('INFO: Set mode result: ', modeRes);

    armband.on('emg', function (arrData) {
      console.log("EMG_"+arrData[0]+': ', arrData[1]);
    });

    var subscrRes = yield armband.subscribeForEMG();
    console.log('INFO: Subscribe EMG result: ', subscrRes);

  }).catch(function (err) {
    console.log('Error: ', err.stack);
  });
});
