'use strict';

var Backbone = require('backbone'),
	hbs = require('../../helpers/hbs');

var NodeView = Backbone.View.extend({
	tagName:  'tr',
	template: hbs.render('templates/dao/node.hbs'),

	initialize: function () {

	},

	render: function () {
		this.$el.html(this.template(this.model.toJSON()));
		return this;
	},
});

module.exports = NodeView;
