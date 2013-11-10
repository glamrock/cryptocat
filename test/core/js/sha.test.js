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

test['SHA512'] = {

	'SHA512 test vectors': {
		'abc': function () {
			var a = 'abc'
			test.assert.same(
				CryptoJS.SHA512(a).toString(),
				'ddaf35a193617abacc417349ae20413112e6fa4e89a97ea20a9eeee64b55d39a2192992a274fc1a836ba3c23a3feebbd454d4423643ce80e2a9ac94fa54ca49f'
			)
		},
		'abcdbcdecdefdefgefghfghighijhijkijkljklmklmnlmnomnopnopq': function () {
			var a = 'abcdbcdecdefdefgefghfghighijhijkijkljklmklmnlmnomnopnopq'
			test.assert.same(
				CryptoJS.SHA512(a).toString(),
				'204a8fc6dda82f0a0ced7beb8e08a41657c16ef468b228a8279be331a703c33596fd15c13b1b07f9aa1d3bea57789ca031ad85c7a71dd70354ec631238ca3445'
			)
		},
		'a*1000000': function () {
			var a = ''
			for (var i = 0; i !== 100000; i++) {
				a += 'aaaaaaaaaa'
			}
			test.assert.same(
				CryptoJS.SHA512(a).toString(),
				'e718483d0ce769644e2e42c7bc15b4638e1f98b13b2044285632a803afa973ebde0ff244877ea60a4cb0432ce577c31beb009c5c2c49aa2e4eadb217ad8cc09b'
			)
		}
	}

}

module.exports[path.basename(__filename)] = test