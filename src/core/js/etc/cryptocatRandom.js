;(function (root, factory) {

	if (typeof module !== 'undefined' && module.exports) {
		module.exports = factory({}, require('../lib/salsa20.js'), true)
	} else {
		if (typeof root.Cryptocat === 'undefined') {
			root.Cryptocat = function () {}
		}
		factory(root.Cryptocat, root.Salsa20, false)
	}

}(this, function (Cryptocat, Salsa20, node) {

var state

Cryptocat.generateSeed = function() {
	// The following incredibly ugly Firefox hack is completely the fault of 
	// Firefox developers sucking and it taking them four years+ to implement
	// window.crypto.getRandomValues().
	function firefoxRandomBytes() {
		var element = document.createElement('cryptocatFirefoxElement')
		document.documentElement.appendChild(element)
		var evt = document.createEvent('HTMLEvents')
		evt.initEvent('cryptocatGenerateRandomBytes', true, false)
		element.dispatchEvent(evt)
		var output = element.getAttribute('randomValues').split(',')
		element = null
		return output
	}
	var buffer, crypto
	// Node.js ... for tests
	if (typeof window === 'undefined' && typeof require !== 'undefined') {
		crypto = require('crypto')
		try {
			buffer = crypto.randomBytes(40)
		} catch (e) { throw e }
	}
	// If Opera, do not seed (see Cryptocat.random() comments for explanation).
	else if (navigator.userAgent.match('Opera')) {
		return false
	}
	// Firefox
	else if (navigator.userAgent.match('Firefox') &&
		(!window.crypto || !window.crypto.getRandomValues)
	) {
		buffer = firefoxRandomBytes()
	}
	// Browsers that don't require shitty workarounds
	else {
		buffer = new Uint8Array(40)
		window.crypto.getRandomValues(buffer)
	}
	return buffer
}

Cryptocat.setSeed = function(s) {
	if (!s) { return false }
	state = new Salsa20(
		[
			s[ 0],s[ 1],s[ 2],s[ 3],s[ 4],s[ 5],s[ 6],s[ 7],
			s[ 8],s[ 9],s[10],s[11],s[12],s[13],s[14],s[15],
			s[16],s[17],s[18],s[19],s[20],s[21],s[22],s[23],
			s[24],s[25],s[26],s[27],s[28],s[29],s[30],s[31]
		],
		[
			s[32],s[33],s[34],s[35],s[36],s[37],s[38],s[39]
		]
	)
}

// In Opera, Math.random() is a cryptographically secure
// random number generator. Opera is the only browser
// in which this is the case. Therefore, it is safe to use
// Math.random() instead of implementing our own CSPRNG
// if Cryptocat is running on top of Opera.
if (typeof navigator !== 'undefined' && navigator.userAgent.match('Opera')) {
	Cryptocat.random = Math.random
}
else {

	// from http://davidbau.com/encode/seedrandom.js

	Cryptocat.random = (function () {
		var width = 256,
			chunks = 6,
			significance = Math.pow(2, 52),
			overflow = significance * 2

		function numerator() {
			var bytes = state.getBytes(chunks)
			var i = 0, r = 0
			for (; i < chunks; i++) {
				r = r * width + bytes[i]
			}
			return r
		}

		// This function returns a random double in [0, 1) that contains
		// randomness in every bit of the mantissa of the IEEE 754 value.

		return function () {			// Closure to return a random double:
			var n = numerator(),		// Start with a numerator n < 2 ^ 48
				d = Math.pow(width, chunks),//	and denominator d = 2 ^ 48.
				x = 0						//	and no 'extra last byte'.
			while (n < significance) {		// Fill up all significant digits by
				n = (n + x) * width			//	shifting numerator and
				d *= width					//	denominator and generating a
				x = state.getBytes(1)[0]	//	new least-significant-byte.
			}
			while (n >= overflow) {		// To avoid rounding up, before adding
				n /= 2					//	last byte, shift everything
				d /= 2					//	right using integer math until
				x >>>= 1				//	we have exactly the desired bits.
			}
			return (n + x) / d			// Form the number within [0, 1).
		}
	}())

}

// Generates a random string of length `size` characters.
// If `alpha = 1`, random string will contain alpha characters, and so on.
// If `hex = 1`, all other settings are overridden.
Cryptocat.randomString = function(size, alpha, uppercase, numeric, hex) {
	var keyspace = ''
	var result = ''
	if (hex) { keyspace = '0123456789abcdef' }
	else {
		if (alpha) { keyspace += 'abcdefghijklmnopqrstuvwxyz' }
		if (uppercase) { keyspace += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ' }
		if (numeric) { keyspace += '0123456789' }
	}
	for (var i = 0; i !== size; i++) {
		result += keyspace[Math.floor(Cryptocat.random()*keyspace.length)]
	}
	return result
}

if (node) {
	// Seed RNG in tests.
	Cryptocat.setSeed(Cryptocat.generateSeed())
}

return Cryptocat

}))//:3