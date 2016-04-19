'use strict';

var Backbone = require('backbone'),
	TokenModel = require('../models/token');

var Tokens = Backbone.Collection.extend({
	model: TokenModel
});

module.exports = Tokens;
