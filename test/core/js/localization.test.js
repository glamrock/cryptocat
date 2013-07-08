Cryptocat = function () {}

require('../../../src/core/js/etc/cryptocatLocalization')

var assert = require('assert')
describe('Localization module', function() {
		it('Should create language object from language tokens', function() {
			var testStr = 'SPB'
			var lang = new Array(101).join('ss').split('') // 100 elements array
			lang[2] = testStr

			var langObj = Cryptocat.Language.buildObject('ru', lang)

			assert.equal(langObj.loginWindow.introHeader, testStr)
		})

	var validServerResponse = 'ltr                                                                                             \n' +
		'"Helvetica Neue", Helvetica, Arial, Verdana                                                                           \n' +
		'Private Conversations for Everyone.                                                                                   \n' +
		'Welcome to Cryptocat. Here are some helpful tips:                                                                     \n' +
		'Blog                                                                                                                  \n' +
		'Custom server                                                                                                         \n' +
		'Reset                                                                                                                 \n' +
		'conversation name                                                                                                     \n' +
		'nickname                                                                                                              \n' +
		'connect                                                                                                               \n' +
		'Enter a name for your conversation and share it with people you\'d like to talk to, or join lobby to meet new people! \n' +
		'Enter the name of a conversation to join.                                                                             \n' +
		'Please enter a conversation name.                                                                                     \n' +
		'Conversation name must be alphanumeric.                                                                               \n' +
		'Please enter a nickname.                                                                                              \n' +
		'Nickname must be alphanumeric.                                                                                        \n' +
		'Nickname in use.                                                                                                      \n' +
		'Authentication failure.                                                                                               \n' +
		'Connection failed.                                                                                                    \n' +
		'Thank you for using Cryptocat.                                                                                        \n' +
		'Registering...                                                                                                        \n' +
		'Connecting...                                                                                                         \n' +
		'Connected.                                                                                                            \n' +
		'Please type on your keyboard as randomly as possible for a few seconds.                                               \n' +
		'Generating encryption keys...                                                                                         \n' +
		'Group conversation. Click on a user for private chat.                                                                 \n' +
		'OTR fingerprint (for private conversations):                                                                          \n' +
		'Group conversation fingerprint:                                                                                       \n' +
		'Reset my encryption keys                                                                                              \n' +
		'Resetting your encryption keys will disconnect you. Your fingerprints will also change.                               \n' +
		'Continue                                                                                                              \n' +
		'Status: Available                                                                                                     \n' +
		'Status: Away                                                                                                          \n' +
		'My Info                                                                                                               \n' +
		'Desktop Notifications On                                                                                              \n' +
		'Desktop Notifications Off                                                                                             \n' +
		'Audio Notifications On                                                                                                \n' +
		'Audio Notifications Off                                                                                               \n' +
		'Remember my nickname                                                                                                  \n' +
		'Don\'t remember my nickname                                                                                           \n' +
		'Logout                                                                                                                \n' +
		'Display Info                                                                                                          \n' +
		'Send encrypted file                                                                                                   \n' +
		'view image                                                                                                            \n' +
		'download file                                                                                                         \n' +
		'Conversation                                                                                                          \n' +
		'Only ZIP files and images are accepted. Maximum file size: (SIZE) MB.                                                 \n' +
		'Error: Please make sure your file is a ZIP file or an image.                                                          \n' +
		'Error: File cannot be larger than (SIZE) MB.                                                                          \n' +
		'Start video chat                                                                                                      \n' +
		'End video chat                                                                                                        \n' +
		'(NICKNAME) would like to start a video chat with you.                                                                 \n' +
		'Cancel                                                                                                                \n' +
		'Block                                                                                                                 \n' +
		'Unblock'

	var parsedResponse = (function() {
		var parsedTokens = []
		var tokens = validServerResponse.split('\n')
		for(var i = 0; i < tokens.length; ++i) {
			parsedTokens.push(tokens[i].trim())
		}
		return parsedTokens
	})()

	it('Should fill all keys on valid server response', function() {
		var langObj = Cryptocat.Language.buildObject('en', parsedResponse)
		assert.equal(langObj.chatWindow.cancel, 'Cancel')
	})

	it('Should decode cryptocat filesize units', function() {
		Cryptocat.fileSize = 10
		var langObj = Cryptocat.Language.buildObject('en', parsedResponse)
		assert.ok(langObj.chatWindow.fileTransferInfo.indexOf('0.009765625') > 0)
	})

})
