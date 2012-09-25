var cryptocat = function() {
	var prefManager = Components.classes['@mozilla.org/preferences-service;1'].getService(Components.interfaces.nsIPrefBranch);
	return {
		init: function() {
			var firstRun = prefManager.getBoolPref('extensions.cryptocat.firstRun');
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
			var tBrowser = document.getElementById('content');
			var tab = tBrowser.addTab('chrome://cryptocat/content/data/index.html');
			tBrowser.selectedTab = tab;
			window.addEventListener('generateRandomBytes', function(evt) {cryptocat.generateRandomBytes(evt)}, false, true);
		},
		generateRandomBytes: function(evt) {
			Components.utils.import('resource://gre/modules/ctypes.jsm');
			Components.utils.import('chrome://cryptocat/content/generateRandomBytes.jsm');
			WeaveCrypto.path = Services.dirsvc.get('GreD', Ci.nsILocalFile);
			WeaveCrypto.libName = ctypes.libraryName('nss3'); // platform specific library name
			WeaveCrypto.path.append(WeaveCrypto.libName);
			WeaveCrypto.initNSS(WeaveCrypto.path.path);
			evt.target.setAttribute('randomValues', WeaveCrypto.generateRandomBytes(1024));
			var doc = evt.target.ownerDocument;
			var answerEvt = doc.createElement('extensionAnswer');
			doc.documentElement.appendChild(answerEvt);
			var event = doc.createEvent('AnswerEvent');
			event.initEvent('AnswerEvent', true, false);
			answerEvt.dispatchEvent(event);	
		}
	};
}();
window.addEventListener('load', cryptocat.init(), false);