'use strict';

var Backbone = require('backbone'),
	hbs = require('../../helpers/hbs'),
	FormView = require('./formView');

var IndexView = Backbone.View.extend({
	//tagName:  'div',
	template: hbs.render('templates/createDao/index.hbs'),

	render: function () {
		this.$el.html(this.template());
        var formView = new FormView({genesisblock: this.model});
        this.$el.find('#form-create-dao').html(formView.el);
		return this;
	},
});

module.exports = IndexView;
