'use strict';

var Backbone = require('backbone'),
	TransferModel = require('../models/transfer');

var Transfers = Backbone.Collection.extend({
	model: TransferModel,

    tx: function(model) {
        model = this._prepareModel(model, {});
        var collection = this;
        model.tx(function(data) {
          collection.add(data);
        });
		return model;
    },
});

module.exports = Transfers;
