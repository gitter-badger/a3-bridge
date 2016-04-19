'use strict';

var Backbone = require('backbone'),
	hbs = require('../../helpers/hbs');

var DaoView = Backbone.View.extend({
	tagName:  'div',
	template: hbs.render('templates/daos/dao.hbs'),

	initialize: function () {

	},

	render: function () {
		this.$el.html(this.template(this.model.toJSON()));
		return this;
	},
});

module.exports = DaoView;
