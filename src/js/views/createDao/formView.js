'use strict';

var Backbone = require('backbone'),
	$ = require('jquery'),
	hbs = require('../../helpers/hbs'),
	A3 = require('../../helpers/a3'),
	form = require('../../../../node_modules/backbone-forms/distribution/backbone-forms.js'),
	DaosCollection = require('../../collections/daos'),
	paths = require('../../helpers/paths'),
	contracts = require(paths.basepath +'/config/contracts'),
	UnlockView = require('../helper/unlockView');

var Form = Backbone.Form.extend({

	template: hbs.render('templates/createDao/form.hbs'),

	schema: {
        founder: { validators: ['required'], title: 'Founder address', type: 'Select', options: [], fieldClass: 'form-group', editorClass: 'form-control'},
        name: { validators: ['required'], title: 'DAO name', type: 'Text', fieldClass: 'form-group', editorClass: 'form-control'}/*,
        cost: { validators: ['required',
		{
			type: 'regexp',
			message: 'Must be a number',
			regexp: /^[0-9]*\.?[0-9]*?$/
		}], title: 'Creating DAO core cost', type: 'Text', fieldClass: 'form-group', editorClass: 'form-control'}*/
	},

	events: {
		'submit': 'submit',
		/*'submit': function(event) {
			this.trigger('submit', event);
		}*/
	},

	a3: null,
	views: null,
	genesisblock: null,

	initialize: function (options) {
        Form.__super__.initialize.apply(this, options);

		this.genesisblock = options.genesisblock;

		this.templateData = {network: this.genesisblock.get('name')};
		this.render();

	    this.a3 = new A3();
		this.views = {};
		this.views.unlock = new UnlockView();

		var accounts = this.a3.getAccounts();
		this.fields.founder.editor.setOptions(accounts);
		if (accounts.hasOwnProperty(0)) {
			this.setValue('founder', accounts[0]);
		}

		this.on('founder:change', function(form, titleEditor, extra) {
			this.setBalance(titleEditor.getValue());
		});
		if (accounts.hasOwnProperty(0)) {
			this.setBalance(accounts[0]);
		}
		/*this.setCost();*/
	},

	setBalance: function (founder) {
		var balance = this.a3.getBalance(founder);
		this.$el.find('#founder-balance').text(balance);
	},

	setCost: function () {
		var gas = this.a3.estimateGas({
			data: contracts.core_data
		});
		console.log(gas);
		var gas = this.a3.estimateGas({
			data: contracts.addressarray_data
		});
		this.setValue('cost', gas);
	},

	submit: function (event) {
		event.preventDefault();
		var err = this.validate();
		if (err === null) {
			this.startCreateDao();
		}
	},

	showMessageForm: function(type, message) {
		$('#form-message').html('<div class="alert alert-'+ type +'">'+ message +'</div>');
	},

	closeMessageForm: function() {
		$('#form-message').html('');
	},

	startCreateDao: function() {
		var data = this.getValue();
		console.log('data', data);

		var founder = data.founder;
		var name = data.name;
		var cost = 0;

		//this.createLib(founder, name, cost);
		this.closeMessageForm();
		this.views.unlock.trigger('show');
		this.listenTo(this.views.unlock, 'submit', function(){
			console.log('submit', this.views.unlock.password);

            this.a3.unlockAccount(founder, this.views.unlock.password, 20, function(){
				this.createLib(founder, name, cost);
			}.bind(this), function(){
				this.showMessageForm('danger', 'Error password.');
			}.bind(this));
		});
	},

	createLib: function(founder, name, cost) {
		this.showMessageForm('success', 'Transaction is sent. Please wait a few minutes. Window automatically update when process is finished.');
		var contract = this.a3.getContractNew(contracts.addressarray_interface);
		contract.new(
			{
				from: founder,
				data: contracts.addressarray_data,
				gas: 3000000
			}, function(e, contract){
				console.log(e, contract);
				if (typeof contract != 'undefined' && typeof contract.address != 'undefined') {
					console.log('Contract mined! address: ' + contract.address + ' transactionHash: ' + contract.transactionHash);
					this.createDao(contract.address, founder, name, cost);
				}
			}.bind(this)
		);

		/*setTimeout(function(){
			console.log('createLib', founder, name, cost);
			this.showMessageForm('success', 'Transaction is sent. Please wait a few minutes. Window automatically update when process is finished.');
			this.createDao('0x111111118888888888811111111', founder, name, cost);
		}.bind(this), 1000);*/
	},

	createDao: function(addr_lib, founder, name, cost) {
        this.a3.unlockAccount(founder, this.views.unlock.password, 20, function(){

			var data = contracts.core_data.replace(new RegExp('__AddressArray__________________________', 'g'), addr_lib.replace('0x', ''));
			var contract = this.a3.getContractNew(contracts.core_interface);
			contract.new(
				{
					from: founder,
					data: data,
					gas: 4000000
				}, function(e, contract){
					console.log(e, contract);
					if (typeof contract != 'undefined' && typeof contract.address != 'undefined') {
						console.log('Contract mined! address: ' + contract.address + ' transactionHash: ' + contract.transactionHash);

						this.showMessageForm('info', 'Your organization was founded. Window automatically update when process is finished.');

						var daosCollection = new DaosCollection();
						this.genesisblock.set({name: name, core_address: contract.address, core_interface: contracts.core_interface});
						var dao = this.genesisblock.toJSON();
						dao._id = daosCollection.length + 1;
						daosCollection.create(dao);

						setTimeout(function(){
							window.router.navigate("dao/"+ dao._id, { trigger: true });
						}, 2000);
					}
				}.bind(this)
			);

			/*setTimeout(function(){
				console.log('createDao', founder, name, cost);
				this.showMessageForm('info', 'Your organization was founded. Window automatically update when process is finished.');
			}.bind(this), 1000);*/

		}.bind(this), function(){
			this.showMessageForm('danger', 'Error password.');
		}.bind(this));
	}
});

module.exports = Form;
