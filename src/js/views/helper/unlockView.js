'use strict';

var Backbone = require('backbone'),
	$ = require('jquery'),
	hbs = require('../../helpers/hbs'),
	BackboneModal = require('../../../../node_modules/backbone.modal/backbone.modal-min.js');

var Unlock = Backbone.Modal.extend({
	template: hbs.render('templates/helper/unlock.hbs'),
	submitEl: '#form-unlock-submit',
	cancelEl: '.modal-close',
	keyControl: false,
	password: '',
	initialize: function(){
		//this.listenTo(this, 'show', this.show);
    	this.on("show", this.show, this);
	},
	show: function(){
		$('body').append(this.render().el);
	},
	submit: function(){
		this.password = this.$('input[name=password]').val();
		this.trigger('submit');
	}
});

module.exports = Unlock;
