;(function (root, factory, undef) {
	if (typeof exports === 'object') {
		// CommonJS
		module.exports = exports = factory(
			require('./crypto-js/core'),
			require('./crypto-js/enc-base64'),
			require('./crypto-js/enc-hex'),
			require('./crypto-js/cipher-core'),
			require('./crypto-js/x64-core'),
			require('./crypto-js/aes'),
			require('./crypto-js/sha1'),
			require('./crypto-js/sha256'),
			require('./crypto-js/sha512'),
			require('./crypto-js/hmac'),
			require('./crypto-js/pad-nopadding'),
			require('./crypto-js/mode-ctr')
		)
	}
	else if (typeof define === 'function' && define.amd) {
		// AMD
		define([
			'./crypto-js/core',
			'./crypto-js/enc-base64',
			'./crypto-js/enc-hex',
			'./crypto-js/cipher-core',
			'./crypto-js/x64-core',
			'./crypto-js/aes',
			'./crypto-js/sha1',
			'./crypto-js/sha256',
			'./crypto-js/sha512',
			'./crypto-js/hmac',
			'./crypto-js/pad-nopadding',
			'./crypto-js/mode-ctr'], factory);
	}
	else {
		// Global (browser)
		root.CryptoJS = factory(root.CryptoJS)
	}
}(this, function (CryptoJS) {

	// This provides backwards compatibility with CryptoJS 3.0.2
	// CryptoJS.enc.Base64.parse used to do this by default.
	var _base64Parse = CryptoJS.enc.Base64.parse
	CryptoJS.enc.Base64.parse = function (base64Str) {
		return _base64Parse.call(CryptoJS.enc.Base64, base64Str.replace(/\s/g, ''))
	}

	return CryptoJS

}));