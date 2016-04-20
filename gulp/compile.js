'use strict';
var exec = require('child_process').exec;

module.exports = (gulp, plugins, config) => () => {
    return exec("electron-packager . a3 --platform=win32 --arch=x64 --version=0.37.5 --app-version=0.1.0 --out=release --ignore=\"node_modules/(electron-packager|electron-prebuilt)\" --ignore=\"blockchains/\" --ignore=\"config/\" --ignore=\"gb/\" --ignore=\"nodes/\" --ignore=\"release/\" --ignore=\"gulp/\" --asar=true --prune", function(err) {
        console.log(err);
      /*if (err) return cb(err);
      cb();*/
    });;
};
