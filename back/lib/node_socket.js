const net = require('net');
const StringDecoder = require('string_decoder').StringDecoder;

function isFunction(functionToCheck) {
	var getType = {};
	return functionToCheck && getType.toString.call(functionToCheck) === '[object Function]';
}

var NodeSocket = function(connectCallback, errorCallback) {
    var _this = this;
    this.socket = new net.Socket();
    this.callbacks = {};
	this.decoder = new StringDecoder('utf8');
	this.id = 1;
	this.status = false;
	this.connectCallback = connectCallback;
	this.errorCallback = errorCallback;

    this.socket.on('close', function(e){
		_this.status = false;
        console.log('close: ', e);
    });

    this.socket.on('connect', function(){
        if (isFunction(_this.connectCallback)) {
		    _this.connectCallback(_this);
        }
		_this.status = true;
        console.log('connect');
    });

    this.socket.on('error', function(error){
		/*if (error.code == 'EADDRNOTAVAIL') {
	        console.log("[ERROR] EADDRNOTAVAIL");
	        return;
	    }
		if (error.code == "ENOTFOUND") {
	        console.log("[ERROR] No device found at this address!");
	        _this.socket.destroy();
	        return;
	    }
	    if (error.code == "ECONNREFUSED") {
	        console.log("[ERROR] Connection refused! Please check the IP.");
	        _this.socket.destroy();
	        return;
	    }*/
		console.log('ERROR: ', error);
        if (isFunction(_this.errorCallback)) {
		    _this.errorCallback(_this);
        }
    });

    this.socket.on('data', function(data){
		console.log('data');
		data = new Buffer(data);
		data = _this.decoder.write(data);
		data = JSON.parse(data);
		var callback = _this.callbacks[data.id];
		callback(data.result);
    });
};

NodeSocket.prototype.connect = function() {
     if(!this.socket.writable)
        this.socket.connect({path: '\\\\.\\pipe\\geth.ipc'});
};

NodeSocket.prototype.send = function(method, params, callback) {
    if(this.socket.writable) {
		console.log('id = '+ this.id);
        this.socket.write(JSON.stringify({
            jsonrpc: '2.0',
            id: this.id,
			method: method,
			params: params
        }));
        this.callbacks[this.id] = callback;
		this.id++;
	    console.log('Socket '+ method);
    } else {
        console.log('Socket not writeable');
    }
};

NodeSocket.prototype.destroy = function() {
    this.socket.destroy();
};

NodeSocket.prototype.isConnect = function(method, params, callback) {
    if(this.socket.writable) {
        return true;
    }
    return false;
};

NodeSocket.prototype.setConnectCallback = function(callback) {
    this.connectCallback = callback;
};

module.exports = NodeSocket;
