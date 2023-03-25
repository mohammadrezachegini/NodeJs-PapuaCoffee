const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const morgan = require('morgan');
const createError = require('http-errors');
const swaggerUI = require('swagger-ui-express');
const swaggerJSDoc = require('swagger-jsdo');
const cors = require('cors');
const {AllRoutes} = require('../app/routers/router')


module,exports = class Application {

    #app = express();
    #DB_URI;
    #PORT;

    constructor(PORT, DB_URI) {
        this.#PORT = PORT;
        this.#DB_URI = DB_URI;
        this.configApplication();
        this.connectToMongoose();
        this.createServer();
        this.createRoutes();
        this.errorHandling();
        this.InitRedis();
    }

    configApplication(){}

    createServer(){}

    connectToMongoose(){}

    InitRedis(){}


    createRoutes(){}

    errorHandling(){}



}