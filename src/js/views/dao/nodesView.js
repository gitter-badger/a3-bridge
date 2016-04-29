'use strict';

var Backbone = require('backbone'),
	NodeView = require('./nodeView');

var NodesView = Backbone.View.extend({
	//tagName:  'div',

	initialize: function () {
		this.listenTo(this.collection, 'add', this.addOne);
	},

	render: function () {
		this.collection.each(this.addOne, this);
		return this;
	},

	addOne: function (model) {
		var view = new NodeView({ model: model });
		this.$el.append(view.render().el);
	},
});

module.exports = NodesView;
