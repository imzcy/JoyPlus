// Copyright (c) 2012 zcy
/*
chrome.runtime.onConnect.addListener(function(port) {
	var tab = port.sender.tab;

	port.onMessage.addListener(function(info) {
		//tab.console.log(info.description)
	});
});
*/
// Called when the user clicks on the browser action icon.
chrome.browserAction.onClicked.addListener(function(tab) {
  // We can only inject scripts to find the title on pages loaded with http
  // and https so for all other pages, we don't ask for the title.
	chrome.tabs.sendMessage(tab.id, {action: 'connect'}, function(response){});
});
/*
function pageInjection() {
	chrome.tabs.executeScript(null, {file: "content_script.js"});
}

pageInjection();
*/
  