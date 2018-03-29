# CMC Devices Microservice
CMC Devices is the device management microservice of the CMC IOT framework.
It takes care of managing all devices, providing restful resources for CRUD (Create Read Update and Delete) and use CMC-Auth for microservice authentication <br>
A device has identification data, a category and a connector.  A connector is an endpoint through which to reach and obtain the data of the device (in json format) and can be provided by the device itself or through a middleware (e.g. node-red, <code>https://github.com/node-red/node-red</code>)



## Usage

### Install


#### 1) Install all dependencies

    npm install


### Run the application

#### For *development* mode, run:

    NODE_ENV=dev npm start

#### For *production* mode, run:

    npm start

The backoffice where you can add a new device can be found at
<code>http://service_base_url/createdevice</code><br><br>
To add a new category device go to the  <code>http://service_base_url/createcategory</code> page<br><br>
To add a new connector device go to the <code>http://service_base_url/createconnector</code> page<br><br>
