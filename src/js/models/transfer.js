'use strict';

var Backbone = require('backbone');

var Transfer = Backbone.Model.extend({
    defaults: {
        from: '',
        to: '',
        amount: 0,
    },

    tx: function(callback) {
        callback(this.attributes);
        console.log('transaction', this.attributes);
    },

    save: function(k, options) {
        options.success(this.attributes, {}, {});
        console.log('transaction save', this.attributes);
    },
});

module.exports = Transfer;
