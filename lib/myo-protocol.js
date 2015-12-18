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

const Service        = require('./core/service');
const Characteristic = require('./core/characteristic');
const Conversion     = new (require('./utils/conversion'));

/**
 * Contains Myo bluetooth protocol constants.
 *
 * Adapted from https://github.com/thalmiclabs/myo-bluetooth
 */

module.exports.services = {

    // Myo-specific services
    //
    control: {
      id: Conversion.getUuidAsStringForShort(0x0001),
      MYO_INFO:           Conversion.getUuidAsStringForShort(0x0101), // Read-only
      FIRMWARE_VERSION:   Conversion.getUuidAsStringForShort(0x0201), // Read-only
      COMMAND:            Conversion.getUuidAsStringForShort(0x0401), // Write-only
    },

    imuData: {
      id: Conversion.getUuidAsStringForShort(0x0002),
      IMU_DATA:           Conversion.getUuidAsStringForShort(0x0402), // Notify-only
      MOTION_EVENT:       Conversion.getUuidAsStringForShort(0x0a02), // Indicate-only
    },

    classifier: {
      id: Conversion.getUuidAsStringForShort(0x0003),
      CLASSIFIER_EVENT:   Conversion.getUuidAsStringForShort(0x0103), // Indicate-only
    },

    emgData: {
      id: Conversion.getUuidAsStringForShort(0x0005),
      EMG_DATA_0: Conversion.getUuidAsStringForShort(0x0105), // Notify-only
      EMG_DATA_1: Conversion.getUuidAsStringForShort(0x0205), // Notify-only
      EMG_DATA_2: Conversion.getUuidAsStringForShort(0x0305), // Notify-only
      EMG_DATA_3: Conversion.getUuidAsStringForShort(0x0405), // Notify-only
    },

    // Standard bluetooth services
    //
    battery: {
      id: '180f',
      BATTERY_LEVEL:  '2a19', // Read/Indicate only
    },

    genericAccess: {
      id: '1800',
      DEVICE_NAME: '2a00'  // Read/write only
    },
};

/**
 * Myo unlock poses interpretation
 */
module.exports.unlockPoses = {
  0x0000 : 'Rest',
  0x0001 : 'Fist',
  0x0002 : 'Wave in',
  0x0003 : 'Wave out',
  0x0004 : 'Fingers spread',
  0x0005 : 'Double tap',
  0xffff : 'Unknown'
};

/**
 * Myo unlock poses interpretation
 */
module.exports.SKU = {
  0x0 : 'Unknown',
  0x1 : 'Black',
  0x2 : 'White'
};

/**
 * Myo unlock poses interpretation
 */
module.exports.HW_REV = {
  0x0: 'HW Revision unknown', ///< Unknown hardware revision.
  0x1: 'Myo Alpha (REV-C)',
  0x2: 'Myo (REV-D)'
};

/**
 * Myo commands
 */
module.exports.MyoCommand = {
  SET_MODE: 0x01, ///< Set EMG and IMU modes.
  VIBRATE: 0x03, ///< Vibrate
  DEEP_SLEEP: 0x04, ///< Put Myo into deep sleep
  EXTEND_VIBRATE: 0x07, ///< Extended vibrate
  SET_SLEEP_MODE: 0x09, ///< Set sleep mode.
  UNLOCK: 0x0a, ///< Unlock Myo.
  USER_ACTION: 0x0b ///< Notify user that an action has been recognized / confirmed.
};

/**
 * EMG modes.
 */
module.exports.EmgMode = {
    NONE: 0x00, ///< Do not send EMG data.
    FILTERED: 0x02, ///< Send filtered EMG data.
    RAW: 0x03 ///< Send raw (unfiltered) EMG data.
};

/// IMU modes.
module.exports.ImuMode = {
    NONE: 0x00, ///< Do not send IMU data or events.
    DATA: 0x01, ///< Send IMU data streams (accelerometer, gyroscope, and orientation).
    EVENTS: 0x02, ///< Send motion events detected by the IMU (e.g. taps).
    ALL: 0x03, ///< Send both IMU data streams and motion events.
    RAW: 0x04 ///< Send raw IMU data streams.
};

/// Classifier modes.
module.exports.ClassifierMode = {
    DISABLED: 0x00, ///< Disable and reset the internal state of the onboard classifier.
    ENABLED: 0x01 ///< Send classifier events (poses and arm events).
};
