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
		'a*1000000': function () {
			var a = ''
			for (var i = 0; i !== 100000; i++) {
				a += 'aaaaaaaaaa'
			}
			test.assert.same(
				CryptoJS.SHA1(a).toString(),
				'34aa973cd4c4daa4f61eeb2bdbad27316534016f'
			)
		}
	}

}

module.exports[path.basename(__filename)] = test