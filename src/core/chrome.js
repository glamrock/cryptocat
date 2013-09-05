chrome.app.runtime.onLaunched.addListener(function() {
	chrome.app.window.create('index.html', {
		'bounds': {
			'width': 755,
			'height': 590,
		},
		'resizable': false
	})
})