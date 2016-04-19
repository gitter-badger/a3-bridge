'use strict';

var Backbone = require('backbone');

var Item = Backbone.Model.extend({
    defaults: {
        name: 'Иван Петров',
        type: 1
    }
});

module.exports = Item;
