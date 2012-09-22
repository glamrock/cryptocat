var cryptocat = function () {
	var prefManager = Components.classes['@mozilla.org/preferences-service;1'].getService(Components.interfaces.nsIPrefBranch);
	return {
		init: function () {
			var firstRun = prefManager.getBoolPref('extensions.cryptocat.firstRun');
			if (firstRun) {
				Application.prefs.setValue('extensions.cryptocat.firstRun', false);
				var navbar = document.getElementById('nav-bar');
				var newset = navbar.currentSet + ',cryptocatToolbarButton';
				navbar.currentSet = newset;
				navbar.setAttribute('currentset', newset );
				document.persist('nav-bar', 'currentset'); 
			}
		},
		run: function () {
			var tBrowser = document.getElementById('content');
			var tab = tBrowser.addTab('chrome://cryptocat/content/data/index.html');
			tBrowser.selectedTab = tab;
		}
	};
}();
window.addEventListener('load', cryptocat.init(), false);