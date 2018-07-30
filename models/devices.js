/*
 ############################################################################
 ############################### GPL III ####################################
 ############################################################################
 *                         Copyright 2018 CRS4                                 *
 *       This file is part of CRS4 Microservice IOT - Devices (CMC-Devices).       *
 *                                                                            *
 *       CMC-Devices is free software: you can redistribute it and/or modify     *
 *     it under the terms of the GNU General Public License as published by   *
 *       the Free Software Foundation, either version 3 of the License, or    *
 *                    (at your option) any later version.                     *
 *                                                                            *
 *       CMC-Devices is distributed in the hope that it will be useful,          *
 *      but WITHOUT ANY WARRANTY; without even the implied warranty of        *
 *       MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the        *
 *               GNU General Public License for more details.                 *
 *                                                                            *
 *       You should have received a copy of the GNU General Public License    *
 *       along with CMC-Devices.  If not, see <http://www.gnu.org/licenses/>.    *
 * ############################################################################
 */
var mongoose = require('mongoose');
var _ = require('underscore');
var Schema = mongoose.Schema;
var  ObjectId = Schema.ObjectId;
var Category = require('../models/devices').Category;

// create a device schema
var DeviceSchema = new Schema({
  id: {$type: String, required: [true, 'Why no ID?'], index: { unique: true }}, // [{type: Schema.Types.ObjectId, ref: 'Category'}]
  category:  [{ $type: Schema.Types.ObjectId, ref: 'Category', required: [true, 'Why no category?'] }],
  description: String,
  connector: [{ $type: Schema.Types.ObjectId, ref: 'Connector', required: [true, 'Why no connector?'] }],
  // attributes: {
  //   latitude: Number,
  //   longitude: Number
  // },
  loc: {
     type: {$type: String, default: "Point"},
     coordinates: [Number],
   }
}, {timestamps: true,  typeKey: '$type' });
DeviceSchema.index({'loc': '2dsphere'});
// create a device model
var Device = mongoose.model('devices', DeviceSchema);
module.exports.DeviceSchema = DeviceSchema;
module.exports.Device = Device;
