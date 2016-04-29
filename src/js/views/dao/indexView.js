'use strict';

var Backbone = require('backbone'),
	hbs = require('../../helpers/hbs'),
	DaosCollection = require('../../collections/daos'),
	DaoNodesCollection = require('../../collections/daoNodes'),
	NodesView = require('./nodesView');

var IndexView = Backbone.View.extend({
	//tagName:  'div',
	template: hbs.render('templates/dao/index.hbs'),

	views: null,

	initialize: function (options) {
		console.log('options.genesisblock_id', options.genesisblock_id);
		var daosCollection = new DaosCollection();
		this.model = daosCollection.get(options.genesisblock_id);

		var daoNodes = new DaoNodesCollection();
		daoNodes.fetch();
		this.views = {};
		this.views.nodes = new NodesView({collection: daoNodes});
	},

	render: function () {
		this.$el.html(this.template(this.model.toJSON()));
        this.views.nodes.setElement(this.$el.find('#nodes tbody')).render();
		return this;
	},
});

module.exports = IndexView;
