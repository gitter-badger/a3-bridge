'use strict';

var Backbone = require('backbone'),
	hbs = require('../../helpers/hbs'),
	GenesisblocksCollection = require('../../collections/genesisblocks'),
	GenesisblocksView = require('./genesisblocksView');

var ImportView = Backbone.View.extend({
	//tagName:  'div',
	template: hbs.render('templates/import/import.hbs'),

	events: {
		'click #importBtn' : 'importStart'
	},

	views: null,

	initialize: function () {
		this.views = {};
		var genesisblocksCollection = new GenesisblocksCollection();
		this.views.genesisblocks = new GenesisblocksView({collection: genesisblocksCollection});
	},

	render: function () {
		this.$el.html(this.template());
        this.views.genesisblocks.setElement(this.$el.find('#genesisblocks tbody')).render();
		return this;
	},

	importStart: function(e) {
		e.preventDefault();
		var genesisblock_id = parseInt(this.$('input[name=genesisblock]:checked').val());
		if (genesisblock_id) {
			this.undelegateEvents();
			window.router.navigate("sync/"+ genesisblock_id, { trigger: true });
		}
	}
});

module.exports = ImportView;
