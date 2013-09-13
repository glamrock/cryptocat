;(function (root) {
	'use strict';

	root.OTR = {}
	root.crypto = {}
	
	var imports = [
		'../lib/crypto-js/core.js',
		'../lib/crypto-js/enc-base64.js',
		'../lib/crypto-js/cipher-core.js',
		'../lib/crypto-js/x64-core.js',
		'../lib/crypto-js/aes.js',
		'../lib/crypto-js/sha1.js',
		'../lib/crypto-js/sha256.js',
		'../lib/crypto-js/sha512.js',
		'../lib/crypto-js/hmac.js',
		'../lib/crypto-js/pad-nopadding.js',
		'../lib/crypto-js/mode-ctr.js',
		'../lib/salsa20.js',
		'../etc/random.js',
		'../lib/bigint.js',
		'../lib/eventemitter.js',
		'../lib/otr.js'
	]
	
	function wrapPostMessage(method) {
		return function () {
			postMessage({
					method: method,
			args: Array.prototype.slice.call(arguments, 0)
			})
		}
	}

	var sm
	onmessage = function (msg) {
		var d = msg.data
		switch (d.type) {
			case 'seed':
				imports.forEach(function (i) {
					importScripts(i)
				})
				Cryptocat.setSeed(d.seed)
				break
			case 'init':
				sm = new root.OTR.SM(d.reqs)
				;['trust','question', 'send', 'abort'].forEach(function (e) {
					sm.on(e, wrapPostMessage(e));
				})
				break
			case 'method':
				sm[d.method].apply(sm, d.args)
				break
		}
	}

}(this))