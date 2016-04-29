'use strict';

var Backbone = require('backbone'),
	paths = require('../helpers/paths'),
	config = require(paths.basepath +'/config/default'),
	DaoModel = require('../models/dao');

var Daos = Backbone.Collection.extend({
	model: DaoModel,
    initialize: function() {
        this.add(config.daos);
    }
});

module.exports = Daos;
