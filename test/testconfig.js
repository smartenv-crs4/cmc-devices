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


function customTestConfig(config){
    var testConfig=config.testConfig;
    var adminUserToken=testConfig.admintokens.concat(testConfig.usertokens);
    var adminAuthAppToken=testConfig.admintokens.concat(testConfig.authApptokens);
    var adminUserAuthAppToken=testConfig.admintokens.concat(testConfig.authApptokens).concat(testConfig.usertokens);

    testConfig.myWebUITokenToSignUP=config.auth_token;
    testConfig.userTypeTest={
                        "name": "Micio",
                        "email": "mario@cmc.com",
                        "password": "miciomicio",
                        "surname":"Macio",
                        "type": testConfig.usertokens[0]
    };
    testConfig.webUiAppTest={
                    "email": "webui@webui.it",
                    "password": "miciomicio",
                    "type": testConfig.authApptokens[0]
    };
    testConfig.adminLogin={
                    "username": "admin@admin.com",
                    "password": "admin"
    };

    testConfig.AuthRoles=[
                {URI:"/api/v0.1/devices/", token:testConfig.authApptokens, method:"GET"},
                {URI:"/api/v0.1/devices/",token:testConfig.authApptokens, method:"POST"},
                {URI:"/api/v0.1/devices/:id",token:testConfig.authApptokens, method:"DELETE"},
                {URI:"/api/v0.1/devices/:id",token:testConfig.authApptokens, method:"GET"},
                {URI:"/api/v0.1/devices/read/:id",token:testConfig.authApptokens, method:"GET"},
                {URI:"/api/v0.1/connectors/",token:testConfig.authApptokens, method:"POST"},
                {URI:"/api/v0.1/connectors/:id",token:testConfig.authApptokens, method:"GET"},
                {URI:"/api/v0.1/connectors/:id",token:testConfig.authApptokens, method:"DELETE"},
                {URI:"/api/v0.1/categories/",token:testConfig.authApptokens, method:"POST"},
                {URI:"/api/v0.1/categories/:id",token:testConfig.authApptokens, method:"DELETE"},
                {URI:"/api/v0.1/categories/:id",token:testConfig.authApptokens, method:"GET"},
    ];
    testConfig.webUiID="";
}

module.exports.customTestConfig = customTestConfig;
