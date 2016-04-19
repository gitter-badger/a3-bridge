const ipc = require('electron').ipcMain;

module.exports = {
	sync: function(nodeSocket, callback) {

		var status_ok = 1;
		var status_err = 2;
		var status_progress = 3;
		var intervalId = false;
		var skip_peers_listener = false;

		// делаем запрос eth_getBlockByNumber
		nodeSocket.send('eth_getBlockByNumber', ['latest', false], function(result) {
			var now = Math.floor(new Date().getTime() / 1000);
			//console.log('Последний блок был найден ', (now - +result.timestamp) + 'сек назад');
			console.log('Last block ', (now - +result.timestamp) + 's');
			if ((now - +result.timestamp) > (60 * 2)) {

				// если прошло больше 2 мин от последнего блока
				// каждые 2сек смотрим инфу о синхронизации
				intervalId = setInterval(function() {
					nodeSocket.send('eth_syncing', [], function(result) {
						//console.log('sync ', result);
						if (!result) {
							// синхронизация с сетью не идет

							// проверить время блока
							nodeSocket.send('eth_getBlockByNumber', ['latest', false], function(result) {
								var now = Math.floor(new Date().getTime() / 1000);
								//console.log('Последний блок был найден ', (now - +result.timestamp) + 'сек назад');
								//console.log('now ', now + 's');
								//console.log('last ', +result.timestamp + 's');
								//console.log('Last block ', (now - +result.timestamp) + 's');
								if ((now - +result.timestamp) > (60 * 2)) {
									// еще не синхронизировалось и синхронизация не идет, значит идет поиск пиров
									callback(status_err);

									if (skip_peers_listener == false) {
										skip_peers_listener = true;
										// дать возможность пропустить
										ipc.on('skip_search_peers', function() {
											clearInterval(intervalId);
											callback(status_ok);
										});
									}
								} else {
									clearInterval(intervalId); // останавливаем проверку синхронизации
									callback(status_ok);
								}
							});

						} else {
							// если есть инфа о синхронизации показываем ее
							console.log('progress!');
							var progress = ((result.currentBlock - result.startingBlock) / (result.highestBlock - result.startingBlock)) * 100;
							callback(status_progress, {
								'progress': progress,
								'result': result
							});
						}
					});
				}, 2000);

				ipc.on('close_geth', function() {
					clearInterval(intervalId);
				});

			} else {
				callback(status_ok);
			}
		});
	}
}
