const cp = require('child_process');
const path = require('path');
const fs = require('fs');
const ipc = require('electron').ipcMain;

const paths = require('./paths');

const conf = require(paths.toBase('/config/back.json'));

const binPath = path.resolve(paths.toBase('/nodes/geth.exe'));
//console.log('binPath', binPath);

function isFunction(functionToCheck) {
	var getType = {};
	return functionToCheck && getType.toString.call(functionToCheck) === '[object Function]';
}

module.exports = {
    start: function(args, callback) {
		var args_default = conf.node_args;
		args = args.concat(args_default);
		var node = cp.spawn(binPath, args);
		node.on('close', function (code, signal) {
			if (isFunction(callback)) {
				callback(code);
            }
			console.log('Node Code '+ code);
		});
		node.on('error', function (err) {
			if (isFunction(callback)) {
				callback(err);
            }
			console.log('Node Failed to start child process.');
		});
		node.stdout.on('data', function (data) {
			ipc.on('run_geth', function(event, message) {
				event.sender.send('init_command', {'command':'progress', 'progress': 'LOG '+ data});
			});

			console.log('Node stdout: ' + data);

			if (data.toString().indexOf('[y/N]') >= 0) {
				console.log('node');
				node.stdin.write("Y\n");
			}
		});
		node.stderr.on('data', function (data) {
			//console.log('Node stderr: ' + data);
			if(data.toString().indexOf('IPC service started') === -1)
				return;
			if (isFunction(callback)) {
				callback(null, true);
            }
		});

		//node.stdin.setEncoding('utf-8');
		//node.stdout.pipe(process.stdout);
		//node.stdin.write("console.log('Hello from PhantomJS')\n");

		return node;
	}
}
/*
class Node {
  constructor(height, width) {
    this.height = height;
    this.width = width;
  }
  start() {
	console.log('asd');
    return true;
  }
}

export default Node;*/
