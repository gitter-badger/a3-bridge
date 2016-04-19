'use strict';

var Backbone = require('backbone'),
    _ = require('underscore'),
	paths = require('../helpers/paths'),
	GenesisblockModel = require('../models/genesisblock');

var Genesisblocks = Backbone.Collection.extend({
	model: GenesisblockModel,
    initialize: function() {
		var fs = require('fs');
		var path = paths.toBase('/import');
		console.log('path', path);
		var items = fs.readdirSync(path);
		var id = 1;
		for (var i=0; i<items.length; i++) {
			var file = path + '/' + items[i];
            console.log('file',file);
			if (fs.statSync(file).isFile()) {
				var gb = fs.readFileSync(file, "utf8");
				gb = JSON.parse(gb);
                gb._id = id;
				console.log(gb);
				this.add(gb);
				//this.add({_id: id, name: gb.name, desc: gb.desc, params: gb.params});
				id++;
			}
		}
    },
});

module.exports = Genesisblocks;
