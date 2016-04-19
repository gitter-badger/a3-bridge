'use strict';

var Backbone = require('backbone');
var handlebars = require('handlebars');
var fs = require('fs');

var Re = {
	render: function (path) {
        var file = fs.readFileSync(__dirname +'/../../'+ path, 'utf8');
        return handlebars.compile(file);
	},
};

module.exports = Re;
