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

var Device = require('../models/devices').Device;
var Category = require('../models/categories').Category;
var Connector = require('../models/connectors').Connector;
var domainUrl = process.env.HOST || 'localhost:' + (process.env.PORT || 3014);
var config = require('propertiesmanager').conf;
var request = require('request');

/**
 * createDevice - create a new device
 *
  * @param  {http.ClientRequest} req an http request
  * @param  {http.ServerResponse} res an http rsponse
  * @param  {requestCallback} next  invoke the next route handler
  * @return {http.ServerResponse} an http response
 */
exports.createDevice = function(req, res, next) {
  var message = 'Device Added Successfully';
  var id = null;
  Device.findOne({
    id: req.body.device_id
  }, function(err, device) {
    if (err) {
      message = 'Device check error ';
      return res.status(500).json(
        {
        "error": 500,
        "errorMessage": message,
        "moreInfo": config.urlSupport + "500"
        });
    }
    if (device) {
      message = 'Device already exist ';
      return res.status(401).json(
        {
        "error": 401,
        "errorMessage": message,
        "moreInfo": config.urlSupport + "401"
        });
    }

    var device = new Device({
      id: req.body.device_id,
      category: req.body.device_category_id,
      description: req.body.device_description,
      connector: req.body.device_connector_id,
      attributes: {
        latitude: req.body.device_geo_latitude,
        longitude: req.body.device_geo_longitude
      }
    });

    device.save(function(err) {
      if (err) {
        message = 'Problems while saving devices ';
        return res.status(500).json(
          {
          "error": 500,
          "errorMessage": message,
          "moreInfo": config.urlSupport + "500"
          });
      }

      res.set('Location', '/devices/' + device.id);
      res.status(201).send(device.toJSON());
    });
  });
};

/**
 * getAllDevices - Returns all devices
 *
  * @param  {http.ClientRequest} req an http request
  * @param  {http.ServerResponse} res an http rsponse
  * @return {http.ServerResponse} an http response
 */
exports.getAllDevices = function(req, res) {
  // Retrieve and return all notes from the database.
  Device.find(function(err, devices) {
    if (err) {
      var message = "Error finding all devices";
      res.status(500).json(
        {
        "error": 500,
        "errorMessage": message,
        "moreInfo": config.urlSupport + "500"
        });
    } else {
      res.status(201).send(devices);
    }
  });
};

/**
 * getDevicebyID - returns a device by id
 *
  * @param  {http.ClientRequest} req an http request
  * @param  {http.ServerResponse} res an http rsponse
  * @param  {requestCallback} next  invoke the next route handler
  * @return {http.ServerResponse} an http response
 */
exports.getDevicebyID = function(req, res, next) {
  var idDevice = (req.params.id).toString();

  Device.findOne({id: idDevice}).populate({path: 'category', model: 'categories'}).populate({path: 'connector', model: 'connectors'}).exec(function(err, device) {
    if (err) {
      var message  = "Error finding a device with id: " + req.params.id;
      return res.status(500).json(
        {
        "error": 500,
        "errorMessage": message,
        "moreInfo": config.urlSupport + "500"
        });
    }

    if (device) {
      return res.status(200).json(device.toJSON({virtuals: true}));
    }
    res.status(404).send({
      "error": 404,
      "errorMessage": "Could not find a device with id: " + req.params.id,
      "moreInfo": domainUrl + "/v1/support/404"
    });
  });
};

/**
 * getReadDevicebyID - read a realtime device data from the middleware
 *
  * @param  {http.ClientRequest} req an http request
  * @param  {http.ServerResponse} res an http rsponse
  * @param  {requestCallback} next  invoke the next route handler
  * @return {http.ServerResponse} an http response
 */
exports.getReadDevicebyID = function(req, res, next) {
  var idDevice = (req.params.id).toString();

  Device.findOne({id: idDevice}).populate({path: 'category', model: 'categories'}).populate({path: 'connector', model: 'connectors'}).exec(function(err, device) {
    if (err) {
      var message  = "Error finding a device with id: " + req.params.id;
      return res.status(500).json(
        {
        "error": 500,
        "errorMessage": message,
        "moreInfo": config.urlSupport + "500"
        });
    }

    if (device && device.connector.length) {
      console.log("Endpoint of device:**** " + domainUrl + device.connector[0].url);
      var endpoint = (device.connector[0].url).toString();
      var endPointToCall = endpoint.replace(/:deviceid/g, idDevice);
      var body = [];
      request.get(config.connectorDomainUrl + endPointToCall).on('data', function(data) {
        body.push(data);
      }).on('end', function() {
        console.log("URL PATH::"  + endPointToCall);
        body = Buffer.concat(body).toString();
        console.log(body);
        try {
          return res.status(201).json(JSON.parse(body));
        } catch (e) {
          console.error(e);
          var message  = e.message;
          return res.status(500).json(
            {
            "error": 500,
            "errorMessage": message,
            "moreInfo": config.urlSupport + "500"
            });
        }
      }).on('error', function(err) {
        res.status(404).send({
          "error": 404,
          "errorMessage": "Problem to retrieve device data from middleware " + req.params.id,
          "moreInfo": config.urlSupport + "400"
        });
      })

    } else {
      var message  = "Error retrieving device data";
      return res.status(500).json(
        {
        "error": 500,
        "errorMessage": message,
        "moreInfo": config.urlSupport + "500"
        });
    }
  });
};

/**
 * updateDevice - update a device data
 *
  * @param  {http.ClientRequest} req an http request
  * @param  {http.ServerResponse} res an http rsponse
  * @param  {requestCallback} next  invoke the next route handler
  * @return {http.ServerResponse} an http response
 */
 exports.updateDevice = function(req, res, next) {
  // Update a note identified by the noteId in the request
  Device.findOne({
    id: req.params.id
  }, function(err, device) {
    if (err) {
      console.log(err);
      var message  = "Error finding a device with id " + req.params.id;
      return res.status(500).json(
        {
        "error": 500,
        "errorMessage": message,
        "moreInfo": config.urlSupport + "500"
        });
    }

    device.endpoint = req.body.device_endpoint;
    device.category = req.body.device_category_id;
    device.description = req.body.device_description;
    device.connector = req.body.device_connector_id;
    device.attributes = {
      latitude: req.body.device_geo_latitude,
      longitude: req.body.device_geo_longitude
    };

    device.save(function(err, data) {
      if (err) {
        var message  = "Error updating a device with id " + req.params.id + ' ' + err.message;
        return res.status(500).json(
          {
          "error": 500,
          "errorMessage": message,
          "moreInfo": config.urlSupport + "500"
          });
      } else {
        res.set('Location', '/devices/' + device.id);
        res.status(201).send(device.toJSON());
      }
    });
  });
};

/**
 * deleteDevice - delete a device from the system
 *
 * @param  {http.ClientRequest} req an http request
 * @param  {http.ServerResponse} res an http rsponse
 * @return {http.ServerResponse} an http responser
 */
exports.deleteDevice = function(req, res) {
  if (!req.params.id) {
    var message  = "No device to delete with id: " + req.params.id;
    return res.status(404).json(
      {
      "error": 404,
      "errorMessage": message,
      "moreInfo": config.urlSupport + "404"
      });

  }
  Device.remove({
    id: req.params.id
  }, function(err, device) {
    if (err) {
      var message  = "Error deleting a device with id " + req.params.id;
      return res.status(500).json(
        {
        "error": 500,
        "errorMessage": message,
        "moreInfo": config.urlSupport + "500"
        });
    }
    res.status(201).send({
      "message": "Success deleting a device with id " + req.params.id
    });
  });
};


/**
 * getAllCategories - retrieve all categories
 *
 * @param  {http.ClientRequest} req an http request
 * @param  {http.ServerResponse} res an http rsponse
 * @return {http.ServerResponse} an http responser
 */

exports.getAllCategories = function(req, res) {
  // Retrieve and return all notes from the database.
  Category.find(function(err, categories) {
    if (err) {
      var message  = "Error finding all categories";
      return res.status(500).json(
        {
        "error": 500,
        "errorMessage": message,
        "moreInfo": config.urlSupport + "500"
        });

    } else {
      res.status(201).send(categories);
    }
  });
};

/**
 * renderCreateDevice - render a view to create a new device
 *
 * @param  {http.ClientRequest} req an http request
 * @param  {http.ServerResponse} res an http rsponse
 * @param  {String} restApiRoot  a rest api url
 * @return {http.ServerResponse} an html page
 */
exports.renderCreateDevice = function(req, res, restApiRoot) {
  // Retrieve and return all categories from the database.
  Category.find().then(categories => {
    return Connector.find().then(connectors => {
      res.render('create-device', {
        title: 'Cmc Devices',
        section: 'Add a new device',
        urlForm: restApiRoot + '/devices',
        categories: categories,
        connectors: connectors,
        token: config.auth_token
      });
    }).catch(err => {
    console.log('No device connectors...');
      res.render('error', {
        messages: 'No device connectors...',
        error: err
      });
    });
  }).catch(err => {
      console.log('No device categories...');
      res.render('error', {
        messages: 'No device categories...',
        error: err
      });
  });
};

/**
 * renderUpdateDevice - render a view to update a device data
 *
 * @param  {http.ClientRequest} req an http request
 * @param  {http.ServerResponse} res an http rsponse
 * @param  {String} restApiRoot  a rest api url
 * @return {http.ServerResponse} an http response
 */
exports.renderUpdateDevice = function(req, res, restApiRoot) {
  Device.findOne({
    id: req.params.id
  }, function(err, device) {
    if (err) {
        console.log("Error finding a device with id " + req.params.id);
        res.render('error', {
          messages: "Error finding a device with id " + req.params.id,
          error: err
        });
    }

    // Retrieve and return all notes from the database.
    Category.find().then(categories => {
      return Connector.find().then(connectors => {
        res.render('update-device', {
          title: 'Cmc Devices',
          section: 'Update a device',
          urlForm: restApiRoot + '/devices/' + req.params.id,
          categories: categories,
          connectors: connectors,
          device: device,
          token: config.auth_token
        });
      }).catch(err => {
        console.log('No device connectors...');
          res.render('error', {
            messages: 'No device connectors...',
            error: err
          });

      });

    }).catch(err => {
      console.log('No device categories...');
      res.render('error', {
        messages: 'No device categories...',
        error: err
      });
    });

  });
};

/**
 * renderCreateCategory - render a view to create a new device category
 *
 * @param  {http.ClientRequest} req an http request
 * @param  {http.ServerResponse} res an http rsponse
 * @param  {String} restApiRoot  a rest api url
 * @return {http.ServerResponse} an http response
 */
exports.renderCreateCategory = function(req, res, restApiRoot) {
  // render a category form view
  res.render('create-category', {
    title: 'Cmc Category',
    section: 'Add a new category',
    urlForm: restApiRoot + '/categories',
    token: config.auth_token
  });
};

/**
 * createCategory - create a new device category
 *
  * @param  {http.ClientRequest} req an http request
  * @param  {http.ServerResponse} res an http rsponse
  * @param  {requestCallback} next  invoke the next route handler
  * @return {http.ServerResponse} an http response
 */
exports.createCategory = function(req, res, next) {
  //return res.status(200).send({data: {result: true, message: 'ok'}});
  var message = 'Category Added Successfully',
    id = null;

  Category.findOne({
    name: req.body.category_name
  }, function(err, category) {
    if (err) {
      var message  = "Error finding an existing category";
      return res.status(500).json(
        {
        "error": 500,
        "errorMessage": message,
        "moreInfo": config.urlSupport + "500"
        });
    }
    if (category) {
      var message  = "Category already exist with name: " + category.name;
      return res.status(500).json(
        {
        "error": 500,
        "errorMessage": message,
        "moreInfo": config.urlSupport + "500"
        });
    }

    var category = new Category({name: req.body.category_name, description: req.body.category_description, code: req.body.category_code});
    //console.log('Created document id: ' + req.body);

    category.save(function(err) {
      if (err) {
        var message  = "Problems while saving category: " + category.name;
        return res.status(500).json(
          {
          "error": 500,
          "errorMessage": message,
          "moreInfo": config.urlSupport + "500"
          });
      }

      res.set('Location', '/categories/' + category.id);
      res.status(201).send(category.toJSON());
    });

  });
};

/**
 * renderCreateConnector - render a view to create a new device category
 *
 * @param  {http.ClientRequest} req an http request
 * @param  {http.ServerResponse} res an http rsponse
 * @param  {String} restApiRoot  a rest api url
 * @return {http.ServerResponse} an http response
 */
exports.renderCreateConnector = function(req, res, restApiRoot) {
  // render a category form view
  res.render('create-connector', {
    title: 'Cmc Connector',
    section: 'Add a new connector',
    urlForm: restApiRoot + '/connectors',
    token: config.auth_token
  });
};

/**
 * createConnector - create a new device connector
   * @param  {http.ClientRequest} req an http request
   * @param  {http.ServerResponse} res an http rsponse
   * @param  {requestCallback} next  invoke the next route handler
   * @return {http.ServerResponse} an http response
  */
exports.createConnector = function(req, res, next) {
  var message = 'Connector Added Successfully',
    id = null;

  Connector.findOne({
    name: req.body.connector_name
  }, function(err, connector) {
    if (err) {
      var message  = "Problems finding an existing connector: " + req.body.connector_name;
      return res.status(500).json(
        {
        "error": 500,
        "errorMessage": message,
        "moreInfo": config.urlSupport + "500"
        });
    }
    if (connector) {
      var message  = "Connector already exist with name: " + connector.name;
      return res.status(500).json(
        {
        "error": 500,
        "errorMessage": message,
        "moreInfo": config.urlSupport + "500"
        });
    }

    var connector = new Connector({name: req.body.connector_name, description: req.body.connector_description, url: req.body.connector_url});

    connector.save(function(err) {
      if (err) {
        var message  = "Problems while saving connector with name: " + connector.name;
        return res.status(500).json(
          {
          "error": 500,
          "errorMessage": message,
          "moreInfo": config.urlSupport + "500"
          });
      }

      res.set('Location', '/connector/' + connector.id);
      res.status(201).send(connector.toJSON());
    });

  });
};

/**
 * getAllConnectors - retrieve all connectors
   * @param  {http.ClientRequest} req an http request
   * @param  {http.ServerResponse} res an http rsponse
   * @return {http.ServerResponse} an http response
  */
exports.getAllConnectors = function(req, res) {
  // Retrieve and return all notes from the database.
  Connector.find(function(err, connectors) {
    if (err) {
      var message  = "Error finding all connectors";
      return res.status(500).json(
        {
        "error": 500,
        "errorMessage": message,
        "moreInfo": config.urlSupport + "500"
        });
    } else {
      res.status(201).send(connectors);
    }
  });
};

/**
 * getConnectorByID - get a connectory by ID
 *
 * @param  {http.ClientRequest} req an http request
 * @param  {http.ServerResponse} res an http rsponse
 * @param  {requestCallback} next  invoke the next route handler
 * @return {http.ServerResponse} an http response
 */
exports.getConnectorByID = function(req, res, next) {
  var idConnector = (req.params.id).toString();

  Connector.findById(idConnector).populate({path: 'category', model: 'categories'}).exec(function(err, connector) {
    if (err) {
      var message  = "Error finding a connector with id: " + idConnector;
      return res.status(500).json(
        {
        "error": 500,
        "errorMessage": message,
        "moreInfo": config.urlSupport + "500"
        });

    }

    if (connector) {
      return res.status(201).json(connector.toJSON({virtuals: true}));
    }

    var message  =  "Could not find a connector with id " + req.params.id;
    return res.status(404).json(
      {
      "error": 404,
      "errorMessage": message,
      "moreInfo": config.urlSupport + "404"
      });
  });
};
