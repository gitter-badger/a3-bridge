'use strict';

var Backbone = require('backbone'),
	hbs = require('../../helpers/hbs'),
	/*DaosCollection = require('../../collections/daos'),
	paths = require('../../helpers/paths'),
	contracts = require(paths.basepath +'/config/contracts'),
	UnlockView = require('../helper/unlockView'),*/


	FormView = require('./formView');


var IndexView = Backbone.View.extend({
	//tagName:  'div',
	template: hbs.render('templates/createDao/index.hbs'),

	/*events: {
		'click #form-submit' : 'startCreateDao'
	},*/

	/*a3: null,
	views: null,

	initialize: function (options) {
		this.a3 = options.a3;
		this.views = {};
		this.views.unlock = new UnlockView();
	},*/

	render: function () {
		this.$el.html(this.template());

        var formView = new FormView({genesisblock: this.model});
        this.$el.find('#form-create-dao').html(formView.el);

		//formView.setValue('name', 'asdas');
		/*var accounts = this.a3.getAccounts();
		formView.fields.founder.editor.setOptions(accounts);
		formView.setValue('founder', accounts[0]);*/

		/*formView.on('submit', function(event) {
			console.log('asd');
		  var errs = formView.validate();

		  if (errs) event.preventDefault();
	  });*/


		return this;
	},

	showMessageForm: function(type, message) {
		this.$el.find('#form-message').html('<div class="alert alert-'+ type +'">'+ message +'</div>');
	},

	startCreateDao: function(e) {
		e.preventDefault();

		var founder = this.$('select[name=founder]').val();
		var name = this.$('input[name=name]').val();
		var cost = this.$('input[name=cost]').val();

		//this.createLib(founder, name, cost);
		this.views.unlock.trigger('show');
		this.listenTo(this.views.unlock, 'submit', function(){
			console.log('submit', this.views.unlock.password);

            this.a3.unlockAccount(founder, this.views.unlock.password, function(){
				this.createLib(founder, name, cost);
			}.bind(this));
		});

		//this.undelegateEvents();
	},

	createLib: function(founder, name, cost) {
		/*this.showMessageForm('success', 'Transaction is sent. Please wait a few minutes. Window automatically update when process is finished.');
		var contract = this.a3.getContractNew(contracts.addressarray_interface);
		contract.new(
			{
				from: founder,
				data: contracts.addressarray_data,
				gas: 3000000
			}, function(e, contract){
				if (typeof contract.address != 'undefined') {
					console.log('Contract mined! address: ' + contract.address + ' transactionHash: ' + contract.transactionHash);
					this.createDao(contract.address, founder, name, cost);
				}
			}.bind(this)
		);*/

		setTimeout(function(){
			console.log('createLib', founder, name, cost);
			this.showMessageForm('success', 'Transaction is sent. Please wait a few minutes. Window automatically update when process is finished.');
			this.createDao('0x111111118888888888811111111', founder, name, cost);
		}.bind(this), 1000);
	},

	createDao: function(addr_lib, founder, name, cost) {
		/*var data = contracts.core_data.replace(new RegExp('__AddressArray__________________________', 'g'), addr_lib.replace('0x', ''));
		var contract = this.a3.getContractNew(contracts.core_interface);
		contract.new(
			{
				from: founder,
				data: data,
				gas: 4000000
			}, function(e, contract){
				if (typeof contract.address != 'undefined') {
					console.log('Contract mined! address: ' + contract.address + ' transactionHash: ' + contract.transactionHash);

					this.showMessageForm('info', 'Your organization was founded. Window automatically update when process is finished.');

					var daosCollection = new DaosCollection();
					this.model.set({name: name, core_address: contract.address});
					var dao = this.model.toJSON();
					dao._id = daosCollection.length + 1;
					daosCollection.create(dao);

					setTimeout(function(){
						window.router.navigate("dao/"+ dao._id, { trigger: true });
					}, 2000);
				}
			}.bind(this)
		);*/

		setTimeout(function(){
			console.log('createDao', founder, name, cost);
			this.showMessageForm('info', 'Your organization was founded. Window automatically update when process is finished.');
		}.bind(this), 1000);
	}
});

module.exports = IndexView;
