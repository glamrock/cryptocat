Cryptocat.otr = {}
Cryptocat.otr.keys = {}
Cryptocat.otr.fileKeys = {}

Cryptocat.otr.fileSize = 5120 // Maximum encrypted file sharing size, in kilobytes.
Cryptocat.otr.chunkSize = 64511 // Size in which file chunks are split, in bytes.

// Cryptocat OTR functions and callbacks.

// OTR functions:
// Handle incoming messages.
Cryptocat.otr.onIncoming = function(buddy) {
	return function(msg, encrypted) {
		// drop unencrypted messages
		if (encrypted) {
			Cryptocat.addToConversation(msg, buddy, buddy, 'message')
			if (Cryptocat.currentConversation !== buddy) {
				Cryptocat.messagePreview(msg, buddy)
			}
		}
	}
}

// Handle outgoing messages.
Cryptocat.otr.onOutgoing = function(buddy) {
	return function(message) {
		Cryptocat.xmpp.connection.muc.message(
			Cryptocat.conversationName + '@' + Cryptocat.xmpp.conferenceServer,
			buddy, message, null, 'chat', 'active'
		)
	}
}

// Receive an SMP question
Cryptocat.otr.onSMPQuestion = function(nickname, question) {
	$('#dialogBoxClose').click()
	var answer = false
	window.setTimeout(function(nickname) {
		Cryptocat.dialogBox(Mustache.render(Cryptocat.templates.authRequest, {
			authenticate: Cryptocat.locale['chatWindow']['authenticate'],
			authRequest: Cryptocat.locale['chatWindow']['authRequest']
				.replace('(NICKNAME)', nickname),
			answerMustMatch: Cryptocat.locale['chatWindow']['answerMustMatch']
				.replace('(NICKNAME)', nickname),
			question: question,
			answer: Cryptocat.locale['chatWindow']['answer']
		}), 240, true, function() {
			$('#authReplySubmit').unbind('click').bind('click', function(e) {
				e.preventDefault()
				answer = $('#authReply').val().toLowerCase()
					.replace(/(\s|\.|\,|\'|\"|\;|\?|\!)/, '')
				Cryptocat.otr.keys[nickname].smpSecret(answer)
				$('#dialogBoxClose').click()
			})
		}, function() {
			if (!answer) {
				Cryptocat.otr.keys[nickname].smpSecret(
					Cryptocat.random.encodedBytes(16, CryptoJS.enc.Hex)
				)
			}
		})
	}, 500, nickname)
}

// Add a new OTR key for a new conversation participant
Cryptocat.otr.add = function(buddy) {
	Cryptocat.otr.keys[buddy] = new OTR({
		priv: Cryptocat.otr.myKey,
		smw: {
			path: 'js/workers/smp.js',
			seed: Cryptocat.random.generateSeed
		}
	})
	Cryptocat.otr.keys[buddy].REQUIRE_ENCRYPTION = true
	Cryptocat.otr.keys[buddy].on('ui' , Cryptocat.otr.onIncoming(buddy))
	Cryptocat.otr.keys[buddy].on('io' , Cryptocat.otr.onOutgoing(buddy))
	Cryptocat.otr.keys[buddy].on('smp', Cryptocat.otr.onSMPAnswer(buddy))
	Cryptocat.otr.keys[buddy].on('status', (function(buddy) {
		return function(state) {
			if (Cryptocat.otr.keys[buddy].genFingerCb
			&& state === OTR.CONST.STATUS_AKE_SUCCESS) {
				Cryptocat.closeGenerateFingerprints(buddy, Cryptocat.otr.keys[buddy].genFingerCb)
				;delete Cryptocat.otr.keys[buddy].genFingerCb
				Cryptocat.authenticatedUsers.splice(Cryptocat.authenticatedUsers.indexOf(buddy), 1)
			}
		}
	} (buddy)))
	Cryptocat.otr.keys[buddy].on('file', (function (buddy) {
		return function(type, key, filename) {
			key = CryptoJS.SHA512(CryptoJS.enc.Latin1.parse(key))
			key = key.toString(CryptoJS.enc.Latin1)
			if (!Cryptocat.otr.fileKeys[buddy]) {
				Cryptocat.otr.fileKeys[buddy] = {}
			}
			Cryptocat.otr.fileKeys[buddy][filename] = [
				key.substring(0, 32), key.substring(32)
			]
		}
	}) (buddy))
}

// Handle SMP callback
Cryptocat.otr.onSMPAnswer = function(nickname) {
	return function(type, data, act) {
		if (type === 'question') {
			Cryptocat.otr.onSMPQuestion(nickname, data)
		}
		if ((type === 'trust') && (act === 'asked')) {
			if (data) {
				Cryptocat.authenticatedUsers.push(nickname)
				if ($('#authInfo').length) {
					Cryptocat.showAuthenticated(nickname, 200)
					window.setTimeout(function() {
						$('#dialogBox').animate({'height': 250})
					}, 200)
				}
			}
			else if ($('#authInfo').length) {
				$('#authSubmit').val(Cryptocat.locale['chatWindow']['failed'])
					.animate({'background-color': '#F00'})
			}
		}
		if (type === 'abort') {
			$('#authSubmit').val(Cryptocat.locale['chatWindow']['failed'])
				.animate({'background-color': '#F00'})
		}
	}
}