'use strict';

var Backbone = require('backbone'),
    _ = require('underscore'),
	paths = require('../helpers/paths'),
	config = require(paths.basepath +'/config/default'),
    hbs = require('../helpers/hbs'),

    StartView = require('../views/start/startView'),
    DaosView = require('../views/daos/indexView'),
    ImportView = require('../views/import/importView'),
    SyncView = require('../views/sync/syncView'),
    DaoView = require('../views/dao/indexView')

	/*Web3b = require('../helpers/web3b')*/;

var AppView = Backbone.View.extend({
	//tagName:  'li',
	template: hbs.render('templates/app.hbs'),

	initialize: function () {
		this.listenTo(this, 'init', this.initApp);
		this.listenTo(this, 'start', this.start);
		this.listenTo(this, 'daos', this.daos);
		this.listenTo(this, 'import_select', this.importSelect);
		this.listenTo(this, 'contract_user', this.contractUser);
        this.render();
	},

	render: function () {
		this.$el.html(this.template());
		return this;
	},

	initApp: function () {
		//window.router.navigate("main", { trigger: true });
		if (_.isEmpty(config.daos)) {
			window.router.navigate("start", { trigger: true });
		} else {
			window.router.navigate("daos", { trigger: true });
		}
	},

	start: function () {
		this.$el.find('#content').html('');

        var startView = new StartView();
        startView.setElement(this.$el.find('#content')).render();
	},

	daos: function () {
		if (_.isEmpty(config.daos)) {
			window.router.navigate("start", { trigger: true });
			return;
		}

		this.$el.find('#content').html('');

        var daosView = new DaosView();
        daosView.setElement(this.$el.find('#content')).render();
	},

	importSelect: function () {
		this.$el.find('#content').html('');

        var importView = new ImportView();
        importView.setElement(this.$el.find('#content')).render();
	},

	sync: function (genesisblock_id) {
		this.$el.find('#content').html('');

        var syncView = new SyncView({genesisblock_id: genesisblock_id});
        syncView.setElement(this.$el.find('#content')).render();
	},

	dao: function (genesisblock_id) {
		this.$el.find('#content').html('');

        var daoView = new DaoView({genesisblock_id: genesisblock_id});
        daoView.setElement(this.$el.find('#content')).render();
	}
});

module.exports = AppView;
