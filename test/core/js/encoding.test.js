var path = require('path'),
	test = require('../../testBase')()

var CryptoJS = require('../../../src/core/js/lib/crypto-js')

test['Encoding'] = {

	'CryptoJS encoding types': {
		'Hex': function() {
			test.assert.same(
				CryptoJS.enc.Hex.parse('6162636465666768696a6b6c6d6e6f707172737475767778797a30313233343536373839').toString(CryptoJS.enc.Hex),
				'6162636465666768696a6b6c6d6e6f707172737475767778797a30313233343536373839'
			)
			test.assert.same(
				CryptoJS.enc.Hex.parse('6162636465666768696a6b6c6d6e6f707172737475767778797a30313233343536373839').toString(CryptoJS.enc.Base64),
				'YWJjZGVmZ2hpamtsbW5vcHFyc3R1dnd4eXowMTIzNDU2Nzg5'
			)
			test.assert.same(
				CryptoJS.enc.Hex.parse('6162636465666768696a6b6c6d6e6f707172737475767778797a30313233343536373839').toString(CryptoJS.enc.Latin1),
				'abcdefghijklmnopqrstuvwxyz0123456789'
			)
			test.assert.same(
				CryptoJS.enc.Hex.parse('6162636465666768696a6b6c6d6e6f707172737475767778797a30313233343536373839').toString(CryptoJS.enc.Utf8),
				'abcdefghijklmnopqrstuvwxyz0123456789'
			)
		},
		'Base64': function() {
			test.assert.same(
				CryptoJS.enc.Base64.parse('YWJjZGVmZ2hpamtsbW5vcHFyc3R1dnd4eXowMTIzNDU2Nzg5').toString(CryptoJS.enc.Base64),
				'YWJjZGVmZ2hpamtsbW5vcHFyc3R1dnd4eXowMTIzNDU2Nzg5'
			)
			test.assert.same(
				CryptoJS.enc.Base64.parse('YWJjZGVmZ2hpamtsbW5vcHFyc3R1dnd4eXowMTIzNDU2Nzg5').toString(CryptoJS.enc.Hex),
				'6162636465666768696a6b6c6d6e6f707172737475767778797a30313233343536373839'
			)
			test.assert.same(
				CryptoJS.enc.Base64.parse('YWJjZGVmZ2hpamtsbW5vcHFyc3R1dnd4eXowMTIzNDU2Nzg5').toString(CryptoJS.enc.Latin1),
				'abcdefghijklmnopqrstuvwxyz0123456789'
			)
			test.assert.same(
				CryptoJS.enc.Base64.parse('YWJjZGVmZ2hpamtsbW5vcHFyc3R1dnd4eXowMTIzNDU2Nzg5').toString(CryptoJS.enc.Utf8),
				'abcdefghijklmnopqrstuvwxyz0123456789'
			)
		},
		'Latin1': function() {
			test.assert.same(
				CryptoJS.enc.Latin1.parse('abcdefghijklmnopqrstuvwxyz0123456789').toString(CryptoJS.enc.Latin1),
				'abcdefghijklmnopqrstuvwxyz0123456789'
			)
			test.assert.same(
				CryptoJS.enc.Latin1.parse('abcdefghijklmnopqrstuvwxyz0123456789').toString(CryptoJS.enc.Hex),
				'6162636465666768696a6b6c6d6e6f707172737475767778797a30313233343536373839'
			)
			test.assert.same(
				CryptoJS.enc.Latin1.parse('abcdefghijklmnopqrstuvwxyz0123456789').toString(CryptoJS.enc.Base64),
				'YWJjZGVmZ2hpamtsbW5vcHFyc3R1dnd4eXowMTIzNDU2Nzg5'
			)
			test.assert.same(
				CryptoJS.enc.Latin1.parse('abcdefghijklmnopqrstuvwxyz0123456789').toString(CryptoJS.enc.Utf8),
				'abcdefghijklmnopqrstuvwxyz0123456789'
			)
		},
		'Utf8': function() {
			test.assert.same(
				CryptoJS.enc.Utf8.parse('abcdefghijklmnopqrstuvwxyz0123456789').toString(CryptoJS.enc.Utf8),
				'abcdefghijklmnopqrstuvwxyz0123456789'
			)
			test.assert.same(
				CryptoJS.enc.Utf8.parse('abcdefghijklmnopqrstuvwxyz0123456789').toString(CryptoJS.enc.Latin1),
				'abcdefghijklmnopqrstuvwxyz0123456789'
			)
			test.assert.same(
				CryptoJS.enc.Utf8.parse('abcdefghijklmnopqrstuvwxyz0123456789').toString(CryptoJS.enc.Hex),
				'6162636465666768696a6b6c6d6e6f707172737475767778797a30313233343536373839'
			)
			test.assert.same(
				CryptoJS.enc.Utf8.parse('abcdefghijklmnopqrstuvwxyz0123456789').toString(CryptoJS.enc.Base64),
				'YWJjZGVmZ2hpamtsbW5vcHFyc3R1dnd4eXowMTIzNDU2Nzg5'
			)
		},
	},

}

module.exports[path.basename(__filename)] = test