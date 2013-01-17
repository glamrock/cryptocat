var cryptocat = function() {
	Components.utils.import("resource://gre/modules/Services.jsm");
	Components.utils.import('resource://gre/modules/ctypes.jsm');
	var prefsService = Services.prefs;
	var cryptocatRandom = Components.utils.import('chrome://cryptocat/content/generateRandomBytes.jsm');
	return {
		init: function() {
			var firstRun = prefsService.getBoolPref('extensions.cryptocat.firstRun');
			if (firstRun) {
				Application.prefs.setValue('extensions.cryptocat.firstRun', false);
				var navBar = document.getElementById('nav-bar');
				var newSet = navBar.currentSet + ',cryptocatToolbarButton';
				navBar.currentSet = newSet;
				navBar.setAttribute('currentset', newSet);
				document.persist('nav-bar', 'currentset'); 
			}
		},
		run: function() {
			gBrowser.selectedTab = gBrowser.addTab('chrome://cryptocat/content/data/index.html');
			window.addEventListener('cryptocatGenerateRandomBytes', function(evt) {
				cryptocat.generateRandomBytes(evt)
			}, false, true);
		},
		generateRandomBytes: function(evt) {
			try {
				cryptocatRandom.WeaveCrypto.initNSS(ctypes.libraryName('nss3'));
			}
			catch(err) {
				cryptocatRandom.WeaveCrypto.path = Services.dirsvc.get('GreD', Ci.nsIFile);
				cryptocatRandom.WeaveCrypto.path.append(ctypes.libraryName('nss3'));
				cryptocatRandom.WeaveCrypto.initNSS(WeaveCrypto.path.path);
			}
			evt.target.setAttribute('randomValues', cryptocatRandom.WeaveCrypto.generateRandomBytes(1024));
		}
	};
}();
window.addEventListener('load', cryptocat.init(), false);
