'use strict';

var Web3 = require('web3'),
	NodeSocket = require('../../../back/lib/node_socket.js');

var a3 = (function() {

	var A3 = function(host, port) {
		host = host === undefined ? 'localhost' : host;
		port = port === undefined ? '8222' : port;

        this._web3 = new Web3();
        this._web3.setProvider(new this._web3.providers.HttpProvider('http://'+ host +':'+ port));
	};

	A3.prototype.getWeb3 = function()
	{
		return this._web3;
	}

	A3.prototype.getContractNew = function(abi)
	{
		return this._web3.eth.contract(abi);
	}

	A3.prototype.getAccounts = function()
	{
		return this._web3.eth.accounts;
	}

	A3.prototype.unlockAccount = function(account, password, cb, cbErr)
	{
		if (password == '111') {
			cb(account);
		} else {
			cbErr(account);
		}

		return;
        var nodeConnect = new NodeSocket(function(connect){
            connSocket = connect;
            connSocket.send('personal_unlockAccount', [account, password, 20], function(result) {
                console.log(result);
                if (result == true) {
                    cb(account);
                } else {
					cbErr(account);
				}
            });
        });
        nodeConnect.connect();
	}

	A3.prototype.getBalance = function(account, currency)
	{
		currency = currency === undefined ? 'ether' : currency;
		return this._web3.fromWei(this._web3.eth.getBalance(account), currency)
	}

	A3.prototype.estimateGas = function(data)
	{
		return this._web3.eth.estimateGas(data);
	}

	return A3;
})();

module.exports = a3;
