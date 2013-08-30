if (typeof Cryptocat === 'undefined') {
	Cryptocat = function() {}
}

$(window).ready(function() {

// Define the wrapper, depending on our browser or enivronment.
Cryptocat.Storage = (function() {
	if (typeof(chrome) === 'object') {
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
	else if (!navigator.userAgent.match('Firefox')) {
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
	else {
		var items = {}
		return {
			setItem: function(key, val) { items[key] = val },
			getItem: function(key, callback) { callback(items[key]) },
			removeItem: function(key) { delete items[key] }
		}
	}
})()

// Initialize language settings.
Cryptocat.Storage.getItem('language', function(key) {
	if (key) {
		Cryptocat.Language.set(key)
	}
	else {
		Cryptocat.Language.set(window.navigator.language.toLowerCase())
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
		if (key === 'true') { $('#audio').click() }
	})
}, 3000)

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