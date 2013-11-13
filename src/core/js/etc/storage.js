if (typeof Cryptocat === 'undefined') {
	Cryptocat = function() {}
}

$(window).ready(function() {

// Cryptocat Storage API
// This API uses different local storage solutions,
// depending on the browser engine, to offer a uniform
// storage interface for Cryptocat user preferences and settings.
// Currently, this provides a functional interface for:
// Cryptocat for Chrome: YES
// Cryptocat for Safari: YES
// Cryptocat for Firefox: YES

// How to use:
// Cryptocat.Storage.setItem(itemName, itemValue)
// Sets itemName's value to itemValue.

// Cryptocat.Storage.getItem(itemName, callbackFunction(result))
// Gets itemName's value from local storage, and passes it to
// the callback function as result.

// Cryptocat.Storage.removeItem(itemName)
// Removes itemName and its value from local storage.

// Define the wrapper, depending on our browser or enivronment.
Cryptocat.Storage = (function() {
	// Chrome
	if (typeof(chrome) === 'object' && chrome.storage) {
		return {
			setItem: function(key, val) {
				var keyValuePair = {}
				keyValuePair[key] = val
				chrome.storage.local.set(keyValuePair)
			},
			getItem: function(key, callback) {
				chrome.storage.local.get(key, function(r) {
					callback(r[key])
				})
			},
			removeItem: function(key) {
				chrome.storage.local.remove(key)
			}
		}
	}
	// Firefox
	else if (navigator.userAgent.match('Firefox')) {
		return {
			setItem: function(key, val) {
				var element = document.createElement('cryptocatFirefoxElement')
				document.documentElement.appendChild(element)
				var evt = document.createEvent('HTMLEvents')
				element.setAttribute('type', 'set')
				element.setAttribute('key', key)
				element.setAttribute('val', val)
				evt.initEvent('cryptocatFirefoxStorage', true, false)
				element.dispatchEvent(evt)
			},
			getItem: function(key, callback) {
				var element = document.createElement('cryptocatFirefoxElement')
				document.documentElement.appendChild(element)
				var evt = document.createEvent('HTMLEvents')
				element.setAttribute('type', 'get')
				element.setAttribute('key', key)
				evt.initEvent('cryptocatFirefoxStorage', true, false)
				element.dispatchEvent(evt)
				callback(element.getAttribute('firefoxStorageGet'))
			},
			removeItem: function() {
				return false
			}
		}
	}
	// Everything else
	else {
		return {
			setItem: function(key, value) {
				localStorage.setItem(key, value)
			},
			getItem: function(key, callback) {
				callback(localStorage.getItem(key))
			},
			removeItem: function(key) {
				localStorage.removeItem(key)
			}
		}
	}
})()

// Initialize language settings.
Cryptocat.Storage.getItem('language', function(key) {
	if (key) {
		Cryptocat.Locale.set(key)
	}
	else {
		Cryptocat.Locale.set(window.navigator.language.toLowerCase())
	}
})

// Load custom server settings
Cryptocat.Storage.getItem('domain', function(key) {
	if (key) { Cryptocat.domain = key }
})
Cryptocat.Storage.getItem('conferenceServer', function(key) {
	if (key) { Cryptocat.conferenceServer = key }
})
Cryptocat.Storage.getItem('bosh', function(key) {
	if (key) { Cryptocat.bosh = key }
})

// Load nickname settings.
Cryptocat.Storage.getItem('myNickname', function(key) {
	if (key) {
		$('#nickname').animate({'color': 'transparent'}, function() {
			$(this).val(key)
			$(this).animate({'color': '#FFF'})
		})
	}
})

// Load notification settings.
window.setTimeout(function() {
	Cryptocat.Storage.getItem('desktopNotifications', function(key) {
		if (key === 'true') { $('#notifications').click() }
	})
	Cryptocat.Storage.getItem('audioNotifications', function(key) {
		if ((key === 'true') || !key) { $('#audio').click() }
	})
}, 800)

// Load pre-existing encryption keys
// Key storage currently disabled as we are not yet sure if this is safe to do.
/*
Cryptocat.Storage.getItem('myKey', function(key) {
	if (key) {
		var myKey = new DSA(JSON.parse(key))
		Cryptocat.Storage.getItem('multiPartyKey', function(mpKey) {
			multiParty.setPrivateKey(mpKey)
			multiParty.getPublicKey()
		})
	}
})
*/

})