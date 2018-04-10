var path = require('path'),
	test = require('../../testBase')()

var Mustache = require('../../../src/core/js/lib/mustache')

test['mustache.js'] = {

	'Rendering': {
		'Escaped': function() {
			var template = '<h1>{{message}}</h1>'
			test.assert.same(
				Mustache.render(template, { message: '<b>abc</b>' }),
				'<h1>&lt;b&gt;abc&lt;&#x2F;b&gt;</h1>'
			)
		},
		'Unescaped': function() {
			var template = '<h1>{{&message}}</h1>'
			test.assert.same(
				Mustache.render(template, { message: '<b>abc</b>' }),
				'<h1><b>abc</b></h1>'
			)
		}
	},

}

module.exports[path.basename(__filename)] = test