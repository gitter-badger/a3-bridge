'use strict';

var Backbone = require('backbone'),
	hbs = require('../../helpers/hbs'),
	DaosCollection = require('../../collections/daos');

var IndexView = Backbone.View.extend({
	//tagName:  'div',
	template: hbs.render('templates/dao/index.hbs'),

	initialize: function (options) {
		console.log('options.genesisblock_id', options.genesisblock_id);
		var daosCollection = new DaosCollection();
		this.model = daosCollection.get(options.genesisblock_id);
	},

	render: function () {
		console.log(this.model);
		this.$el.html(this.template(this.model.toJSON()));
		return this;
	},
});

module.exports = IndexView;
