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

// from http://davidbau.com/encode/seedrandom.js

Cryptocat.randomFloat = (function () {
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

Cryptocat.randomByte = function() {
	return state.getBytes(1)[0]
}

Cryptocat.getBytes = function(i) {
	return state.getBytes(i)
}

Cryptocat.randomBitInt = function(k) {
	if (k > 31) {
		throw new Error('That\'s more than JS can handle.')
	}
	var i = 0, r = 0
	var b = Math.floor(k / 8)
	var mask = (1 << (k % 8)) - 1
	if (mask) {
		r = Cryptocat.randomByte() & mask
	}
	for (; i < b; i++) {
		r = (256 * r) + Cryptocat.randomByte()
	}
	return r
}

if (node) {
	// Seed RNG in tests.
	Cryptocat.setSeed(Cryptocat.generateSeed())
}

return Cryptocat

}))//:3