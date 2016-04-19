'use strict';

var Backbone = require('backbone'),
    _ = require('underscore'),
	paths = require('../helpers/paths'),
	config = require(paths.basepath +'/config/default'),
	DaoModel = require('../models/dao');

var Daos = Backbone.Collection.extend({
	model: DaoModel,
    initialize: function() {
		_.each(config.daos, function(dao, index){
            var dao_add = dao;
			dao_add._id = index + 1;
			this.add(dao_add);
		}, this);
    },
});

module.exports = Daos;
