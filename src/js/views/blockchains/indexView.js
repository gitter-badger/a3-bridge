'use strict';

var Backbone = require('backbone'),
	hbs = require('../../helpers/hbs'),
	GenesisblocksView = require('./genesisblocksView');

var IndexView = Backbone.View.extend({
	//tagName:  'div',
	template: hbs.render('templates/blockchains/index.hbs'),

	events: {
		'click #selectBtn' : 'blockchainStart'
	},

	views: null,

	initialize: function () {
		this.views = {};
		this.views.genesisblocks = new GenesisblocksView({collection: this.collection});
	},

	render: function () {
		this.$el.html(this.template(this.model.toJSON()));
        this.views.genesisblocks.setElement(this.$el.find('#genesisblocks tbody')).render();
		return this;
	},

	blockchainStart: function(e) {
		e.preventDefault();
		var genesisblock_id = parseInt(this.$('input[name=genesisblock]:checked').val());
		if (genesisblock_id) {
			this.undelegateEvents();
			window.router.navigate("sync/"+ this.model.get('type') +"/"+ genesisblock_id, { trigger: true });
		}
	}
});

module.exports = IndexView;
