'use strict';

var Backbone = require('backbone');

var Dao = Backbone.Model.extend({
    idAttribute: "_id",
    defaults: {
        name: ''
    }
});

module.exports = Dao;
