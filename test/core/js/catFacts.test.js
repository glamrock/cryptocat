var path = require('path'),
	test = require('../../testBase')()

var CatFacts = require('../../../src/core/js/etc/catFacts')

test['Cat Facts'] = {

	'Get Cat Fact': function() {
		function factLength(fact) {
			if (fact.length >= 8) {
				return true
			}
			return false
		}
		test.assert.same(
			typeof(CatFacts.getFact()),
			'string'
		)
		test.assert.same(
			factLength(CatFacts.getFact()),
			true
		)
		test.assert.same(
			CatFacts.getFact() == CatFacts.getFact(),
			false
		)
	},

}

module.exports[path.basename(__filename)] = test