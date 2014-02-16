// Copyright (c) 2014 zcy

var s = document.createElement('script');
s.src = chrome.extension.getURL('script.js');
s.onload = function() {
	this.parentNode.removeChild(this);
};
var _deviceMapping = {};

var _sendMessage = function(GUID, message) {
	window.postMessage({
		message: message,
		GUID: GUID,
		type: 'JOYPLUSINJ'
	}, '*');
}
JP.onEvent(function(e) {
	var device = e.device;
	//console.log('In JP.onEvent: device=' + device);
	_sendMessage(_deviceMapping[device], e);
});
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
	var message = request.action;
	_sendMessage(0, {action: 'connect'});
})
window.addEventListener('message', function(event) {
	if (event.source != window) return;
	if (event.data.type && (event.data.type == 'JOYPLUSCNT')) {
		//console.log(event.data.message);
		//_sendMessage(event.data.message);
		var msg = event.data.message;
		var GUID = event.data.GUID;
		var layout = msg.layout;
		if (msg.cmd == 'CONNECT') {
			JP.connect(layout, function(device) {
				_deviceMapping[device] = GUID;
				console.log('Device mapping for ' + device + ' => ' + GUID + ' created.');
				_sendMessage(GUID, {
					device: device
				});
			})
		}
	}
});
(document.head||document.documentElement).appendChild(s);