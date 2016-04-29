'use strict';

var Backbone = require('backbone'),
	paths = require('../helpers/paths'),
	config = require(paths.basepath +'/config/default');

var Dao = Backbone.Model.extend({
    idAttribute: "_id",
    defaults: {
        name: ''
    },

    save: function(k, options) {
        options.success(this.attributes, {}, {});
        console.log('transaction save', this.attributes);
        console.log(k, options);

        /*var new_id = 1
        var last_item = _.last(config.daos);
        if (last_item) {
            new_id = last_item._id + 1;
        }
        console.log('last_id', new_id);
        this.attributes._id = new_id;*/

        config.daos.push(this.attributes);
        var fs = require('fs');
        var err = fs.writeFileSync(paths.basepath +'/config/default.json', JSON.stringify(config));
        if(err) {
            return console.log(err);
        }
    },
});

module.exports = Dao;
