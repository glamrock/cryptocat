// Cryptocat XMPP functions and callbacks.

Cryptocat.xmpp = {}
Cryptocat.xmpp.currentStatus = 'online'
Cryptocat.xmpp.connection = null

// Default connection settings.
Cryptocat.xmpp.defaultDomain = 'crypto.cat'
Cryptocat.xmpp.defaultConferenceServer = 'conference.crypto.cat'
Cryptocat.xmpp.defaultBOSH = 'https://crypto.cat/http-bind'

Cryptocat.xmpp.domain = Cryptocat.xmpp.defaultDomain
Cryptocat.xmpp.conferenceServer = Cryptocat.xmpp.defaultConferenceServer
Cryptocat.xmpp.bosh = Cryptocat.xmpp.defaultBOSH

$(window).ready(function() {

// Registers a new user on the XMPP server, connects and join conversation.
Cryptocat.xmpp.connect = function(username, password) {
	Cryptocat.conversationName = Strophe.xmlescape($('#conversationName').val())
	Cryptocat.myNickname = Strophe.xmlescape($('#nickname').val())
	Cryptocat.xmpp.connection = new Strophe.Connection(Cryptocat.xmpp.bosh)
	$('#loginSubmit').attr('readonly', 'readonly')
	Cryptocat.xmpp.connection.register.connect(Cryptocat.xmpp.domain, function(status) {
		if (status=== Strophe.Status.REGISTER) {
			$('#loginInfo').text(Cryptocat.locale['loginMessage']['registering'])
			Cryptocat.xmpp.connection.register.fields.username = username
			Cryptocat.xmpp.connection.register.fields.password = password
			Cryptocat.xmpp.connection.register.submit()
		}
		else if (status === Strophe.Status.REGISTERED) {
			Cryptocat.xmpp.onRegistered(username, password)
		}
		else if (status=== Strophe.Status.SBMTFAIL) {
			Cryptocat.loginFail(Cryptocat.locale['loginMessage']['authenticationFailure'])
			$('#conversationName').select()
			$('#loginSubmit').removeAttr('readonly')
			Cryptocat.xmpp.connection = null
			return false
		}
	})
}

// Executed on succesfully completed XMPP registration.
Cryptocat.xmpp.onRegistered = function(username, password) {
	Cryptocat.xmpp.connection.reset()
	Cryptocat.xmpp.connection = new Strophe.Connection(Cryptocat.xmpp.bosh)
	Cryptocat.xmpp.connection.connect(username + '@' + Cryptocat.xmpp.domain, password, function(status) {
		if (status === Strophe.Status.CONNECTING) {
			$('#loginInfo').animate({'background-color': '#97CEEC'}, 200)
			$('#loginInfo').text(Cryptocat.locale['loginMessage']['connecting'])
		}
		else if (status === Strophe.Status.CONNECTED) {
			$('.conversationName').animate({'background-color': '#97CEEC'})
			Cryptocat.xmpp.connection.ibb.addIBBHandler(Cryptocat.otr.ibbHandler)
			/* jshint -W106 */
			Cryptocat.xmpp.connection.si_filetransfer.addFileHandler(Cryptocat.otr.fileHandler)
			/* jshint +W106 */
			Cryptocat.xmpp.connection.muc.join(
				Cryptocat.conversationName + '@' + Cryptocat.xmpp.conferenceServer,
				Cryptocat.myNickname,
				function(message) {
					if (Cryptocat.xmpp.onMessage(message)) { return true }
				},
				function (presence) {
					if (Cryptocat.xmpp.onPresence(presence)) { return true }
				}
			)
			if (Cryptocat.audioNotifications) {
				Cryptocat.sounds.keygenLoop.pause()
				Cryptocat.sounds.keygenEnd.play()
			}
			$('#fill').stop().animate({
				'width': '100%', 'opacity': '1'
			}, 250, 'linear', function() {
				window.setTimeout(function() {
					$('#dialogBoxClose').click()
				}, 200)
			})
			window.setTimeout(function() {
				Cryptocat.xmpp.onConnected(username, password)
			}, 400)
		}
		else if (status === Strophe.Status.CONNFAIL) {
			if (Cryptocat.loginError) {
				Cryptocat.xmpp.reconnect(username, password)
			}
		}
		else if (status === Strophe.Status.DISCONNECTED) {
			if (Cryptocat.loginError) {
				Cryptocat.xmpp.reconnect(username, password)
			}
		}
	})
}

// Executes on successfully completed XMPP connection.
Cryptocat.xmpp.onConnected = function() {
	clearInterval(CatFacts.interval)
	Cryptocat.storage.setItem('myNickname', Cryptocat.myNickname)
	$('#buddy-main-Conversation').attr('status', 'online')
	$('#loginInfo').text('✓')
	$('#info').fadeOut(200)
	$('#loginOptions,#languages,#customServerDialog,#version,#logoText,#loginInfo').fadeOut(200)
	$('#header').animate({'background-color': '#151520'})
	$('.logo').animate({'margin': '-11px 5px 0 0'})
	$('#loginForm').fadeOut(200, function() {
		$('#conversationInfo').fadeIn()
		Cryptocat.bindBuddyClick('main-Conversation')
		$('#buddy-main-Conversation').click()
		$('#conversationWrapper').fadeIn()
		$('#optionButtons').fadeIn()
		$('#footer').delay(200).animate({'height': 60}, function() {
			$('#userInput').fadeIn(200, function() {
				$('#userInputText').focus()
			})
		})
		$('#buddyWrapper').slideDown()
	})
	Cryptocat.loginError = true
	document.title = Cryptocat.myNickname + '@' + Cryptocat.conversationName
}

// Reconnect to the same chatroom, on accidental connection loss.
Cryptocat.xmpp.reconnect = function(username, password) {
	multiParty.reset()
	Cryptocat.xmpp.connection.reset()
	Cryptocat.xmpp.connection = new Strophe.Connection(Cryptocat.xmpp.bosh)
	Cryptocat.xmpp.connection.connect(username + '@' + Cryptocat.xmpp.domain, password, function(status) {
		if (status === Strophe.Status.CONNECTING) {
			$('.conversationName').animate({'background-color': '#F00'})
		}
		else if (status === Strophe.Status.CONNECTED) {
			$('.conversationName').animate({'background-color': '#97CEEC'})
			Cryptocat.xmpp.connection.ibb.addIBBHandler(Cryptocat.otr.ibbHandler)
			/* jshint -W106 */
			Cryptocat.xmpp.connection.si_filetransfer.addFileHandler(Cryptocat.otr.fileHandler)
			/* jshint +W106 */
			Cryptocat.xmpp.connection.muc.join(
				Cryptocat.conversationName + '@' + Cryptocat.xmpp.conferenceServer,
				Cryptocat.myNickname
			)
			if (Cryptocat.audioNotifications) {
				Cryptocat.sounds.keygenLoop.pause()
				Cryptocat.sounds.keygenEnd.play()
			}
		}
		else if ((status === Strophe.Status.CONNFAIL) || (status === Strophe.Status.DISCONNECTED)) {
			if (Cryptocat.loginError) {
				window.setTimeout(function() {
				Cryptocat.xmpp.reconnect(username, password)
				}, 5000)
			}
		}
	})
}

// Handle incoming messages from the XMPP server.
Cryptocat.xmpp.onMessage = function(message) {
	var nickname = cleanNickname($(message).attr('from'))
	var body = $(message).find('body').text()
	var type = $(message).attr('type')
	// If archived message, ignore.
	if ($(message).find('delay').length !== 0) {
		return true
	}
	//If message is from me, ignore.
	if (nickname === Cryptocat.myNickname) {
		return true
	}
	// If message is from someone not on buddy list, ignore.
	if (!$('#buddy-' + nickname).length) {
		return true
	}
	// Check if message has a 'composing' notification.
	if ($(message).find('composing').length && !body.length) {
		var conversation
		if (type === 'groupchat') {
			conversation = 'main-Conversation'
		}
		else if (type === 'chat') {
		conversation = nickname
	}
		Cryptocat.addToConversation('', nickname, conversation, 'composing')
		return true
	}
	// Check if message has an 'active' or 'paused' (stopped writing) notification.
	if ($(message).find('active').length || $(message).find('paused').length) {
		if ($('#composing-' + nickname).length) {
			$('#composing-' + nickname).parent().fadeOut(100).remove()
		}
	}
	// Check if message is a group chat message.
	if (type === 'groupchat') {
		if(!body.length) { return true }
		body = multiParty.receiveMessage(nickname, Cryptocat.myNickname, body)
		if (typeof(body) === 'string') {
			Cryptocat.addToConversation(body, nickname, 'main-Conversation', 'message')
		}
	}
	// Check ifthis is a private OTR message.
	else if (type === 'chat') {
		Cryptocat.otr.keys[nickname].receiveMsg(body)
	}
	return true
}

// Handle incoming presence updates from the XMPP server.
Cryptocat.xmpp.onPresence = function(presence) {
	var nickname = cleanNickname($(presence).attr('from'))
	// If invalid nickname, do not process
	if ($(presence).attr('type') === 'error') {
		if ($(presence).find('error').attr('code') === '409') {
			// Delay logout in order to avoid race condition with window animation
			window.setTimeout(function() {
				Cryptocat.logout()
				Cryptocat.loginFail(Cryptocat.locale['loginMessage']['nicknameInUse'])
			}, 3000)
			return false
		}
		return true
	}
	// Ignore if presence status is coming from myself
	if (nickname === Cryptocat.myNickname) {
		return true
	}
	// Detect nickname change (which may be doneby non-Cryptocat XMPP clients)
	if ($(presence).find('status').attr('code') === '303') {
		var newNickname = cleanNickname('/' + $(presence).find('item').attr('nick'))
		Cryptocat.changeNickname(nickname, newNickname)
		return true
	}
	// Add to otr keys if necessary
	if (nickname !== 'main-Conversation' && !Cryptocat.otr.keys.hasOwnProperty(nickname)) {
		Cryptocat.otr.add(nickname)
	}
	var status, color, placement
	// Detect buddy going offline.
	if ($(presence).attr('type') === 'unavailable') {
		Cryptocat.removeBuddy(nickname)
		return true
	}
	// Createbuddy element if buddy is new.
	else if (!$('#buddy-' + nickname).length) {
		Cryptocat.addBuddy(nickname)
	}
	// Handle buddy status change to 'available'.
	else if ($(presence).find('show').text() === '' || $(presence).find('show').text() === 'chat') {
		if ($('#buddy-' + nickname).attr('status') !== 'online') {
			status = 'online'
			placement = '#buddiesOnline'
		}
	}
	// Handlebuddy status change to 'away'.
	else if ($('#buddy-' + nickname).attr('status') !== 'away') {
		status = 'away'
		placement = '#buddiesAway'
	}
	// Perform status change.
	$('#buddy-' + nickname).attr('status', status)
	if (placement) {
		$('#buddy-' + nickname).animate({'color': color }, function() {
			if (Cryptocat.currentConversation !== nickname) {
				$(this).insertAfter(placement).slideDown(200)
			}
		})
	}
	return true
}

// Send your own multiparty public key to `nickname`, via XMPP-MUC.
Cryptocat.xmpp.sendPublicKey = function(nickname) {
	Cryptocat.xmpp.connection.muc.message(
		Cryptocat.conversationName + '@' + Cryptocat.xmpp.conferenceServer,
		null, multiParty.sendPublicKey(nickname), null, 'groupchat', 'active'
	)
}

// Send your current status to the XMPP server.
Cryptocat.xmpp.sendStatus = function() {
	if (Cryptocat.xmpp.currentStatus === 'away') {
		Cryptocat.xmpp.connection.muc.setStatus(Cryptocat.conversationName + '@'
		+ Cryptocat.xmpp.conferenceServer, Cryptocat.myNickname, 'away', 'away')
	}
	else {
		Cryptocat.xmpp.connection.muc.setStatus(Cryptocat.conversationName + '@'
		+ Cryptocat.xmpp.conferenceServer, Cryptocat.myNickname, '', '')
	}
}

// Clean nickname so that it's safe to use.
function cleanNickname(nickname) {
	var clean = nickname.match(/\/([\s\S]+)/)
	if (clean) { clean = Strophe.xmlescape(clean[1]) }
	else { return false }
	if (clean.match(/\W/)) { return false }
	return clean
}

})