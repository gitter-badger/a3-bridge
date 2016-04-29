'use strict';

var Backbone = require('backbone'),
	paths = require('../helpers/paths'),
	config = require(paths.basepath +'/config/default'),
	A3 = require('../helpers/a3'),
	DaoModel = require('../models/dao');

var DaoNodes = Backbone.Collection.extend({
	model: DaoModel,
	a3: null,
	dao: null,
	contract: null,
    initialize: function(options) {
		this.dao = options.dao;
		this.a3 = new A3();
		this.contract = this.a3.getContract(this.dao.get('core_interface'), this.dao.get('core_address'));
    },

	fetch: function(options) {
		/*var nodes = [
			{addr: '0x1111111', name:'[default] Aira core storage', desc: 'Hello! At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint'}
		];*/
		var nodes = [];
		var len = this.contract.getNodeLength.call();
		for (var i = 0; i < len; i++) {
			var node = {};
			node.addr = this.contract.getNodeByIndex.call(i);
			node.name = this.contract.getNodeName.call(node.addr);
			nodes.push(node);
		}
		this.reset(nodes);
    },
});

module.exports = DaoNodes;
