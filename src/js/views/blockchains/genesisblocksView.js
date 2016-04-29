'use strict';

var Backbone = require('backbone'),
	GenesisblockView = require('./genesisblockView');

var GenesisblocksView = Backbone.View.extend({
	//tagName:  'div',

	initialize: function () {
		this.listenTo(this.collection, 'add', this.addOne);
	},

	render: function () {
		this.collection.each(this.addOne, this);
		return this;
	},

	addOne: function (genesisblock) {
		var view = new GenesisblockView({ model: genesisblock });
		this.$el.append(view.render().el);
	},
});

module.exports = GenesisblocksView;
