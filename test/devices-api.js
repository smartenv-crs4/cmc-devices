/*
 ############################################################################
 ############################### GPL III ####################################
 ############################################################################
 *                         Copyright 2018 CRS4                                 *
 *        This file is part of CRS4 Microservice IOT - Devices (CMC-Devices).      *
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

var should = require('should');
var mongoose = require('mongoose');
var _ = require('underscore')._;
var async = require('async');
var conf = require('../config').conf;
//var request = require('request');
var app = require('../app');
var util = require('util');
var commonFunctioTest = require("./testCommonfunctions");
var request = require('supertest');
var Port = 3014;
var APIURL = 'http://localhost:' + Port + "/api/v0.1/devices/";
var APIURLCATEGORY = 'http://localhost:' + Port + "/api/v0.1/categories/";
var APIURLCONNECTOR = 'http://localhost:' + Port + "/api/v0.1/connectors/";
var adminToken;
var clientUser;
var clientId;
var MStoken = conf.auth_token;
var userStandard = conf.testConfig.userTypeTest;
var idAddedDevice,
  idAddedConnector,
  idAddedCategory;

describe('Devices API', function() {

  before(function(done) {
    commonFunctioTest.setAuthMsMicroservice(function(err) {
      if (err)
        throw(err);
      var url = 'http://localhost:3005/authapp';
      container = request(url);
      container.post('/signin').set('Authorization', "Bearer " + conf.auth_token).send({"username": conf.testConfig.webUiAppTest.email, "password": conf.testConfig.webUiAppTest.password}).end(function(err, res) {
        if (err)
          console.log("######  2 ERRORE should  login a Authuser: " + error + "  ######");
        else {
          res.statusCode.should.be.equal(200);
          var results = res.body;
          results.should.have.property('apiKey');
          adminToken = results.apiKey.token;
        }
        done();
      })
    });
  });

  after(function(done) {
    commonFunctioTest.resetAuthMsStatus(function(err){
         if (err) console.log("######   ERRORE After 1: " + err +"  ######");
         done();
     });
  });

// get all existing devices
  describe('GET /devices', function() {

    it('must return all devices', function(done) {
      container = request(APIURL);
      container.get('').set('Authorization', "Bearer " + adminToken).expect(201).end(function(err, res) {
        if (err)
          return done(err);
        var results = res.body;

        results[0].should.have.property('id');
        results[0].should.have.property('category');
        done();

      });

    });

  });

  // create a category
  describe('POST /categories', function() {

    it('must add one category', function(done) {
      var container = request(APIURLCATEGORY);
      var categoryData = {
        category_name: 'Temp Sensors',
        category_description: 'bla bla bla bla bla bla bla bla',
        category_code: ''
      };
      container.post('').send(categoryData).set('Authorization', "Bearer " + adminToken).expect(201).end(function(err, res) {
        if (err)
          return done(err);
        var category = res.body;
        category.should.have.property('name');
        category.should.have.property('description');
        category.should.have.property('name', 'Temp Sensors')
        idAddedCategory = category._id;
        done();
      })
    });
  });

// get a category by id
  describe('GET /categories/:id', function() {

    it('must return one category', function(done) {
      var container = request(APIURLCATEGORY);
      container.get(idAddedCategory + '/').set('Authorization', "Bearer " + adminToken).expect(201).end(function(err, res) {
        if (err)
          return done(err);
        var device = res.body;
        device.should.have.property('name');
        device.should.have.property('description');
        device.should.have.property('code');
        done();
      })
    });
  });

  // create a connector
  describe('POST /connectors', function() {
    it('must add one connector', function(done) {
      var container = request(APIURLCONNECTOR);
      var connectorData = {
        connector_name: 'Meteo device',
        connector_description: 'A methereologic device connector',
        connector_url: '/devices/meteo/:deviceid'
      };
      container.post('').send(connectorData).set('Authorization', "Bearer " + adminToken).expect(201).end(function(err, res) {
        if (err)
          return done(err);
        var connector = res.body;
        connector.should.have.property('name');
        connector.should.have.property('description');
        connector.should.have.property('url');
        connector.should.have.property('name', 'Meteo device')
        connector.should.have.property('url', '/devices/meteo/:deviceid')
        idAddedConnector = connector._id;
        done();
      })
    });
  });

  // get a connector by id
  describe('GET /connectors/:id', function() {

    it('must return one connector', function(done) {
      var container = request(APIURLCONNECTOR);
      container.get(idAddedConnector + '/').set('Authorization', "Bearer " + adminToken).expect(201).end(function(err, res) {
        if (err)
          return done(err);
        var device = res.body;
        device.should.have.property('name');
        device.should.have.property('description');
        device.should.have.property('url');
        done();
      })
    });
  });

  //add a new device
  describe('POST /devices', function() {

    it('must add one device', function(done) {
      var container = request(APIURL);
      var deviceData = {
        device_id: '1232gdfhsdf',
        device_category_id: idAddedCategory,
        device_description: 'bla bla bla bla ',
        device_connector_id: idAddedConnector,
        device_geo_latitude: '41.234223',
        device_geo_longitude: '43.324234234'
      };
      container.post('').send(deviceData).set('Authorization', "Bearer " + adminToken).expect(201).end(function(err, res) {
        if (err)
          return done(err);
        var device = res.body;
        device.should.have.property('id');
        device.should.have.property('category');
        idAddedDevice = device.id;
        done();
      })
    });
  });

// get a device by id
  describe('GET /devices/:id', function() {

    it('must return one device', function(done) {
      var container = request(APIURL);
      container.get(idAddedDevice + '/').set('Authorization', "Bearer " + adminToken).expect(201).end(function(err, res) {
        if (err)
          return done(err);
        var device = res.body;
        device.should.have.property('id');
        device.should.have.property('category');
        done();
      })
    });
  });

  // read a realtime device data by id
  describe('GET /devices/read/:id', function() {

    it('must return one device', function(done) {

      var container = request(APIURL);
      container.get('read/' + idAddedDevice + '/').set('Authorization', "Bearer " + adminToken).expect(201).end(function(err, res) {
        if (err)
          return done(err);
        var device = res.body;
        device.should.not.be.empty;
        done();
      })
    });
  });

  // delete a device
  describe('DELETE /devices/:id', function() {

    it('must delete one device', function(done) {
      var container = request(APIURL);
      container.delete(idAddedDevice + '/').set('Authorization', "Bearer " + adminToken).expect(201).end(function(err, res) {
        if (err)
          return done(err);
        var response = res.body;
        response.should.have.property('message');
        done();
      })
    });
  });

  // delete a connector
  describe('DELETE /connectors/:id', function() {

    it('must delete one device', function(done) {
      var container = request(APIURLCONNECTOR);
      container.delete(idAddedConnector + '/').set('Authorization', "Bearer " + adminToken).expect(201).end(function(err, res) {
        if (err)
          return done(err);
        var response = res.body;
        response.should.have.property('message');
        done();
      })
    });
  });

  // delete a connector
  describe('DELETE /categories/:id', function() {

    it('must delete one device', function(done) {
      var container = request(APIURLCATEGORY);
      container.delete(idAddedCategory + '/').set('Authorization', "Bearer " + adminToken).expect(201).end(function(err, res) {
        if (err)
          return done(err);
        var response = res.body;
        response.should.have.property('message');
        done();
      })
    });
  });

});
