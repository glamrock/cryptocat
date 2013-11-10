var path = require('path'),
	test = require('../../testBase')()

var CryptoJS = require('../../../src/core/js/lib/crypto-js')

test['SHA1'] = {

	'SHA1 test vectors': {
		'abc': function () {
			var a = 'abc'
			test.assert.same(
				CryptoJS.SHA1(a).toString(),
				'a9993e364706816aba3e25717850c26c9cd0d89d'
			)
		},
		'abcdbcdecdefdefgefghfghighijhijkijkljklmklmnlmnomnopnopq': function () {
			var a = 'abcdbcdecdefdefgefghfghighijhijkijkljklmklmnlmnomnopnopq'
			test.assert.same(
				CryptoJS.SHA1(a).toString(),
				'84983e441c3bd26ebaae4aa1f95129e5e54670f1'
			)
		},
		'0': function () {
			var a = 0
			test.assert.same(
				CryptoJS.SHA1(a).toString(),
				'da39a3ee5e6b4b0d3255bfef95601890afd80709'
			)
		}
	}

}

module.exports[path.basename(__filename)] = test