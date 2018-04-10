var path = require('path'),
	test = require('../../testBase')()

var CryptoJS = require('../../../src/core/js/lib/crypto-js')

var opts = {
	mode: CryptoJS.mode.CTR,
	iv: CryptoJS.enc.Hex.parse('f0f1f2f3f4f5f6f7f8f9fafbfcfdfeff'),
	padding: CryptoJS.pad.NoPadding
}

test['AES'] = {

	'CTR-128': {
		'Encrypt': function() {
			var p = '6bc1bee22e409f96e93d7e117393172aae2d8a571e03ac9c9eb76fac45af8e5130c81c46a35ce411e5fbc1191a0a52eff69f2445df4f9b17ad2b417be66c3710'
			var c = '874d6191b620e3261bef6864990db6ce9806f66b7970fdff8617187bb9fffdff5ae4df3edbd5d35e5b4f09020db03eab1e031dda2fbe03d1792170a0f3009cee'
			var aesctr = CryptoJS.AES.encrypt(
				CryptoJS.enc.Hex.parse(p),
				CryptoJS.enc.Hex.parse('2b7e151628aed2a6abf7158809cf4f3c'),
				opts
			)
			test.assert.same(
				CryptoJS.enc.Base64.parse(aesctr.toString()).toString(CryptoJS.enc.Hex),
				c
			)
		},
		'Decrypt': function() {
			var p = '6bc1bee22e409f96e93d7e117393172aae2d8a571e03ac9c9eb76fac45af8e5130c81c46a35ce411e5fbc1191a0a52eff69f2445df4f9b17ad2b417be66c3710'
			var c = '874d6191b620e3261bef6864990db6ce9806f66b7970fdff8617187bb9fffdff5ae4df3edbd5d35e5b4f09020db03eab1e031dda2fbe03d1792170a0f3009cee'
			var aesctr = CryptoJS.AES.decrypt(
				CryptoJS.enc.Hex.parse(c).toString(CryptoJS.enc.Base64),
				CryptoJS.enc.Hex.parse('2b7e151628aed2a6abf7158809cf4f3c'),
				opts
			)
			test.assert.same(
				aesctr.toString(),
				p
			)
		}
	},
	
	'CTR-192': {
		'Encrypt': function() {
			var p = '6bc1bee22e409f96e93d7e117393172aae2d8a571e03ac9c9eb76fac45af8e5130c81c46a35ce411e5fbc1191a0a52eff69f2445df4f9b17ad2b417be66c3710'
			var c = '1abc932417521ca24f2b0459fe7e6e0b090339ec0aa6faefd5ccc2c6f4ce8e941e36b26bd1ebc670d1bd1d665620abf74f78a7f6d29809585a97daec58c6b050'
			var aesctr = CryptoJS.AES.encrypt(
				CryptoJS.enc.Hex.parse(p),
				CryptoJS.enc.Hex.parse('8e73b0f7da0e6452c810f32b809079e562f8ead2522c6b7b'),
				opts
			)
			test.assert.same(
				CryptoJS.enc.Base64.parse(aesctr.toString()).toString(CryptoJS.enc.Hex),
				c
			)
		},
		'Decrypt': function() {
			var p = '6bc1bee22e409f96e93d7e117393172aae2d8a571e03ac9c9eb76fac45af8e5130c81c46a35ce411e5fbc1191a0a52eff69f2445df4f9b17ad2b417be66c3710'
			var c = '1abc932417521ca24f2b0459fe7e6e0b090339ec0aa6faefd5ccc2c6f4ce8e941e36b26bd1ebc670d1bd1d665620abf74f78a7f6d29809585a97daec58c6b050'
			var aesctr = CryptoJS.AES.decrypt(
				CryptoJS.enc.Hex.parse(c).toString(CryptoJS.enc.Base64),
				CryptoJS.enc.Hex.parse('8e73b0f7da0e6452c810f32b809079e562f8ead2522c6b7b'),
				opts
			)
			test.assert.same(
				aesctr.toString(),
				p
			)
		}
	},
	
	'CTR-256': {
		'Encrypt': function() {
			var p = '6bc1bee22e409f96e93d7e117393172aae2d8a571e03ac9c9eb76fac45af8e5130c81c46a35ce411e5fbc1191a0a52eff69f2445df4f9b17ad2b417be66c3710'
			var c = '601ec313775789a5b7a7f504bbf3d228f443e3ca4d62b59aca84e990cacaf5c52b0930daa23de94ce87017ba2d84988ddfc9c58db67aada613c2dd08457941a6'
			var aesctr = CryptoJS.AES.encrypt(
				CryptoJS.enc.Hex.parse(p),
				CryptoJS.enc.Hex.parse('603deb1015ca71be2b73aef0857d77811f352c073b6108d72d9810a30914dff4'),
				opts
			)
			test.assert.same(
				CryptoJS.enc.Base64.parse(aesctr.toString()).toString(CryptoJS.enc.Hex),
				c
			)
		},
		'Decrypt': function() {
			var p = '6bc1bee22e409f96e93d7e117393172aae2d8a571e03ac9c9eb76fac45af8e5130c81c46a35ce411e5fbc1191a0a52eff69f2445df4f9b17ad2b417be66c3710'
			var c = '601ec313775789a5b7a7f504bbf3d228f443e3ca4d62b59aca84e990cacaf5c52b0930daa23de94ce87017ba2d84988ddfc9c58db67aada613c2dd08457941a6'
			var aesctr = CryptoJS.AES.decrypt(
				CryptoJS.enc.Hex.parse(c).toString(CryptoJS.enc.Base64),
				CryptoJS.enc.Hex.parse('603deb1015ca71be2b73aef0857d77811f352c073b6108d72d9810a30914dff4'),
				opts
			)
			test.assert.same(
				aesctr.toString(),
				p
			)
		}
	},
	
}

module.exports[path.basename(__filename)] = test