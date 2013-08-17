if (typeof Cryptocat === 'undefined') {
	Cryptocat = function() {}
}

$(window).ready(function() {

Cryptocat.Storage =  (function () {
	if (!navigator.userAgent.match('Firefox')) {
		return localStorage
	}
	// in-memory storage implementation
	var items = {}
	return {
		getItem: function (key) { return items[key] },
		setItem: function (key, val) { items[key] = val },
		removeItem: function (key) { delete items[key] },
		initLocalStorage: function () { Cryptocat.Storage = localStorage }
	}
})()

// Initialize language settings.
if (Cryptocat.Storage.getItem('language')) {
	Cryptocat.Language.set(Cryptocat.Storage.getItem('language'))
}
else {
	Cryptocat.Language.set(window.navigator.language.toLowerCase())
}

// Load custom server settings
if (Cryptocat.Storage.getItem('domain')) {
	Cryptocat.domain = Cryptocat.Storage.getItem('domain')
}
if (Cryptocat.Storage.getItem('conferenceServer')) {
	Cryptocat.conferenceServer = Cryptocat.Storage.getItem('conferenceServer')
}
if (Cryptocat.Storage.getItem('bosh')) {
	Cryptocat.bosh = Cryptocat.Storage.getItem('bosh')
}

// Load pre-existing encryption keys
// Key storage currently disabled as we are not yet sure if this is safe to do.
/* if (Cryptocat.Storage.getItem('myKey') !== null) {
 myKey = new DSA(JSON.parse(Cryptocat.Storage.getItem('myKey')))
 multiParty.setPrivateKey(Cryptocat.Storage.getItem('multiPartyKey'))
 multiParty.genPublicKey()
 } */

// Load nickname settings.
if (Cryptocat.Storage.getItem('myNickname')) {
	$('#nickname').animate({'color': 'transparent'}, function() {
		$(this).val(Cryptocat.Storage.getItem('myNickname'))
		$(this).animate({'color': '#FFF'})
	})
}
// Load notification settings.
window.setTimeout(function() {
	if (Cryptocat.Storage.getItem('desktopNotifications') === 'true') {
		$('#notifications').click()
	}
	if (Cryptocat.Storage.getItem('audioNotifications') === 'true') {
		$('#audio').click()
	}
}, 3000)

})