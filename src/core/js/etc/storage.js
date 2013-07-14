if (typeof Cryptocat === 'undefined') {
	Cryptocat = function() {}
}

Cryptocat.Storage = Cryptocat.Storage || localStorage

/**
 * In-memory storage implementation. Used as a fallback to localStorage
 */
Cryptocat.initInMemoryStorage = function () {
	var items = {}
	Cryptocat.Storage = {
		getItem: function (key) { return items[key] },
		setItem: function (key, val) { items[key] = val },
		removeItem: function (key) { delete items[key] },
		initLocalStorage: function () { Cryptocat.Storage = localStorage }
	}
}
