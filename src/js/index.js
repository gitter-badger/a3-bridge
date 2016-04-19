'use strict';

var Backbone = require('backbone'),
    Router = require('./routers/router');

window.router = new Router();
Backbone.history.start();
