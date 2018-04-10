chrome.runtime.onInstalled.addListener(function(details) {
	if (details.reason === 'install') {
		chrome.tabs.create({'url': chrome.extension.getURL('firstRun.html')})
	}
})

chrome.browserAction.onClicked.addListener(function(){
	chrome.tabs.create({'url': chrome.extension.getURL('index.html')})
})