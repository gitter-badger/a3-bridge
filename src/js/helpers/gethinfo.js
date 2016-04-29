'use strict';

var Ipc = require('electron').ipcRenderer;

var gethInfo = {
	get: function(cb) {
		/*setTimeout(function() {
			cb([
				"--genesis", "../gb/aira.json",
				"--datadir","../blockchains/aira",
				"--networkid", "22",
				"--port", "32222"
		    ]);
        }, 1000);
		return;*/
		console.log('send');
		Ipc.removeAllListeners(['get_geth_response']); // перед запуском убиваем старую прослушку
		Ipc.on('get_geth_response', function(event, message) {
			console.log('response');
			cb(message);
		});
		Ipc.send('get_geth');
	}
}

module.exports = gethInfo;
