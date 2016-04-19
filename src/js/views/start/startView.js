'use strict';

var Backbone = require('backbone'),
	hbs = require('../../helpers/hbs');

var StartView = Backbone.View.extend({
	//tagName:  'div',
	template: hbs.render('templates/start/start.hbs'),

	initialize: function () {
	},

	render: function () {
		this.$el.html(this.template());
		return this;
	},
});

module.exports = StartView;
