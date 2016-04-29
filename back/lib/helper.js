const ipc = require('electron').ipcMain;

// подключаем библиотеку с помощью которой запускаем geth
const Node = require('./node.js');
// подключаем библиотеку с помощью проверяем синхронизацию
const NodeSync = require('./node_sync.js');
// подключаем библиотеку с помощью которой будем общаться по rpc
const NodeSocket = require('./node_socket.js');

const path = require('path');
const paths = require('./paths');
const _ = require('underscore');

module.exports = {
	run: function() {
		var gethInfo = null;

        ipc.on('run_geth', function(event, message) {
            //console.log(event);
            /*console.log(message.command);

            var arg_def = ["--rpc","--rpcport","8222","--rpccorsdomain","*"];
            console.log('go',message.params);
            var arg = message.params.concat(arg_def);
            console.log('mer',arg);*/

            //event.sender.send('init_command', {'command':'run'});

            var args = message.params;
			gethInfo = _.clone(args);

            var genesis_i = args.indexOf('--genesis');
            if (genesis_i>=0) {
                genesis_i++;
                console.log(genesis_i, args[genesis_i]);
                if (!path.isAbsolute(args[genesis_i])) {
					args[genesis_i] = paths.toBase('/genesisblocks/'+ args[genesis_i]);
					//args[genesis_i] = path.join(paths.basepath, 'genesisblocks', args[genesis_i]);
                    console.log('genesis', args[genesis_i]);
                }
                //args[genesis_i] = args[genesis_i].replace(/(\\)/, "\\\\");
            }

            var datadir_i = args.indexOf('--datadir');
            if (datadir_i>=0) {
                datadir_i++;
                console.log(datadir_i, args[datadir_i]);
                if (!path.isAbsolute(args[datadir_i])) {
					args[datadir_i] = paths.toBase('/genesisblocks/'+ args[datadir_i]);
                    //args[datadir_i] = path.join(paths.basepath, 'genesisblocks', args[datadir_i]);
                    console.log('datadir', args[datadir_i]);
                }
                //args[datadir_i] = args[datadir_i].replace(/(\\)/, "\\\\");
            }


            var nodeConnect;
            var proc = Node.start(args, function(e, start) {
                if (e) {
                    console.log('err', e);
                }
                if (start == true) {
                    event.sender.send('init_command', {'command':'start'});

                    nodeConnect = new NodeSocket(function(connect){
                        NodeSync.sync(connect, function(status, data) {
                            if (status == 1) {
                                event.sender.send('init_command', {'command':'run'});
                                //event.sender.send('view', 'app');
                            } else if (status == 2) {
                                event.sender.send('init_command', {'command':'search_peer'});
                            } else if (status == 3) {
                                event.sender.send('init_command', {'command':'progress', 'progress':data.progress});
                            }
                        });
                    }, function(connect) {
                        console.log('err :(');
                    });
                    nodeConnect.connect(); // конектимся к geth
                }
            });

            ipc.on('close_geth', function(event, message) {
                proc.kill('SIGINT');
                nodeConnect.destroy();
            });
        });

	    ipc.on('get_geth', function(event, message) {
			console.log('get info');
			event.sender.send('get_geth_response', gethInfo);
		});
    }
}
