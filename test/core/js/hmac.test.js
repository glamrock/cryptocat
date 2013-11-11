var path = require('path'),
	test = require('../../testBase')()

var CryptoJS = require('../../../src/core/js/lib/crypto-js')

test['HMAC'] = {

	'HMAC-SHA1 test vectors': {
		'Test Case 1': function() {
			test.assert.same(
				CryptoJS.HmacSHA1(
					CryptoJS.enc.Hex.parse('4869205468657265'),
					CryptoJS.enc.Hex.parse('0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b')
				).toString(),
				'b617318655057264e28bc0b6fb378c8ef146be00'
			)
		},
		'Test Case 2': function() {
			test.assert.same(
				CryptoJS.HmacSHA1(
					CryptoJS.enc.Hex.parse('7768617420646f2079612077616e7420666f72206e6f7468696e673f'),
					CryptoJS.enc.Hex.parse('4a656665')
				).toString(),
				'effcdf6ae5eb2fa2d27416d5f184df9c259a7c79'
			)
		},
		'Test Case 3': function() {
			test.assert.same(
				CryptoJS.HmacSHA1(
					CryptoJS.enc.Hex.parse(
						  'dddddddddddddddddddddddddddddddd'
						+ 'dddddddddddddddddddddddddddddddd'
						+ 'dddddddddddddddddddddddddddddddd'
						+ 'dddd'),
					CryptoJS.enc.Hex.parse(
						  'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'
						+ 'aaaaaaaa')
				).toString(),
				'125d7342b9ac11cd91a39af48aa17b4f63f175d3'
			)
		},
		'Test Case 7': function() {
			test.assert.same(
				CryptoJS.HmacSHA1(
					CryptoJS.enc.Latin1.parse('Test Using Larger Than Block-Size Key and Larger Than One Block-Size Data'),
					CryptoJS.enc.Hex.parse(
						  'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'
						+ 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'
						+ 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'
						+ 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'
						+ 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa')
				).toString(),
				'e8e99d0f45237d786d6bbaa7965c7808bbff1a91'
			)
		},
	},

	'HMAC-SHA256 test vectors': {
		'Test Case 1': function() {
			test.assert.same(
				CryptoJS.HmacSHA256(
					CryptoJS.enc.Hex.parse('4869205468657265'),
					CryptoJS.enc.Hex.parse('0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b')
				).toString(),
				'b0344c61d8db38535ca8afceaf0bf12b881dc200c9833da726e9376c2e32cff7'
			)
		},
		'Test Case 2': function() {
			test.assert.same(
				CryptoJS.HmacSHA256(
					CryptoJS.enc.Hex.parse('7768617420646f2079612077616e7420666f72206e6f7468696e673f'),
					CryptoJS.enc.Hex.parse('4a656665')
				).toString(),
				'5bdcc146bf60754e6a042426089575c75a003f089d2739839dec58b964ec3843'
			)
		},
		'Test Case 3': function() {
			test.assert.same(
				CryptoJS.HmacSHA256(
					CryptoJS.enc.Hex.parse(
						  'dddddddddddddddddddddddddddddddd'
						+ 'dddddddddddddddddddddddddddddddd'
						+ 'dddddddddddddddddddddddddddddddd'
						+ 'dddd'),
					CryptoJS.enc.Hex.parse(
						  'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'
						+ 'aaaaaaaa')
				).toString(),
				'773ea91e36800e46854db8ebd09181a72959098b3ef8c122d9635514ced565fe'
			)
		},
		'Test Case 7': function() {
			test.assert.same(
				CryptoJS.HmacSHA256(
					CryptoJS.enc.Hex.parse(
						  '54686973206973206120746573742075'
						+ '73696e672061206c6172676572207468'
						+ '616e20626c6f636b2d73697a65206b65'
						+ '7920616e642061206c61726765722074'
						+ '68616e20626c6f636b2d73697a652064'
						+ '6174612e20546865206b6579206e6565'
						+ '647320746f2062652068617368656420'
						+ '6265666f7265206265696e6720757365'
						+ '642062792074686520484d414320616c'
						+ '676f726974686d2e'),
					CryptoJS.enc.Hex.parse(
						  'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'
						+ 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'
						+ 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'
						+ 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'
						+ 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'
						+ 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'
						+ 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'
						+ 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'
						+ 'aaaaaa')
				).toString(),
				'9b09ffa71b942fcb27635fbcd5b0e944bfdc63644f0713938a7f51535c3a35e2'
			)
		},
	},
	
	'HMAC-SHA512 test vectors': {
		'Test Case 1': function() {
			test.assert.same(
				CryptoJS.HmacSHA512(
					CryptoJS.enc.Hex.parse('4869205468657265'),
					CryptoJS.enc.Hex.parse('0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b')
				).toString(),
				  '87aa7cdea5ef619d4ff0b4241a1d6cb0'
				+ '2379f4e2ce4ec2787ad0b30545e17cde'
				+ 'daa833b7d6b8a702038b274eaea3f4e4'
				+ 'be9d914eeb61f1702e696c203a126854'
			)
		},
		'Test Case 2': function() {
			test.assert.same(
				CryptoJS.HmacSHA512(
					CryptoJS.enc.Hex.parse('7768617420646f2079612077616e7420666f72206e6f7468696e673f'),
					CryptoJS.enc.Hex.parse('4a656665')
				).toString(),
				  '164b7a7bfcf819e2e395fbe73b56e0a3'
				+ '87bd64222e831fd610270cd7ea250554'
				+ '9758bf75c05a994a6d034f65f8f0e6fd'
				+ 'caeab1a34d4a6b4b636e070a38bce737'
			)
		},
		'Test Case 3': function() {
			test.assert.same(
				CryptoJS.HmacSHA512(
					CryptoJS.enc.Hex.parse(
						  'dddddddddddddddddddddddddddddddd'
						+ 'dddddddddddddddddddddddddddddddd'
						+ 'dddddddddddddddddddddddddddddddd'
						+ 'dddd'),
					CryptoJS.enc.Hex.parse(
						  'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'
						+ 'aaaaaaaa')
				).toString(),
				  'fa73b0089d56a284efb0f0756c890be9'
				+ 'b1b5dbdd8ee81a3655f83e33b2279d39'
				+ 'bf3e848279a722c806b485a47e67c807'
				+ 'b946a337bee8942674278859e13292fb'
			)
		},
		'Test Case 7': function() {
			test.assert.same(
				CryptoJS.HmacSHA512(
					CryptoJS.enc.Hex.parse(
						  '54686973206973206120746573742075'
						+ '73696e672061206c6172676572207468'
						+ '616e20626c6f636b2d73697a65206b65'
						+ '7920616e642061206c61726765722074'
						+ '68616e20626c6f636b2d73697a652064'
						+ '6174612e20546865206b6579206e6565'
						+ '647320746f2062652068617368656420'
						+ '6265666f7265206265696e6720757365'
						+ '642062792074686520484d414320616c'
						+ '676f726974686d2e'),
					CryptoJS.enc.Hex.parse(
						  'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'
						+ 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'
						+ 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'
						+ 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'
						+ 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'
						+ 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'
						+ 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'
						+ 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'
						+ 'aaaaaa')
				).toString(),
				  'e37b6a775dc87dbaa4dfa9f96e5e3ffd'
				+ 'debd71f8867289865df5a32d20cdc944'
				+ 'b6022cac3c4982b10d5eeb55c3e4de15'
				+ '134676fb6de0446065c97440fa8c6a58'
			)
		},
	}

}

module.exports[path.basename(__filename)] = test