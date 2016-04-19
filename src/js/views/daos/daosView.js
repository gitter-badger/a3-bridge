'use strict';

var Backbone = require('backbone'),
	hbs = require('../../helpers/hbs'),
	DaoView = require('./daoView');

var DaosView = Backbone.View.extend({
	//tagName:  'div',
	template: hbs.render('templates/daos/daos.hbs'),

	initialize: function () {
		this.listenTo(this.collection, 'add', this.addOne);
	},

	render: function () {
		this.$el.html(this.template());
		this.collection.each(this.addOne, this);
		return this;
	},

	addOne: function (dao) {
		var view = new DaoView({ model: dao });
		this.$el.find('#daosList').prepend(view.render().el);
	},
});

module.exports = DaosView;
