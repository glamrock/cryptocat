var cryptocat = function () {
	var prefManager = Components.classes['@mozilla.org/preferences-service;1'].getService(Components.interfaces.nsIPrefBranch);
	return {
		init: function () {
			gBrowser.addEventListener("load", function () {
				var autoRun = prefManager.getBoolPref("extensions.cryptocat.autorun");
				if (autoRun) {
					cryptocat.run();
				}
			}, false);
		},
			
		run: function () {
			var tBrowser = document.getElementById('content');
			var tab = tBrowser.addTab('chrome://cryptocat/content/data/index.html');
			tBrowser.selectedTab = tab;
		}
	};
}();
window.addEventListener("load", cryptocat.init, false);
