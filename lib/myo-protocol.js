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

var Service        = require('./core/service');
var Characteristic = require('./core/characteristic');

/**
 * Contains Myo bluetooth protocol constants.
 *
 * Adapted from https://github.com/thalmiclabs/myo-bluetooth
 */
var exports = module.exports;

exports.services = {

    // Myo-specific services
    //
    control: new Service('d506' + '0001' + 'a904deb947482c7f4a124842', {
        MYO_INFO:           new Characteristic('d506' + '0101' + 'a904deb947482c7f4a124842', true, false, false, false), // Read-only
        FIRMWARE_VERSION:   new Characteristic('d506' + '0201' + 'a904deb947482c7f4a124842', true, false, false, false), // Read-only
        COMMAND:            new Characteristic('d506' + '0401' + 'a904deb947482c7f4a124842', false, true, false, false), // Write-only
    }),

    imuData: new Service('d506' + '0002' + 'a904deb947482c7f4a124842', {
        IMU_DATA:           new Characteristic('d506' + '0402' + 'a904deb947482c7f4a124842', false, false, true, false), // Notify-only
        MOTION_EVENT:       new Characteristic('d506' + '0a02' + 'a904deb947482c7f4a124842', false, false, false, true), // Indicate-only
    }),

    classifier: new Service('d506' + '0003' + 'a904deb947482c7f4a124842', {
        CLASSIFIER_EVENT:   new Characteristic('d506' + '0103' + 'a904deb947482c7f4a124842', false, false, false, true), // Indicate-only
    }),

    emgData: new Service('d506' + '0005' + 'a904deb947482c7f4a124842', {
        EMG_DATA_0: new Characteristic('d506' + '0105' + 'a904deb947482c7f4a124842', false, false, true, false), // Notify-only
        EMG_DATA_1: new Characteristic('d506' + '0205' + 'a904deb947482c7f4a124842', false, false, true, false), // Notify-only
        EMG_DATA_2: new Characteristic('d506' + '0305' + 'a904deb947482c7f4a124842', false, false, true, false), // Notify-only
        EMG_DATA_3: new Characteristic('d506' + '0405' + 'a904deb947482c7f4a124842', false, false, true, false), // Notify-only
    }),

    // Standard bluetooth services
    //
    battery: new Service('180f', {
        BATTERY_LEVEL:  new Characteristic('2a19', true, false, true, false), // Read/Indicate only
    }),

    genericAccess: new Service('1800', {
        DEVICE_NAME:    new Characteristic('2a00', true, true, false, false)  // Read/write only
    }),
};