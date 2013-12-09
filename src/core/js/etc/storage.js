Cryptocat.storage = {}

$(window).ready(function() {

// Cryptocat Storage API
// This API uses different local storage solutions,
// depending on the browser engine, to offer a uniform
// storage interface for Cryptocat user preferences and settings.

// How to use:
// Cryptocat.storage.setItem(itemName, itemValue)
// Sets itemName's value to itemValue.

// Cryptocat.storage.getItem(itemName, callbackFunction(result))
// Gets itemName's value from local storage, and passes it to
// the callback function as result.

// Cryptocat.storage.removeItem(itemName)
// Removes itemName and its value from local storage.

// Define the wrapper, depending on our browser or enivronment.
Cryptocat.storage = (function() {
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
Cryptocat.storage.getItem('language', function(key) {
	if (key) {
		Cryptocat.locale.set(key)
	}
	else {
		Cryptocat.locale.set(window.navigator.language.toLowerCase())
	}
})

// Load custom server settings
Cryptocat.storage.getItem('serverName', function(key) {
	if (key) { Cryptocat.serverName = key }
})
Cryptocat.storage.getItem('domain', function(key) {
	if (key) { Cryptocat.xmpp.domain = key }
})
Cryptocat.storage.getItem('conferenceServer', function(key) {
	if (key) { Cryptocat.xmpp.conferenceServer = key }
})
Cryptocat.storage.getItem('bosh', function(key) {
	if (key) { Cryptocat.xmpp.bosh = key }
})
Cryptocat.storage.getItem('customServers', function(key) {
	if (key) {
		$('#customServerSelector').empty()
		var servers = $.parseJSON(key)
		$.each(servers, function(name) {
			$('#customServerSelector').append(
				Mustache.render(Cryptocat.templates['customServer'], {
					name: name,
					domain: servers[name]['domain'],
					XMPP: servers[name]['xmpp'],
					BOSH: servers[name]['bosh']
				})
			)
		})
	}
})

// Load nickname settings.
Cryptocat.storage.getItem('myNickname', function(key) {
	if (key) {
		$('#nickname').animate({'color': 'transparent'}, function() {
			$(this).val(key)
			$(this).animate({'color': '#FFF'})
		})
	}
})

// Load notification settings.
window.setTimeout(function() {
	Cryptocat.storage.getItem('desktopNotifications', function(key) {
		if (key === 'true') { $('#notifications').click() }
	})
	Cryptocat.storage.getItem('audioNotifications', function(key) {
		if ((key === 'true') || !key) { $('#audio').click() }
	})
}, 800)

// Load pre-existing encryption keys
// Key storage currently disabled as we are not yet sure if this is safe to do.
/*
Cryptocat.storage.getItem('myKey', function(key) {
	if (key) {
		var Cryptocat.otr.myKey = new DSA(JSON.parse(key))
		Cryptocat.storage.getItem('multiPartyKey', function(mpKey) {
			multiParty.setPrivateKey(mpKey)
			multiParty.getPublicKey()
		})
	}
})
*/

})