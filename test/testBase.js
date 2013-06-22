/** Test utilities */

var sinon = require('sinon'),
	chai = require('chai')

var assert = chai.assert,
	expect = chai.expect,
	should = chai.should()

/**
 * Short-hand version of assert.deepEqual
 *
 * @param actual Any the actual value
 * @param expected Any the expected value
 * @param message String the message show if assertion fails
 *
 * @type {Boolean}
 */
assert.same = function(actual, expected, message) {
	assert.deepEqual(actual, expected, message)
}

/**
 * Create a test object.
 *
 * This will setup a mocking sandbox for the test.
 */
var createTest = function(title) {
	var test = {
		beforeEach: function() {
			test.mocker = sinon.sandbox.create()
			test.assert = assert
			test.expect = expect
			test.should = should
		},
		afterEach: function() {
			test.mocker.restore()
		}
	}
	return test
}

module.exports = createTest