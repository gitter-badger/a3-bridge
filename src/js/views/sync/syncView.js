'use strict';

var Backbone = require('backbone'),
    _ = require('underscore'),
	hbs = require('../../helpers/hbs'),
	paths = require('../../helpers/paths'),
	config = require(paths.basepath +'/config/default'),
	Ipc = require('electron').ipcRenderer;

var SyncView = Backbone.View.extend({
	//tagName:  'div',
	template: hbs.render('templates/sync/sync.hbs'),

	events: {
		'click .skip_search_peers': 'skipSearchPeers',
		'click .close_geth': 'closeGeth',
	},

	startGeth: function () {
        //var _this = this;
		Ipc.removeAllListeners(['init_command']); // перед запуском убиваем старую прослушку
		Ipc.on('init_command', function(event, message) {
			if (message.command == 'start') {
				this.step1(message);
			} else if (message.command == 'search_peer') {
				this.step2(message);
			} else if (message.command == 'progress') {
				this.step3(message);
			} else if (message.command == 'run') {
                this.trigger('sync-finish');
			}
		}.bind(this));
		console.log(this.model.get('params'));
		Ipc.send('run_geth', {'command':'run', 'params': this.model.get('params')});

		/*console.log(this.model.get('params'));
        var _this = this;
        setTimeout(function() {
            _this.trigger('sync-finish');
        }, 3000);*/
	},

	step1: function (message) {
		this.$el.find('#log-sync').append('<p>Geth запущен</p>');
	},

	step2: function (message) {
		if (this.$el.find('#search_peers').length == 0) {
			this.$el.find('#log-sync').append('<p id="search_peers">поиск пиров <a href="#" class="skip_search_peers">Пропустить</a></p>');
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
