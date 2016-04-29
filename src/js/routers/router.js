'use strict';

var Backbone = require('backbone'),
	$ = require('jquery'),
	AppView = require('../views/appView');

var appView = new AppView();
$('#app').html(appView.el);

var Router = Backbone.Router.extend({
    routes: {
      '': 'init',
      'main': 'main',
      'start': 'start',
      'daos': 'daos',
      'create-select': 'createSelect',
      'import-select': 'importSelect',
      'sync/*type/*id': 'sync',
      'create-dao/*id': 'createDao',
      'dao/*id': 'dao',
    },
    init: function() {
		appView.trigger('init');
    },
    main: function() {
		appView.trigger('main');
    },
    start: function() {
		appView.trigger('start');
    },
    daos: function() {
		appView.trigger('daos');
    },
    createSelect: function() {
		appView.trigger('create_select');
    },
    importSelect: function() {
		appView.trigger('import_select');
    },
    sync: function(type, id) {
		appView.sync(type, id);
    },
    createDao: function(id) {
		appView.createDao(id);
    },
    dao: function(id) {
		appView.dao(id);
    }
});

module.exports = Router;
