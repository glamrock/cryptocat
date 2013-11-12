/*jshint -W117*/

Components.utils.import('resource://gre/modules/Services.jsm')
Components.utils.import('resource://gre/modules/ctypes.jsm')
var prefsService = Services.prefs

var CryptocatFirefox = {}

CryptocatFirefox.init = function() {
	var firstRun = prefsService.getBoolPref('extensions.cryptocat.firstRun')
	if (firstRun) {
		Application.prefs.setValue('extensions.cryptocat.firstRun', false)
		var navBar = document.getElementById('nav-bar')
		var newSet = navBar.currentSet + ',cryptocatToolbarButton'
		navBar.currentSet = newSet
		navBar.setAttribute('currentset', newSet)
		document.persist('nav-bar', 'currentset')
	}
}

CryptocatFirefox.run = function() {
	gBrowser.selectedTab = gBrowser.addTab('chrome://cryptocat/content/data/index.html')
	window.addEventListener('cryptocatGenerateRandomBytes', function(evt) {
		CryptocatFirefox.generateRandomBytes(evt)
	}, false, true)
	window.addEventListener('cryptocatFirefoxStorage', function(evt) {
		var type = evt.target.getAttribute('type')
		if (type === 'set') {
			Application.prefs.setValue(
				'extensions.cryptocat.' + evt.target.getAttribute('key'),
				evt.target.getAttribute('val')
			)
		}
		if (type === 'get') {
			evt.target.setAttribute('firefoxStorageGet',
				prefsService.getCharPref(
					'extensions.cryptocat.' + evt.target.getAttribute('key')
				)
			)
		}
	}, false, true)
}

CryptocatFirefox.random = Components.utils.import('chrome://cryptocat/content/generateRandomBytes.jsm')

CryptocatFirefox.generateRandomBytes = function(evt) {
	try {
		CryptocatFirefox.random.WeaveCrypto.initNSS(ctypes.libraryName('nss3'))
	}
	catch(err) {
		CryptocatFirefox.random.WeaveCrypto.path = Services.dirsvc.get('GreD', Ci.nsIFile)
		CryptocatFirefox.random.WeaveCrypto.path.append(ctypes.libraryName('nss3'))
		CryptocatFirefox.random.WeaveCrypto.initNSS(WeaveCrypto.path.path)
	}
	evt.target.setAttribute('randomValues', CryptocatFirefox.random.WeaveCrypto.generateRandomBytes(40))
}

window.addEventListener('load', CryptocatFirefox.init(), false)