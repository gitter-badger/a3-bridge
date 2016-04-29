'use strict';

var Backbone = require('backbone'),
	paths = require('../helpers/paths'),
	config = require(paths.basepath +'/config/default');

var Dao = Backbone.Model.extend({
    idAttribute: "_id",
    defaults: {
        name: ''
    }
});

module.exports = Dao;
