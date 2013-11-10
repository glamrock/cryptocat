var path = require('path'),
	test = require('../../testBase')()

var CryptoJS = require('../../../src/core/js/lib/crypto-js')

test['SHA256'] = {

	'SHA256 test vectors': {
		'abc': function () {
			var a = 'abc'
			test.assert.same(
				CryptoJS.SHA256(a).toString(),
				'ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad'
			)
		},
		'abcdbcdecdefdefgefghfghighijhijkijkljklmklmnlmnomnopnopq': function () {
			var a = 'abcdbcdecdefdefgefghfghighijhijkijkljklmklmnlmnomnopnopq'
			test.assert.same(
				CryptoJS.SHA256(a).toString(),
				'248d6a61d20638b8e5c026930c3e6039a33ce45964ff2167f6ecedd419db06c1'
			)
		},
		'a*1000000': function () {
			var a = ''
			for (var i = 0; i !== 100000; i++) {
				a += 'aaaaaaaaaa'
			}
			test.assert.same(
				CryptoJS.SHA256(a).toString(),
				'cdc76e5c9914fb9281a1c7e284d73e67f1809a48a497200e046d39ccc7112cd0'
			)
		}
	}

}

module.exports[path.basename(__filename)] = test