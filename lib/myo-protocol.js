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


/**
 * Contains Myo bluetooth protocol constants.
 *
 * Adapted from https://github.com/thalmiclabs/myo-bluetooth
 */
var MYO_SERVICE_INFO_UUID = [
    0x42, 0x48, 0x12, 0x4a,
    0x7f, 0x2c, 0x48, 0x47,
    0xb9, 0xde, 0x04, 0xa9,
    0x01, 0x00, 0x06, 0xd5
];

var MYO_SERVICE_BASE_UUID  = [
    0x42, 0x48, 0x12, 0x4a,
    0x7f, 0x2c, 0x48, 0x47,
    0xb9, 0xde, 0x04, 0xa9,
    0x00, 0x00, 0x06, 0xd5
];

var services = {
    CONTROL_SERVICE                		: 0x0001, ///< Myo info service
    MYO_INFO_CHARACTERISTIC         	: 0x0101, ///< Serial number for this Myo and various parameters which
                                            	  ///< are specific to this firmware. Read-only attribute. 
                                            	  ///< See myohw_fw_info_t.
    FIRMWARE_VERSION_CHARACTERISTIC 	: 0x0201, ///< Current firmware version. Read-only characteristic.
                                            	  ///< See myohw_fw_version_t.
    COMMAND_CHARACTERISTIC         		: 0x0401, ///< Issue commands to the Myo. Write-only characteristic.
                                            	  ///< See myohw_command_t.

    IMU_DATA_SERVICE                	: 0x0002, ///< IMU service
    IMU_DATA_CHARACTERISTCI         	: 0x0402, ///< See myohw_imu_data_t. Notify-only characteristic.
    MOTION_EVENT_CHARACTERISTIC     	: 0x0a02, ///< Motion event data. Indicate-only characteristic.

    CLASSIFIER_SERVICE             		: 0x0003, ///< Classifier event service.
    CLASSIFIER_EVENT_CHARACTERISTIC		: 0x0103, ///< Classifier event data. Indicate-only characteristic. See myohw_pose_t.

    EMG_DATA_SERVICE      				: 0x0005, ///< Raw EMG data service.
    EMG_DATA_0_CHARACTERISTIC        	: 0x0105, ///< Raw EMG data. Notify-only characteristic.
    EMG_DATA_1_CHARACTERISTIC        	: 0x0205, ///< Raw EMG data. Notify-only characteristic.
    EMG_DATA_2_CHARACTERISTIC        	: 0x0305, ///< Raw EMG data. Notify-only characteristic.
    EMG_DATA_3_CHARACTERISTIC        	: 0x0405 ///< Raw EMG data. Notify-only characteristic.
};

module.exports = {
	services: services,
	MYO_SERVICE_BASE_UUID: MYO_SERVICE_BASE_UUID,
	MYO_SERVICE_INFO_UUID: MYO_SERVICE_INFO_UUID
};