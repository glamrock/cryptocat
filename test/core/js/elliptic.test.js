var path = require('path'),
	test = require('../../testBase')()

var Curve25519 = require('../../../src/core/js/lib/elliptic'),
	BigInt = require('../../../src/core/js/lib/bigint')

// basePoint is the generator of the elliptic curve group
var basePoint = BigInt.str2bigInt('9', 10)

test['Curve25519'] = {

	'p25519': {
		'this should print the same thing twice': function () {
			var priv1 = BigInt.randBigInt(256, 0)
			var priv2 = BigInt.randBigInt(256, 0)
			var pub1 = Curve25519.scalarMult(priv1, basePoint)
			var pub2 = Curve25519.scalarMult(priv2, basePoint)
			test.assert.ok(pub1)
			test.assert.ok(pub2)
			test.assert.same(
				Curve25519.scalarMult(priv1, pub2),
				Curve25519.scalarMult(priv2, pub1)
			)
		}
	}

}

module.exports[path.basename(__filename)] = test