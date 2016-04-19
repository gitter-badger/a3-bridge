'use strict';

var Backbone = require('backbone'),
    _ = require('underscore'),
	hbs = require('../../helpers/hbs'),
	paths = require('../../helpers/paths'),
	config = require(paths.basepath +'/config/default'),
	GenesisblocksCollection = require('../../collections/genesisblocks'),
	Ipc = require('electron').ipcRenderer;

var SyncView = Backbone.View.extend({
	//tagName:  'div',
	template: hbs.render('templates/sync/sync.hbs'),

	events: {
		'click .skip_search_peers': 'skipSearchPeers',
		'click .close_geth': 'closeGeth',
	},

	initialize: function (options) {
		var _this = this;
		Ipc.removeAllListeners(['init_command']);
		Ipc.on('init_command', function(event, message) {
			if (message.command == 'start') {
				_this.step1(message);
			}
			if (message.command == 'search_peer') {
				_this.step2(message);
			}
			if (message.command == 'progress') {
				_this.step3(message);
			}
			if (message.command == 'run') {
				_this.openDao();
			}
		});

		var genesisblocksCollection = new GenesisblocksCollection();
		this.model = genesisblocksCollection.get(options.genesisblock_id);

		console.log(this.model.get('params'));
		Ipc.send('run_geth', {'command':'run', 'params': this.model.get('params')});
	},

	step1: function (message) {
		this.$el.find('#log-sync').append('<p>Geth запущен</p>');
	},

	step2: function (message) {
		if (this.$el.find('#search_peers').length == 0) {
			this.$el.find('#log-sync').append('<p id="search_peers">поиск пиров <a href="" class="skip_search_peers">Пропустить</a></p>');
		}
	},

	step3: function (message) {
		if (this.$el.find('#search_peers').length) {
			this.$el.find('#search_peers').remove();
		}
		var time = new Date();
		this.$el.find('#log-sync').append('<p>Progress '+ message.progress + '% time '+ time.getTime() +'</p>');
		$('#log-sync').scrollTop($('#log-sync')[0].scrollHeight);
	},

	openDao: function () {

		var model = _.omit(this.model.toJSON(), '_id');
		var daos = _.map(config.daos, function(o) { return _.omit(o, '_id'); });
		var is_dao = _.find(daos, {core_address: model.core_address, core_interface: model.core_interface});
		if (!is_dao) {
			daos.push(model);
			config.daos = daos;
            var fs = require('fs');
            var err = fs.writeFileSync(paths.basepath +'/config/default.json', JSON.stringify(daos));
			if(err) {
				return console.log(err);
			}
		}

		console.log('запускаем app');
		window.router.navigate("dao/"+ this.model.get('_id'), { trigger: true });
	},

	skipSearchPeers: function () {
		Ipc.send('skip_search_peers');
	},

	closeGeth: function () {
		Ipc.send('close_geth');
	},

	render: function () {
		this.$el.html(this.template());
		return this;
	},
});

module.exports = SyncView;