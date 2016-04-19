'use strict';

var Backbone = require('backbone');

var Genesisblock = Backbone.Model.extend({
    idAttribute: "_id",
    defaults: {
        name: ''
    }
});

module.exports = Genesisblock;
