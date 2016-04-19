'use strict';

var Web3 = require('web3');

var Web3b = function() {
    var web3 = new Web3();
    var url = 'http://localhost:8222';
    web3.setProvider(new web3.providers.HttpProvider(url));
    var list = web3.eth.accounts;
    console.log(list);
}

module.exports = Web3b;
