'use strict';

var Backbone = require('backbone'),
	hbs = require('../../helpers/hbs'),
	DaosCollection = require('../../collections/daos'),
	DaosView = require('./daosView');

var IndexView = Backbone.View.extend({
	//tagName:  'div',
	template: hbs.render('templates/daos/index.hbs'),

	views: null,

	initialize: function () {
		this.views = {};
		var daosCollection = new DaosCollection();
		this.views.daos = new DaosView({collection: daosCollection});
	},

	render: function () {
		this.$el.html(this.template());
        this.views.daos.setElement(this.$el.find('#daos')).render();
		return this;
	},
});

module.exports = IndexView;
