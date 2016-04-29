'use strict';

var Backbone = require('backbone'),
    _ = require('underscore'),
	paths = require('../helpers/paths'),
	config = require(paths.basepath +'/config/default'),
    hbs = require('../helpers/hbs'),
    gethinfo = require('../helpers/gethinfo'),

    StartView = require('../views/start/startView'),
    DaosView = require('../views/daos/indexView'),
    BlockchainsView = require('../views/blockchains/indexView'),
    SyncView = require('../views/sync/syncView'),
    DaoView = require('../views/dao/indexView'),
    CreateDaoView = require('../views/createDao/indexView'),

	BlockchainSelect = require('../models/blockchainSelect'),
	DaosCollection = require('../collections/daos'),
	GenesisblocksCollection = require('../collections/genesisblocks');

var AppView = Backbone.View.extend({
	//tagName:  'li',
	template: hbs.render('templates/app.hbs'),

    geth: null,

	initialize: function () {
		this.listenTo(this, 'init', this.initApp);
		this.listenTo(this, 'start', this.start);
		this.listenTo(this, 'daos', this.daos);
		this.listenTo(this, 'create_select', this.createSelect);
		this.listenTo(this, 'import_select', this.importSelect);
        this.render();
        this.setGeth();
	},

	render: function () {
		this.$el.html(this.template());
		return this;
	},

	setGeth: function () {
        gethinfo.get(function(info){
            console.log('get info', info);
            this.geth = info;
            var text_info = 'stop';
            if (info !== null) {
                text_info = 'run';
            }
            this.$el.find('#geth-status').html(text_info);
        }.bind(this));
	},

	initApp: function () {
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

	createSelect: function () {
		this.$el.find('#content').html('');

        var genesisblocks = new GenesisblocksCollection();
        var blockchainSelect = new BlockchainSelect({title: 'Create DAO genesis block', desc: 'Hello! At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui ocia deserunt mollitia animi, id estlaborum et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio. Nam libero tempore, cum soluta nobis est eligendi optiocumque nihil impedit quo.', type: 'create'});
        var blockchainsView = new BlockchainsView({model: blockchainSelect, collection: genesisblocks});
        blockchainsView.setElement(this.$el.find('#content')).render();
	},

	importSelect: function () {
		this.$el.find('#content').html('');

        var genesisblocks = new GenesisblocksCollection();
        var blockchainSelect = new BlockchainSelect({title: 'Import existing DAO genesis block', desc: 'Hello! At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui ocia deserunt mollitia animi, id estlaborum et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio. Nam libero tempore, cum soluta nobis est eligendi optiocumque nihil impedit quo.', type: 'import'});
        var blockchainsView = new BlockchainsView({model: blockchainSelect, collection: genesisblocks});
        blockchainsView.setElement(this.$el.find('#content')).render();
	},

	createDao: function (id) {
		this.$el.find('#content').html('');

        var genesisblocksCollection = new GenesisblocksCollection();
        var genesisblock = genesisblocksCollection.get(id);
        var createDaoView = new CreateDaoView({model: genesisblock});
        createDaoView.setElement(this.$el.find('#content')).render();
	},

	sync: function (type, id) {
		this.$el.find('#content').html('');

        var genesisblock, syncFinish = null;
        if (type == 'import' || type == 'create') {
    		var genesisblocksCollection = new GenesisblocksCollection();
    		genesisblock = genesisblocksCollection.get(id);
            if (type == 'import') {
                syncFinish = function() {
                    console.log('sync-finish save');
                    this.setGeth();

                    var daosCollection = new DaosCollection();
                    var dao = daosCollection.findWhere({core_address: genesisblock.get('core_address'), core_interface: genesisblock.get('core_interface')});
                    if (dao) {
                        console.log(dao);
                    } else {
                        console.log('no');
                        dao = genesisblock.toJSON();
                        dao._id = daosCollection.length + 1;
                        daosCollection.create(dao);
                    }
                    window.router.navigate("dao/"+ dao._id, { trigger: true });
                }
            } else {
                syncFinish = function() {
                    console.log('sync-finish create');
                    this.setGeth();

                    window.router.navigate("create-dao/"+ id, { trigger: true });
                }
            }
        } else if (type == 'open') {
            var daosCollection = new DaosCollection();
            genesisblock = daosCollection.get(id);
            syncFinish = function() {
                console.log('sync-finish open');
                this.setGeth();

                window.router.navigate("dao/"+ id, { trigger: true });
            }
        } else {
            return;
        }

        var syncView = new SyncView({model: genesisblock});
        if (this.geth !== null) {
            // проверяем не запущен ли уже нужный blockchain
            if (_.isEqual(this.geth, genesisblock.get('params')) ) {
                syncFinish.bind(this)();
                return;
            }
            // закрываем текущее соединение
            syncView.closeGeth();
            this.setGeth();
        }
        this.listenTo(syncView, 'sync-finish', syncFinish.bind(this));
        syncView.setElement(this.$el.find('#content')).render();
        syncView.startGeth();
	},

	dao: function (genesisblock_id) {
		this.$el.find('#content').html('');

        var daoView = new DaoView({genesisblock_id: genesisblock_id});
        daoView.setElement(this.$el.find('#content')).render();
	}
});

module.exports = AppView;
