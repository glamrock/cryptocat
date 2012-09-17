var cryptocat = function () {
	var prefManager = Components.classes['@mozilla.org/preferences-service;1'].getService(Components.interfaces.nsIPrefBranch);
	return {
		init: function () {
			gBrowser.addEventListener("load", function () {
				var autoRun = prefManager.getBoolPref("extensions.linktargetfinder.autorun");
				if (autoRun) {
					linkTargetFinder.run();
				}
			}, false);
		},
			
		run: function () {
			var tBrowser = document.getElementById('content');
			var tab = tBrowser.addTab('chrome://cryptocat/content/data/main.html');
			tBrowser.selectedTab = tab;
		}
	};
}();
window.addEventListener("load", linkTargetFinder.init, false);