'use strict';

var Backbone = require('backbone'),
	paths = require('../helpers/paths'),
	config = require(paths.basepath +'/config/default'),
	A3 = require('../helpers/a3'),
	DaoModel = require('../models/dao');

var DaoNodes = Backbone.Collection.extend({
	model: DaoModel,
	a3: null,
    initialize: function() {
		this.a3 = new A3();
		//this.fetch();
    },

	fetch: function(options) {
		this.reset([
			{name:'[default] Aira core storage', desc: 'Hello! At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint'},
			{name:'q',desc:'as'}
		]);
    },
});

module.exports = DaoNodes;
