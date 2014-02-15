window.JoyPlus = (function(window, undefined) {
	// Constants
	var STATUS_DISCONNECTED = 0;
	var STATUS_CONNECTED = 1;
	var internal = {}
	internal.GUID = [];
	// Construct JoyPlus
	var JoyPlus = function() {
		this.version = 0.0;
		var data = {};
		data.status = STATUS_DISCONNECTED;
		data.GUID = (function() {
			for(;;) {
				var GUID = Math.floor(100000 * Math.random());
				if (internal.GUID.indexOf(GUID) == -1) {
					internal.GUID.push(GUID);
					return GUID;
				}
			}
		})();
		data.callback = function() {
			// Should never be called
			console.log("Null function called.");
		}
		var _message = function(msg) {
			this.message = msg;
			this.type = 'JOYPLUSCNT';
			this.GUID = data.GUID;
		}
		var _postMessage = function(msg) {
			window.postMessage(new _message(msg), '*')
		}
		var _getMessage = function(event) {
			if (event.source != window) return;
			if (event.data.type && (event.data.type == 'JOYPLUSINJ') && (event.data.GUID == data.GUID)) {
				// Dispatch message
				var message = event.data.message;
				if (data.status == STATUS_DISCONNECTED) {
					data.status = STATUS_CONNECTED;
				} else {
					data.callback(message);
				}
			}
		}
		window.addEventListener('message', _getMessage);
		this.connect = function(callback) {
			data.callback = callback;
			_postMessage({cmd: 'CONNECT', GUID: data.GUID});
		}
	}
	
	return JoyPlus;
})(window);