chrome.app.runtime.onLaunched.addListener(function() {
	chrome.app.window.create('index.html', {
		'bounds': {
			'width': 736,
			'height': 570,
		},
		'resizable': false
	})
})