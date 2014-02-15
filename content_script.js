// Copyright (c) 2014 zcy

var s = document.createElement('script');
s.src = chrome.extension.getURL('script.js');
s.onload = function() {
	this.parentNode.removeChild(this);
};
var _deviceMapping = {};

var _sendMessage = function(GUID, message) {
	_plugin.postMessage({
		message: message,
		GUID: GUID
	}, _recvMessage);
}
JP.onEvent(function(e) {
	var device = e.device;
	_sendMessage(_deviceMapping[device], e);
});
window.addEventListener('message', function(event) {
	if (event.source != window) return;
	if (event.data.type && (event.data.type == 'JOYPLUSCNT')) {
		//console.log(event.data.message);
		//_sendMessage(event.data.message);
		var data = event.data.message;
		var GUID = event.data.GUID;
		if (data.cmd == 'CONNECT') {
			JP.connect(function(device) {
				_deviceMapping[device] = GUID;
				_sendMessage(GUID, {
					device: device
				});
			})
		}
	}
});
(document.head||document.documentElement).appendChild(s);