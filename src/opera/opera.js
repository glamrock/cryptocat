chrome.runtime.onInstalled.addListener(function(details) {
	if (details.reason === 'install') {
		chrome.tabs.create({'url': chrome.extension.getURL('firstRun.html')}, function(tab) {})
	}
	else if (details.reason === 'update') {}
})

chrome.browserAction.onClicked.addListener(function(){
	chrome.tabs.create({'url': chrome.extension.getURL('index.html')}, function(tab) {})
})