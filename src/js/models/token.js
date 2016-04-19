'use strict';

var Backbone = require('backbone');

var Token = Backbone.Model.extend({
    defaults: {
        name: '',
        balance: 0,
    },
});

module.exports = Token;
