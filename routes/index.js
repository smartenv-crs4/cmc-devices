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

var express = require('express');
var router = express.Router();
var Device = require('../models/devices').Device;
var commonFunction=require('./commonfunctions');
const version = require('../package.json').version;
const config = require('propertiesmanager').conf;

const auth = require('tokenmanager');
const authField = config.decodedTokenFieldName;

const restApiRoot  = '/api' + (config.restApiVersion !='' ? '/v' + config.restApiVersion : '');

auth.configure({
  authorizationMicroserviceUrl:config.authUrl+ '/tokenactions/checkiftokenisauth',
  decodedTokenFieldName:authField,
  authorizationMicroserviceToken:config.auth_token
});


console.log('###### API ROOT #######' + restApiRoot );
//authms middleware wrapper for dev environment (no authms required)
function authWrap(req, res, next) {
if (!req.app.get("nocheck"))
  auth.checkAuthorization(req, res, next);
else
  next();
}

// get home page
router.get('/', function(req, res, next) {
res.render('index', {title: 'Cmc Devices'});
});

// page for device creation
router.get(restApiRoot + '/createdevice', function(req, res, next) {
 commonFunction.renderCreateDevice(req, res, restApiRoot);
});

// page for device update
router.get(restApiRoot + '/updatedevice/:id', function(req, res, next) {
 commonFunction.renderUpdateDevice(req, res, restApiRoot);
});

// page for category creation
router.get(restApiRoot + '/createcategory', function(req, res, next) {
 commonFunction.renderCreateCategory(req, res, restApiRoot);
});

// page for category creation
router.get(restApiRoot + '/createconnector', function(req, res, next) {
 commonFunction.renderCreateConnector(req, res, restApiRoot);
});

//add a new device
router.post(restApiRoot + '/devices', authWrap, commonFunction.createDevice);

// update a device by id
router.put( restApiRoot + '/devices/:id', authWrap, commonFunction.updateDevice);

// delete a device by id
router.delete( restApiRoot + '/devices/:id', authWrap, commonFunction.deleteDevice);

// get a device by id
router.get( restApiRoot + '/devices/:id', authWrap, commonFunction.getDevicebyID);

// get all devices
router.get( restApiRoot + '/devices', authWrap, commonFunction.getAllDevices);

// read a device by id
router.get( restApiRoot + '/devices/read/:id', authWrap, commonFunction.getReadDevicebyID);

// write device data in cmc iot cache (by id)
router.put( restApiRoot + '/devices/write/:id', authWrap, commonFunction.saveReadDevicebyID);

// get all nearests devices by latitude and longitude
router.get( restApiRoot + '/devices-geo', authWrap, commonFunction.getAllDevicesByGeolocation);

//add a new category
router.post(restApiRoot + '/categories', authWrap, commonFunction.createCategory);

//remove a category
router.delete(restApiRoot + '/categories/:id', authWrap, commonFunction.deleteCategory);

//get a category by id
router.get(restApiRoot + '/categories/:id', authWrap, commonFunction.getCategoryById);

// get all device categories
router.get( restApiRoot + '/categories', authWrap, commonFunction.getAllCategories);

//add a new connector
router.post(restApiRoot + '/connectors', authWrap, commonFunction.createConnector);

//remove a connector
router.delete(restApiRoot + '/connectors/:id', authWrap, commonFunction.deleteConnector);

// get a connector by id
router.get( restApiRoot + '/connectors/:id', authWrap, commonFunction.getConnectorByID);

// get all device connectors
router.get( restApiRoot + '/connectors', authWrap, commonFunction.getAllConnectors);

module.exports = router;
