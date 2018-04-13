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

var config = require('./config/default.json');
var async=require('async');
var argv = require('minimist')(process.argv.slice(2));
var version = require('package.json').version;
var test = require('./test/testconfig');

console.dir(argv);

var conf;

switch (process.env['NODE_ENV']) {
    case 'dev':
        conf = config.dev;
        break;
    case 'test':
        conf = config.dev;
        test.customTestConfig(conf);
        break;
    default:
        conf = config.production;
        break;
}

async.eachOf(conf, function(param, index,callback) {

    // Perform operation on file here.
    console.log('Processing Key ' + index);
    if(argv[index])
        conf[index]=argv[index];
    callback();
});

 //p.version.split('.').shift();
  // module.exports.host= process.env.HOST || 'localhost';
  // module.exports.port= process.env.PORT || 3000;

module.exports.conf = conf;
module.exports.generalConf = config;
