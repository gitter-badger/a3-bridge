'use strict';

var Backbone = require('backbone'),
	hbs = require('../../helpers/hbs');

var GenesisblockView = Backbone.View.extend({
	tagName:  'tr',
	template: hbs.render('templates/import/genesisblock.hbs'),

	initialize: function () {

	},

	render: function () {
		this.$el.html(this.template(this.model.toJSON()));
		return this;
	},
});

module.exports = GenesisblockView;
