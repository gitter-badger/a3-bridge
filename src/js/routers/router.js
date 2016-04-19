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
      'import-select': 'importSelect',
      'sync/*id': 'sync',
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
    importSelect: function() {
		appView.trigger('import_select');
    },
    sync: function(id) {
		appView.sync(id); //trigger('sync');
    },
    dao: function(id) {
		appView.dao(id); //trigger('sync');
    }
});

module.exports = Router;
