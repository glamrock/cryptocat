/*
-------------------
GLOBAL VARIABLES
-------------------
*/

if (typeof Cryptocat === 'undefined') {
	Cryptocat = function() {}
}
Cryptocat.version = '2.1.15' // Version number
Cryptocat.fileSize = 5120 // Maximum encrypted file sharing size, in kilobytes.
Cryptocat.chunkSize = 64511 // Size in which file chunks are split, in bytes.

// Default connection settings.
Cryptocat.defaultDomain = 'crypto.cat'
Cryptocat.defaultConferenceServer = 'conference.crypto.cat'
Cryptocat.defaultBOSH = 'https://crypto.cat/http-bind'

Cryptocat.domain = Cryptocat.defaultDomain
Cryptocat.conferenceServer = Cryptocat.defaultConferenceServer
Cryptocat.bosh = Cryptocat.defaultBOSH

Cryptocat.fileKeys = {}
Cryptocat.ignoredUsers = []
Cryptocat.authenticatedUsers = []
Cryptocat.connection = null
Cryptocat.conversationName = null
Cryptocat.myNickname = null

/*
-------------------
END GLOBAL SCOPE
-------------------
*/

if (typeof(window) !== 'undefined') {
$(window).ready(function() {

/* Initialization */
var otrKeys = {}
var conversations = {}
var buddyList = []
var currentStatus = 'online'
var newMessages = 0
var isFocused = true
var paused = false
var currentConversation
var audioNotifications
var desktopNotifications
var showNotifications
var loginError
var myKey
var catFactInterval

var sounds = {
	'keygenStart': (new Audio('snd/keygenStart.mp3')),
	'keygenLoop': (new Audio('snd/keygenLoop.mp3')),
	'keygenEnd': (new Audio('snd/keygenEnd.mp3')),
	'userJoin': (new Audio('snd/userJoin.mp3')),
	'userLeave': (new Audio('snd/userLeave.mp3')),
	'msgGet'	: (new Audio('snd/msgGet.mp3'))
}

// Set version number in UI.
$('#version').text(Cryptocat.version)

// Load favicon notification settings.
Tinycon.setOptions({
	colour: '#FFFFFF',
	background: '#76BDE5'
})

// Seed RNG.
Cryptocat.setSeed(Cryptocat.generateSeed())

// Outputs the current hh:mm.
// If `seconds = true`, outputs hh:mm:ss.
function currentTime(seconds) {
	var date = new Date()
	var time = []
	time.push(date.getHours().toString())
	time.push(date.getMinutes().toString())
	if (seconds) { time.push(date.getSeconds().toString()) }
	for (var just in time) {
		if (time[just].length === 1) {
			time[just] = '0' + time[just]
		}
	}
	return time.join(':')
}

// Initiates a conversation. Internal use.
function initiateConversation(conversation) {
	if (!conversations.hasOwnProperty(conversation)) {
		conversations[conversation] = ''
	}
}

// OTR functions:
// Handle incoming messages.
var otrIncomingCallback = function(buddy) {
	return function(msg, encrypted) {
		// drop unencrypted messages
		if (encrypted) {
			Cryptocat.addToConversation(msg, buddy, buddy, 'message')
			if (currentConversation !== buddy) {
				messagePreview(msg, buddy)
			}
		}
	}
}
// Handle outgoing messages.
var otrOutgoingCallback = function(buddy) {
	return function(message) {
		Cryptocat.connection.muc.message(
			Cryptocat.conversationName + '@' + Cryptocat.conferenceServer,
			buddy, message, null, 'chat', 'active'
		)
	}
}

// Show a preview for a received message from a buddy.
// Message previews will not overlap and are removed after 5 seconds.
function messagePreview(message, nickname) {
	if (!$('#buddy-' + nickname).attr('data-utip')) {
		if (message.length > 15) {
			message = message.substring(0, 15) + '..'
		}
		$('#buddy-' + nickname).attr('data-utip', Strophe.xmlescape(message))
		$('#buddy-' + nickname).attr('data-utip-gravity', 'sw')
		$('#buddy-' + nickname).mouseenter()
		window.setTimeout(function() {
			$('#buddy-' + nickname).mouseleave()
			$('#buddy-' + nickname).removeAttr('data-utip')
		}, 0x1337)
	}
}

// Modify the "Display Info" dialog to show that a user is authenticated.
// `speed` is animation speed.
function showAuthenticated(nickname, speed) {
	$('#authInfo').children().not('#authVerified')
		.fadeOut(speed, function() { $(this).remove() })
	window.setTimeout(function() {
		$('#authInfo').animate({
			'height': 44,
			'background-color': '#97CEEC',
			'margin-top': '15px'
		}, speed, function() {
			$('#authVerified').fadeIn(speed)
		})
	}, speed)
}

// Handle SMP callback
var smpCallback = function(nickname) {
	return function(type, data, act) {
		switch(type) {
			case 'question':
				smpQuestion(nickname, data)
				break
			case 'trust':
				if (act === 'asked') {
					if (data) {
						Cryptocat.authenticatedUsers.push(nickname)
						if ($('#authInfo').length) {
							showAuthenticated(nickname, 200)
							window.setTimeout(function() {
								$('#dialogBox').animate({'height': 250})
							}, 200)
						}
					}
					else {
						if ($('#authInfo').length) {
							$('#authSubmit').val(Cryptocat.Locale['chatWindow']['failed'])
								.animate({'background-color': '#F00'})
						}
					}
				} else if (act === 'answered') {
					// maybe notify of the results?
					/* jshint noempty: false */
				}
				break
			case 'abort':
				// abort! abort!
				break
		}
	}
}

// Creates a template for the conversation info bar at the top of each conversation.
function buildConversationInfo(conversation) {
	$('.conversationName').text(Cryptocat.myNickname + '@' + Cryptocat.conversationName)
	if (conversation === 'main-Conversation') {
		$('#groupConversation').text(Cryptocat.Locale['chatWindow']['groupConversation'])
	}
	else {
		$('#groupConversation').text(conversation)
	}
}

// Switches the currently active conversation to `buddy'
function switchConversation(buddy) {
	setTimeout(function () {
		$('#buddy-' + buddy).addClass('currentConversation')
	}, 1)

	if (buddy !== 'main-Conversation') {
		$('#buddy-' + buddy).css('background-image', 'none')
	}
	buildConversationInfo(currentConversation)
	$('#conversationWindow').html(conversations[currentConversation])
	bindTimestamps()
	scrollDownConversation(0, false)
	$('#userInputText').focus()
	if (($('#buddy-' + buddy).prev().attr('id') === 'buddiesOnline')
		|| (($('#buddy-' + buddy).prev().attr('id') === 'buddiesAway')
		&& $('#buddiesOnline').next().attr('id') === 'buddiesAway')) {
		$('#buddy-' + buddy).insertAfter('#currentConversation')
	}
	else {
		$('#buddy-' + buddy).insertAfter('#currentConversation').slideDown(100)
	}
	// Clean up finished conversations.
	$('#buddyList div').each(function() {
		if ($(this).attr('id') !== ('buddy-' + currentConversation)) {
			var thisBuddy = $(this)
			setTimeout(function () {
				thisBuddy.removeClass('currentConversation')
			}, 1)
			if (($(this).css('background-image') === 'none')
				&& ($(this).attr('status') === 'offline')) {
				$(this).slideUp(500, function() { $('#' + buddy).remove() })
			}
		}
	})
}

// Handles login failures.
function loginFail(message) {
	$('#loginInfo').text(message)
	$('#bubble').animate({'left': '+=5px'}, 130)
		.animate({'left': '-=10px'}, 130)
		.animate({'left': '+=5px'}, 130)
	$('#loginInfo').animate({'background-color': '#E93028'}, 200)
}

// Simply shortens a string `string` to length `length.
// Adds '..' to delineate that string was shortened.
function shortenString(string, length) {
	if (string.length > length) {
		return string.substring(0, (length - 2)) + '..'
	}
	return string
}

// Clean nickname so that it's safe to use.
function cleanNickname(nickname) {
	var clean = nickname.match(/\/([\s\S]+)/)
	if (clean) { clean = Strophe.xmlescape(clean[1]) }
	else { return false }
	if (clean.match(/\W/)) { return false }
	return clean
}

// Get a fingerprint, formatted for readability.
function getFingerprint(buddy, OTR) {
	var fingerprint
	if (OTR) {
		if (buddy === Cryptocat.myNickname) {
			fingerprint = myKey.fingerprint()
		}
		else {
			/* jshint -W106 */
			fingerprint = otrKeys[buddy].their_priv_pk.fingerprint()
			/* jshint +W106 */
		}
	}
	else {
		if (buddy === Cryptocat.myNickname) {
			fingerprint = multiParty.genFingerprint()
		}
		else {
			fingerprint = multiParty.genFingerprint(buddy)
		}
	}
	var formatted = ''
	for (var i in fingerprint) {
		if (fingerprint.hasOwnProperty(i)) {
			if ((i !== 0) && (i % 8) === 0) {
				formatted += ' '
			}
			formatted += fingerprint[i]
		}
	}
	return formatted.toUpperCase()
}

// Convert message URLs to links. Used internally.
function addLinks(message) {
	var i, l, sanitize
	var URLs = message.match(/((http(s?)\:\/\/){1}\S+)/gi)
	if (URLs) {
		for (i in URLs) {
			if (URLs.hasOwnProperty(i)) {
				sanitize = URLs[i].split('')
				for (l in sanitize) {
					if (sanitize.hasOwnProperty(l) &&
						!sanitize[l].match(/\w|\d|\:|\/|\?|\=|\#|\+|\,|\.|\&|\;|\%/)) {
						sanitize[l] = encodeURIComponent(sanitize[l])
					}
				}
				sanitize = sanitize.join('')
				var url = sanitize.replace(':', '&colon;')
				if (navigator.userAgent === 'Chrome (Mac app)') {
					message = message.replace(
						sanitize, '<a href="' + url + '">' + url + '</a>'
					)
				}
				else {
					message = message.replace(
						sanitize, '<a href="' + url + '" target="_blank">' + url + '</a>'
					)
				}
			}
		}
	}
	return message
}

// Convert text emoticons to graphical emoticons.
function addEmoticons(message) {
	return message
		.replace(/(\s|^)(:|(=))-?3(?=(\s|$))/gi, ' <div class="emoticon eCat">$&</div> ')
		.replace(/(\s|^)(:|(=))-?\&apos;\((?=(\s|$))/gi, ' <div class="emoticon eCry">$&</div> ')
		.replace(/(\s|^)(:|(=))-?o(?=(\s|$))/gi, ' <div class="emoticon eGasp">$&</div> ')
		.replace(/(\s|^)(:|(=))-?D(?=(\s|$))/gi, ' <div class="emoticon eGrin">$&</div> ')
		.replace(/(\s|^)(:|(=))-?\((?=(\s|$))/gi, ' <div class="emoticon eSad">$&</div> ')
		.replace(/(\s|^)(:|(=))-?\)(?=(\s|$))/gi, ' <div class="emoticon eSmile">$&</div> ')
		.replace(/(\s|^)-_-(?=(\s|$))/gi, ' <div class="emoticon eSquint">$&</div> ')
		.replace(/(\s|^)(:|(=))-?p(?=(\s|$))/gi, ' <div class="emoticon eTongue">$&</div> ')
		.replace(/(\s|^)(:|(=))-?(\/|s)(?=(\s|$))/gi, ' <div class="emoticon eUnsure">$&</div> ')
		.replace(/(\s|^);-?\)(?=(\s|$))/gi, ' <div class="emoticon eWink">$&</div> ')
		.replace(/(\s|^);-?\p(?=(\s|$))/gi, ' <div class="emoticon eWinkTongue">$&</div> ')
		.replace(/(\s|^)\^(_|\.)?\^(?=(\s|$))/gi, ' <div class="emoticon eHappy">$&</div> ')
		.replace(/(\s|^)(:|(=))-?x\b(?=(\s|$))/gi, ' <div class="emoticon eShut">$&</div> ')
		.replace(/(\s|^)\&lt\;3\b(?=(\s|$))/g, ' <span class="monospace">&#9829;</span> ')
}

// Send your own multiparty public key to `nickname`, via XMPP-MUC.
Cryptocat.sendPublicKey = function(nickname) {
	Cryptocat.connection.muc.message(
		Cryptocat.conversationName + '@' + Cryptocat.conferenceServer,
		null, multiParty.sendPublicKey(nickname), null, 'groupchat', 'active'
	)
}

// Update a file transfer progress bar.
Cryptocat.updateFileProgressBar = function(file, chunk, size, recipient) {
	var progress = (chunk * 100) / (Math.ceil(size / Cryptocat.chunkSize))
	if (progress > 100) { progress = 100 }
	$('[file=' + file + '] .fileProgressBarFill').animate({'width': progress + '%'})
	var conversationBuffer = $(conversations[recipient])
	conversationBuffer.find('[file=' + file + '] .fileProgressBarFill').width(progress + '%')
	conversations[recipient] = $('<div>').append($(conversationBuffer).clone()).html()
}

// Convert Data blob/url to downloadable file, replacing the progress bar.
Cryptocat.addFile = function(url, file, conversation, filename) {
	var conversationBuffer = $(conversations[conversation])
	var fileLinkString = 'fileLink'
	if (navigator.userAgent === 'Chrome (Mac app)') {
		fileLinkString += 'Mac'
	}
	var fileLink = Mustache.render(Cryptocat.templates[fileLinkString], {
		url: url,
		filename: filename,
		downloadFile: Cryptocat.Locale['chatWindow']['downloadFile']
	})
	$('[file=' + file + ']').replaceWith(fileLink)
	conversationBuffer.find('[file=' + file + ']').replaceWith(fileLink)
	conversations[conversation] = $('<div>').append($(conversationBuffer).clone()).html()
}

// Signal a file transfer error in the UI.
Cryptocat.fileTransferError = function(sid) {
	$('[file=' + sid + ']').animate({
		'borderColor': '#F00'
	})
	$('[file=' + sid + ']').find('.fileProgressBarFill').animate({
		'background-color': '#F00'
	})
}

// Add a `message` from `nickname` to the `conversation` display and log.
// `type` can be 'file', 'composing', 'message', 'warning' or 'missingRecipients'.
// In case `type` === 'missingRecipients', `message` becomes array of missing recipients.
Cryptocat.addToConversation = function(message, nickname, conversation, type) {
	if (Cryptocat.ignoredUsers.indexOf(nickname) >= 0) { return false }
	initiateConversation(conversation)
	var lineDecoration = 2
	if (nickname === Cryptocat.myNickname) { lineDecoration = 1 }
	if (type === 'file') {
		if (!message.length) { return false }
		message = Mustache.render(Cryptocat.templates.file, { message: message })
		if (nickname !== Cryptocat.myNickname) {
			if (audioNotifications) { sounds.msgGet.play() }
			desktopNotification(
				'img/keygen.gif', nickname + ' @ ' + Cryptocat.conversationName, '', 0x1337
			)
		}
	}
	else if (type === 'composing') {
		if ($('#composing-' + nickname).length) { return true }
		message = Mustache.render(Cryptocat.templates.composing, { id: 'composing-' + nickname })
	}
	else if (type === 'message') {
		if (!message.length) { return false }
		message = Strophe.xmlescape(message)
		message = addLinks(message)
		message = addEmoticons(message)
		if (message.match(Cryptocat.myNickname)) { lineDecoration = 3 }
		if (nickname !== Cryptocat.myNickname) {
			if (audioNotifications) { sounds.msgGet.play() }
			desktopNotification(
				'img/keygen.gif', nickname + ' @ ' + Cryptocat.conversationName, '', 0x1337
			)
		}
	}
	else if (type === 'warning') {
		if (!message.length) { return false }
		message = Strophe.xmlescape(message)
		lineDecoration = 4
		if (nickname !== Cryptocat.myNickname) {
			if (audioNotifications) { sounds.msgGet.play() }
			desktopNotification(
				'img/keygen.gif', nickname + ' @ ' + Cryptocat.conversationName, '', 0x1337
			)
		}
	}
	else if (type === 'missingRecipients') {
		if (!message.length) { return false }
		message = Strophe.xmlescape(message.join(', '))
		message = Mustache.render(Cryptocat.templates.missingRecipients, {
			text: 'Warning: this message was not sent to ' + message // Replace with localization string!
		})
		conversations[conversation] += message
		if (conversation === currentConversation) {
			$('#conversationWindow').append(message)
			$('.missingRecipients').last().animate({'top': '0', 'opacity': '1'}, 100)
			scrollDownConversation(400, true)
		}
		return true
	}
	message = message.replace(/:/g, '&#58;')
	message = Mustache.render(Cryptocat.templates.message, {
		lineDecoration: lineDecoration,
		nickname: shortenString(nickname, 16),
		currentTime: currentTime(true),
		message: message
	})
	if (type !== 'composing') {
		conversations[conversation] += message
	}
	if (conversation === currentConversation) {
		$('#conversationWindow').append(message)
		$('.line' + lineDecoration).last().animate({'top': '0', 'opacity': '1'}, 100)
		bindTimestamps($('.line' + lineDecoration).last().find('.sender'))
		scrollDownConversation(400, true)
	}
	else if (type !== 'composing') {
		$('#buddy-' + conversation).css('background-image', 'url("img/newMessage.png")')
		$('#buddy-' + conversation).addClass('newMessage')
	}
}

// Bind timestamps to show when message sender is hovered.
function bindTimestamps(senderElement) {
	if (!senderElement) {
		senderElement = $('.sender')
	}
	senderElement.unbind('mouseenter,mouseleave')
	senderElement.mouseenter(function() {
		$(this).text($(this).attr('timestamp'))
	})
	senderElement.mouseleave(function() {
		$(this).text($(this).attr('sender'))
	})
}

function desktopNotification(image, title, body, timeout) {
	newMessages++
	Tinycon.setBubble(newMessages)
	if (!desktopNotifications || isFocused) { return false }
	// Mac
	if (navigator.userAgent === 'Chrome (Mac app)') {
		var iframe = document.createElement('IFRAME')
		iframe.setAttribute('src', 'js-call:' + title + ':' + body)
		document.documentElement.appendChild(iframe)
		iframe.parentNode.removeChild(iframe)
		iframe = null
	}
	else {
		/* global Notification */ // This comment satisfies a jshint requirement.
		var notice = new Notification(title, { tag: 'Cryptocat', body: body, icon: image })
		if (timeout > 0) {
			window.setTimeout(function() {
				if (notice) { notice.cancel() }
			}, timeout)
		}
	}
}

// Add a join/part notification to the main conversation window.
// If 'join === true', shows join notification, otherwise shows part.
function buddyNotification(nickname, join) {
	if (!showNotifications) { return false }
	var status, audioNotification
	if (join) {
		status = Mustache.render(Cryptocat.templates.userJoin, {
			nickname: Strophe.xmlescape(nickname),
			currentTime: currentTime(false)
		})
		audioNotification = 'userJoin'
	}
	else {
		status = Mustache.render(Cryptocat.templates.userLeave, {
			nickname: Strophe.xmlescape(nickname),
			currentTime: currentTime(false)
		})
		audioNotification = 'userLeave'
	}
	conversations['main-Conversation'] += status
	if (currentConversation === 'main-Conversation') {
		$('#conversationWindow').append(status)
	}
	scrollDownConversation(400, true)
	desktopNotification('img/keygen.gif',
		nickname + ' has ' + (join ? 'joined ' : 'left ') + Cryptocat.conversationName, '', 0x1337)
	if (audioNotifications) {
		sounds[audioNotification].play()
	}
}

// Build new buddy.
function addBuddy(nickname) {
	$('#buddyList').queue(function() {
		var buddyTemplate = Mustache.render(Cryptocat.templates.buddy, {
			nickname: nickname,
			shortNickname: shortenString(nickname, 12)
		})
		$(buddyTemplate).insertAfter('#buddiesOnline').slideDown(100, function() {
			$('#buddy-' + nickname).unbind('click')
			$('#menu-' + nickname).unbind('click')
			bindBuddyMenu(nickname)
			bindBuddyClick(nickname)
			buddyList.push(nickname)
			for (var u = 0; u < 6000; u += 2000) {
				window.setTimeout(Cryptocat.sendPublicKey, u, nickname)
			}
			buddyNotification(nickname, true)
		})
	})
	$('#buddyList').dequeue()
}

// Handle buddy going offline.
function removeBuddy(nickname) {
	// Delete their encryption keys.
	delete otrKeys[nickname]
	multiParty.removeKeys(nickname)
	buddyList.splice(buddyList.indexOf(nickname), 1)
	Cryptocat.authenticatedUsers.splice(Cryptocat.authenticatedUsers.indexOf(nickname), 1)
	if (($('#buddy-' + nickname).length !== 0)
		&& ($('#buddy-' + nickname).attr('status') !== 'offline')) {
		if ((currentConversation !== nickname)
			&& ($('#buddy-' + nickname).css('background-image') === 'none')) {
			$('#buddy-' + nickname).slideUp(500, function() {
				$(this).remove()
			})
		}
		else {
			$('#buddy-' + nickname).attr('status', 'offline')
		}
	}
	buddyNotification(nickname, false)
}

// Handle nickname change (which may be done by non-Cryptocat XMPP clients)
function changeNickname(oldNickname, newNickname) {
	otrKeys[newNickname] = otrKeys[oldNickname]
	multiParty.renameKeys(oldNickname, newNickname)
	conversations[newNickname] = conversations[oldNickname]
	removeBuddy(oldNickname)
}

// Handle incoming messages from the XMPP server.
function handleMessage(message) {
	var nickname = cleanNickname($(message).attr('from'))
	var body = $(message).find('body').text()
	var type = $(message).attr('type')
	// If archived message, ignore.
	if ($(message).find('delay').length !== 0) {
		return true
	}
	// If message is from me, ignore.
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
		if (showNotifications) {
			Cryptocat.addToConversation('', nickname, conversation, 'composing')
		}
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
		if (!body.length) { return true }
		body = multiParty.receiveMessage(nickname, Cryptocat.myNickname, body)
		if (typeof(body) === 'string') {
			Cryptocat.addToConversation(body, nickname, 'main-Conversation', 'message')
		}
	}
	// Check if this is a private OTR message.
	else if (type === 'chat') {
		otrKeys[nickname].receiveMsg(body)
	}
	return true
}

// Handle incoming presence updates from the XMPP server.
function handlePresence(presence) {
	var nickname = cleanNickname($(presence).attr('from'))
	// If invalid nickname, do not process
	if ($(presence).attr('type') === 'error') {
		if ($(presence).find('error').attr('code') === '409') {
			// Delay logout in order to avoid race condition with window animation
			window.setTimeout(function() {
				logout()
				loginFail(Cryptocat.Locale['loginMessage']['nicknameInUse'])
			}, 3000)
			return false
		}
		return true
	}
	// Ignore if presence status is coming from myself
	if (nickname === Cryptocat.myNickname) {
		return true
	}
	// Detect nickname change (which may be done by non-Cryptocat XMPP clients)
	if ($(presence).find('status').attr('code') === '303') {
		var newNickname = cleanNickname('/' + $(presence).find('item').attr('nick'))
		changeNickname(nickname, newNickname)
		return true
	}
	// Add to otrKeys if necessary
	if (nickname !== 'main-Conversation' && !otrKeys.hasOwnProperty(nickname)) {
		var options = {
			priv: myKey,
			smw: {
				path: 'js/workers/smp.js',
				seed: Cryptocat.generateSeed
			}
		}
		otrKeys[nickname] = new OTR(options)
		otrKeys[nickname].REQUIRE_ENCRYPTION = true
		otrKeys[nickname].on('ui', otrIncomingCallback(nickname))
		otrKeys[nickname].on('io', otrOutgoingCallback(nickname))
		otrKeys[nickname].on('smp', smpCallback(nickname))
		otrKeys[nickname].on('status', (function(nickname) {
			return function(state) {
				// Close generating fingerprint dialog after AKE.
				if (otrKeys[nickname].genFingerCb
				&& state === OTR.CONST.STATUS_AKE_SUCCESS) {
					closeGenerateFingerprints(nickname, otrKeys[nickname].genFingerCb)
					;delete otrKeys[nickname].genFingerCb
					// Reset trust state
					Cryptocat.authenticatedUsers.splice(Cryptocat.authenticatedUsers.indexOf(nickname), 1)
				}
			}
		} (nickname)))
		otrKeys[nickname].on('file', (function (nickname) {
			return function(type, key, filename) {
			// Make two keys, for encrypt then MAC.
				key = CryptoJS.SHA512(CryptoJS.enc.Latin1.parse(key))
				key = key.toString(CryptoJS.enc.Latin1)
				if (!Cryptocat.fileKeys[nickname]) {
					Cryptocat.fileKeys[nickname] = {}
				}
				Cryptocat.fileKeys[nickname][filename] = [
					key.substring(0, 32), key.substring(32)
				]
			}
		}) (nickname))
	}
	var status, color, placement
	// Detect buddy going offline.
	if ($(presence).attr('type') === 'unavailable') {
		removeBuddy(nickname)
		return true
	}
	// Create buddy element if buddy is new.
	else if (!$('#buddy-' + nickname).length) {
		addBuddy(nickname)
	}
	// Handle buddy status change to 'available'.
	else if ($(presence).find('show').text() === '' || $(presence).find('show').text() === 'chat') {
		if ($('#buddy-' + nickname).attr('status') !== 'online') {
			status = 'online'
			placement = '#buddiesOnline'
		}
	}
	// Handle buddy status change to 'away'.
	else if ($('#buddy-' + nickname).attr('status') !== 'away') {
		status = 'away'
		placement = '#buddiesAway'
	}
	// Perform status change.
	$('#buddy-' + nickname).attr('status', status)
	if (placement) {
		$('#buddy-' + nickname).animate({ 'color': color }, function() {
			if (currentConversation !== nickname) {
				$(this).insertAfter(placement).slideDown(200)
			}
		})
	}
	return true
}

// Bind buddy click actions. Used internally.
function bindBuddyClick(nickname) {
	$('#buddy-' + nickname).click(function() {
		$(this).removeClass('newMessage')
		if ($(this).prev().attr('id') === 'currentConversation') {
			$('#userInputText').focus()
			return true
		}
		if (nickname !== 'main-Conversation') {
			$(this).css('background-image', 'none')
		}
		else {
			$(this).css('background-image', 'url("img/groupChat.png")')
		}
		if (currentConversation) {
			var previousConversation = currentConversation
			if ($('#buddy-' + previousConversation).attr('status') === 'online') {
				$('#buddy-' + previousConversation).insertAfter('#buddiesOnline').slideDown(100)
			}
			else if ($('#buddy-' + previousConversation).attr('status') === 'away') {
				$('#buddy-' + previousConversation).insertAfter('#buddiesAway').slideDown(100)
			}
		}
		currentConversation = nickname
		initiateConversation(currentConversation)
		switchConversation(currentConversation)
		$('.line1, .line2, .line3').addClass('visibleLine')
	})
}

// Send encrypted file.
function sendFile(nickname) {
	var sendFileDialog = Mustache.render(Cryptocat.templates.sendFile, {
		sendEncryptedFile: Cryptocat.Locale['chatWindow']['sendEncryptedFile'],
		fileTransferInfo: Cryptocat.Locale['chatWindow']['fileTransferInfo']
	})
	ensureOTRdialog(nickname, false, function() {
		dialogBox(sendFileDialog, 240, true)
		$('#fileSelector').change(function(e) {
			e.stopPropagation()
			if (this.files) {
				var file = this.files[0]
				var filename = Cryptocat.encodedBytes(16, CryptoJS.enc.Hex)
				filename += file.name.match(/\.(\w)+$/)[0]
				otrKeys[nickname].sendFile(filename)
				var key = Cryptocat.fileKeys[nickname][filename]
				Cryptocat.beginSendFile({
					file: file,
					filename: filename,
					to: nickname,
					key: key
				})
				;delete Cryptocat.fileKeys[nickname][filename]
			}
		})
		$('#fileSelectButton').click(function() {
			$('#fileSelector').click()
		})
	})
}

// Scrolls down the chat window to the bottom in a smooth animation.
// 'speed' is animation speed in milliseconds.
// If `threshold is true, we won't scroll down if the user
// appears to be scrolling up to read messages.
function scrollDownConversation(speed, threshold) {
	var scrollPosition = $('#conversationWindow')[0].scrollHeight - $('#conversationWindow').scrollTop()
	if ((scrollPosition < 950) || !threshold) {
		$('#conversationWindow').animate({
			scrollTop: $('#conversationWindow')[0].scrollHeight + 20
		}, speed)
	}
}

// Close generating fingerprints dialog.
function closeGenerateFingerprints(nickname, arr) {
	var close = arr[0]
	var cb = arr[1]
	$('#fill').stop().animate({'width': '100%', 'opacity': '1'}, 400, 'linear', function() {
		$('#dialogBoxContent').fadeOut(function() {
			$(this).empty().show()
			if (close) {
				$('#dialogBoxClose').click()
			}
			cb()
		})
	})
}

// If OTR fingerprints have not been generated, show a progress bar and generate them.
function ensureOTRdialog(nickname, close, cb) {
	if (nickname === Cryptocat.myNickname || otrKeys[nickname].msgstate) {
		return cb()
	}
	var progressDialog = '<div id="progressBar"><div id="fill"></div></div>'
	dialogBox(progressDialog, 240, true)
	$('#progressBar').css('margin', '70px auto 0 auto')
	$('#fill').animate({'width': '100%', 'opacity': '1'}, 10000, 'linear')
	// add some state for status callback
	otrKeys[nickname].genFingerCb = [close, cb]
	otrKeys[nickname].sendQueryMsg()
}

// Display buddy information, including fingerprints and authentication.
function displayInfo(nickname) {
	var infoDialog
	nickname = Strophe.xmlescape(nickname)
	if (nickname === Cryptocat.myNickname) {
		infoDialog = 'myInfo'
	}
	else {
		infoDialog = 'buddyInfo'
	}
	infoDialog = Mustache.render(Cryptocat.templates[infoDialog], {
		nickname: nickname,
		otrFingerprint: Cryptocat.Locale['chatWindow']['otrFingerprint'],
		groupFingerprint: Cryptocat.Locale['chatWindow']['groupFingerprint'],
		authenticate: Cryptocat.Locale['chatWindow']['authenticate'],
		verifyUserIdentity: Cryptocat.Locale['chatWindow']['verifyUserIdentity'],
		secretQuestion: Cryptocat.Locale['chatWindow']['secretQuestion'],
		secretAnswer: Cryptocat.Locale['chatWindow']['secretAnswer'],
		ask: Cryptocat.Locale['chatWindow']['ask'],
		identityVerified: Cryptocat.Locale['chatWindow']['identityVerified']
	})
	ensureOTRdialog(nickname, false, function() {
		if ((Cryptocat.authenticatedUsers.indexOf(nickname) >= 0)
		|| (nickname === Cryptocat.myNickname)) {
			dialogBox(infoDialog, 250, true)
			if (nickname !== Cryptocat.myNickname) {
				showAuthenticated(nickname, 0)
			}
		}
		else {
			dialogBox(infoDialog, 340, true)
			$('#authSubmit').unbind('click').bind('click', function(e) {
				e.preventDefault()
				var question = $('#authQuestion').val()
				var answer = $('#authAnswer').val().toLowerCase()
					.replace(/(\s|\.|\,|\'|\"|\;|\?|\!)/, '')
				if (answer.length === 0) {
					// a secret is required!
					return
				}
				$('#authSubmit').val(Cryptocat.Locale['chatWindow']['asking'])
				$('#authSubmit').unbind('click').bind('click', function(e) {
					e.preventDefault()
				})
				otrKeys[nickname].smpSecret(answer, question)
			})
		}
		$('#otrFingerprint').text(getFingerprint(nickname, 1))
		$('#multiPartyFingerprint').text(getFingerprint(nickname, 0))
	})
}

// Receive an SMP question
function smpQuestion(nickname, question) {
	$('#dialogBoxClose').click()
	var authRequest = Cryptocat.Locale['chatWindow']['authRequest']
		.replace('(NICKNAME)', nickname)
	var answerMustMatch = Cryptocat.Locale['chatWindow']['answerMustMatch']
		.replace('(NICKNAME)', nickname)
	window.setTimeout(function() {
		dialogBox(Mustache.render(Cryptocat.templates.authRequest, {
			authenticate: Cryptocat.Locale['chatWindow']['authenticate'],
			authRequest: authRequest,
			answerMustMatch: answerMustMatch,
			question: question,
			answer: Cryptocat.Locale['chatWindow']['answer']
		}), 240, false, function() {
			$('#authReplySubmit').unbind('click').bind('click', function(e) {
				e.preventDefault()
				var answer = $('#authReply').val().toLowerCase().replace(/(\s|\.|\,|\'|\"|\;|\?|\!)/, '')
				otrKeys[nickname].smpSecret(answer)
				$('#dialogBoxClose').click()
			})
		})
	}, 500)
}

// Bind buddy menus for new buddies. Used internally.
function bindBuddyMenu(nickname) {
	nickname = Strophe.xmlescape(nickname)
	$('#menu-' + nickname).attr('status', 'inactive')
	if (Cryptocat.ignoredUsers.indexOf(nickname) >= 0) {
		$('#buddy-' + nickname).addClass('ignored')
	}
	$('#menu-' + nickname).click(function(e) {
		e.stopPropagation()
		if ($('#menu-' + nickname).attr('status') === 'inactive') {
			$('#menu-' + nickname).attr('status', 'active')
			var buddyMenuContents = '<div class="buddyMenuContents" id="' + nickname + '-contents">'
			$(this).css('background-image', 'url("img/up.png")')
			var ignoreAction
			if (Cryptocat.ignoredUsers.indexOf(nickname) >= 0) {
				ignoreAction = Cryptocat.Locale['chatWindow']['unignore']
			}
			else {
				ignoreAction = Cryptocat.Locale['chatWindow']['ignore']
			}
			$('#buddy-' + nickname).delay(10).animate({'height': 130}, 180, function() {
				$(this).append(buddyMenuContents)
				$('#' + nickname + '-contents').append(
					Mustache.render(Cryptocat.templates.buddyMenu, {
						sendEncryptedFile: Cryptocat.Locale['chatWindow']['sendEncryptedFile'],
						displayInfo: Cryptocat.Locale['chatWindow']['displayInfo'],
						ignore: ignoreAction
					})
				)
				$('#' + nickname + '-contents').fadeIn(200, function() {
					$('#' + nickname + '-contents').find('.option1').click(function(e) {
						e.stopPropagation()
						displayInfo(nickname)
						$('#menu-' + nickname).click()
					})
					$('#' + nickname + '-contents').find('.option2').click(function(e) {
						e.stopPropagation()
						sendFile(nickname)
						$('#menu-' + nickname).click()
					})
					$('#' + nickname + '-contents').find('.option3').click(function(e) {
						e.stopPropagation()
						if (ignoreAction === Cryptocat.Locale['chatWindow']['ignore']) {
							Cryptocat.ignoredUsers.push(nickname)
							$('#buddy-' + nickname).addClass('ignored')
						}
						else {
							Cryptocat.ignoredUsers.splice(Cryptocat.ignoredUsers.indexOf(nickname), 1)
							$('#buddy-' + nickname).removeClass('ignored')
						}
						$('#menu-' + nickname).click()
					})
				})
			})
		}
		else {
			$('#menu-' + nickname).attr('status', 'inactive')
			$(this).css('background-image', 'url("img/down.png")')
			$('#buddy-' + nickname).animate({'height': 15}, 190)
			$('#' + nickname + '-contents').fadeOut(200, function() {
				$('#' + nickname + '-contents').remove()
			})
		}
	})
}

// Send your current status to the XMPP server.
function sendStatus() {
	if (currentStatus === 'away') {
		Cryptocat.connection.muc.setStatus(Cryptocat.conversationName + '@'
		+ Cryptocat.conferenceServer, Cryptocat.myNickname, 'away', 'away')
	}
	else {
		Cryptocat.connection.muc.setStatus(Cryptocat.conversationName + '@'
		+ Cryptocat.conferenceServer, Cryptocat.myNickname, '', '')
	}
}

// Displays a pretty dialog box with `data` as the content HTML.
// If `closeable = true`, then the dialog box has a close button on the top right.
// `height` is the height of the dialog box, in pixels.
// onAppear may be defined as a callback function to execute on dialog box appear.
// onClose may be defined as a callback function to execute on dialog box close.
function dialogBox(data, height, closeable, onAppear, onClose) {
	if (closeable) {
		$('#dialogBoxClose').css('width', 18)
		$('#dialogBoxClose').css('font-size', 12)
	}
	$('#dialogBoxContent').html(data)
	$('#dialogBox').css('height', height)
	$('#dialogBox').fadeIn(200, function() {
		if (onAppear) { onAppear() }
	})
	$('#dialogBoxClose').unbind('click').click(function(e) {
		e.stopPropagation()
		$(this).unbind('click')
		if ($(this).css('width') === 0) {
			return false
		}
		$('#dialogBox').fadeOut(100, function() {
			$('#dialogBoxContent').empty()
			$('#dialogBoxClose').css('width', '0')
			$('#dialogBoxClose').css('font-size', '0')
			if (onClose) { onClose() }
		})
		$('#userInputText').focus()
	})
	if (closeable) {
		$(document).keydown(function(e) {
			if (e.keyCode === 27) {
				e.stopPropagation()
				$('#dialogBoxClose').click()
				$(document).unbind('keydown')
			}
		})
	}
}

// Buttons:
// Status button.
$('#status').click(function() {
	if ($(this).attr('src') === 'img/available.png') {
		$(this).attr('src', 'img/away.png')
		$(this).attr('alt', Cryptocat.Locale['chatWindow']['statusAway'])
		$(this).attr('title', Cryptocat.Locale['chatWindow']['statusAway'])
		currentStatus = 'away'
		sendStatus()
	}
	else {
		$(this).attr('src', 'img/available.png')
		$(this).attr('alt', Cryptocat.Locale['chatWindow']['statusAvailable'])
		$(this).attr('title', Cryptocat.Locale['chatWindow']['statusAvailable'])
		currentStatus = 'online'
		sendStatus()
	}
})

// My info button.
$('#myInfo').click(function() {
	displayInfo(Cryptocat.myNickname)
})

// Desktop notifications button.
var firefox = navigator.userAgent.match('Firefox\/(.*)')
if (!window.webkitNotifications && (firefox && ((firefox[1] | 0) < 22))) {
	$('#notifications').remove()
}
else {
	$('#notifications').click(function() {
		if ($(this).attr('src') === 'img/noNotifications.png') {
			$(this).attr('src', 'img/notifications.png')
			$(this).attr('alt', Cryptocat.Locale['chatWindow']['desktopNotificationsOn'])
			$(this).attr('title', Cryptocat.Locale['chatWindow']['desktopNotificationsOn'])
			desktopNotifications = true
			Cryptocat.Storage.setItem('desktopNotifications', 'true')
			if (window.webkitNotifications) {
				if (window.webkitNotifications.checkPermission()) {
					window.webkitNotifications.requestPermission(function() {})
				}
			}
		}
		else {
			$(this).attr('src', 'img/noNotifications.png')
			$(this).attr('alt', Cryptocat.Locale['chatWindow']['desktopNotificationsOff'])
			$(this).attr('title', Cryptocat.Locale['chatWindow']['desktopNotificationsOff'])
			desktopNotifications = false
			Cryptocat.Storage.setItem('desktopNotifications', 'false')
		}
	})
}

// Audio notifications button.
$('#audio').click(function() {
	if ($(this).attr('src') === 'img/noSound.png') {
		$(this).attr('src', 'img/sound.png')
		$(this).attr('alt', Cryptocat.Locale['chatWindow']['audioNotificationsOn'])
		$(this).attr('title', Cryptocat.Locale['chatWindow']['audioNotificationsOn'])
		audioNotifications = true
		Cryptocat.Storage.setItem('audioNotifications', 'true')
	}
	else {
		$(this).attr('src', 'img/noSound.png')
		$(this).attr('alt', Cryptocat.Locale['chatWindow']['audioNotificationsOff'])
		$(this).attr('title', Cryptocat.Locale['chatWindow']['audioNotificationsOff'])
		audioNotifications = false
		Cryptocat.Storage.setItem('audioNotifications', 'false')
	}
})

// Logout button.
$('#logout').click(function() {
	$('#loginInfo').text(Cryptocat.Locale['loginMessage']['thankYouUsing'])
	$('#loginInfo').animate({'background-color': '#97CEEC'}, 200)
	logout()
})

// Submit user input.
$('#userInput').submit(function() {
	var message = $.trim($('#userInputText').val())
	if (message !== '') {
		if (currentConversation === 'main-Conversation') {
			if (multiParty.userCount() >= 1) {
				var ciphertext = JSON.parse(multiParty.sendMessage(message))
				var missingRecipients = []
				for (var i = 0; i !== buddyList.length; i++) {
					if (typeof(ciphertext['text'][buddyList[i]]) !== 'object') {
						missingRecipients.push(buddyList[i])
					}
				}
				if (missingRecipients.length) {
					Cryptocat.addToConversation(missingRecipients, Cryptocat.myNickname, 'main-Conversation', 'missingRecipients')
				}
				Cryptocat.connection.muc.message(
					Cryptocat.conversationName + '@' + Cryptocat.conferenceServer,
					null, JSON.stringify(ciphertext), null, 'groupchat', 'active'
				)
			}
		}
		else {
			otrKeys[currentConversation].sendMsg(message)
		}
		Cryptocat.addToConversation(message, Cryptocat.myNickname, currentConversation, 'message')
	}
	$('#userInputText').val('')
	return false
})

// User input key event detection.
// (Message submission, nick completion...)
$('#userInputText').keydown(function(e) {
	if (e.keyCode === 9) {
		e.preventDefault()
		var nickname, match, suffix
		for (nickname in otrKeys) {
			if (otrKeys.hasOwnProperty(nickname)) {
				try { match = nickname.match($(this).val().match(/(\S)+$/)[0]) }
				catch(err) {}
				if (match) {
					if ($(this).val().match(/\s/)) { suffix = ' ' }
					else { suffix = ': ' }
					$(this).val($(this).val().replace(/(\S)+$/, nickname + suffix))
				}
			}
		}
	}
	else if (e.keyCode === 13) {
		e.preventDefault()
		$('#userInput').submit()
		window.clearTimeout(paused)
		paused = false
		return true
	}
	var destination, type
	if (currentConversation === 'main-Conversation') {
		destination = null
		type = 'groupchat'
	}
	else {
		destination = currentConversation
		type = 'chat'
	}
	if (paused === false) {
		Cryptocat.connection.muc.message(
			Cryptocat.conversationName + '@' + Cryptocat.conferenceServer,
			destination, '', null, type, 'composing'
		)
	}
	window.clearTimeout(paused)
	paused = window.setTimeout(function(d, t) {
		Cryptocat.connection.muc.message(
			Cryptocat.conversationName + '@' + Cryptocat.conferenceServer,
			d, '', null, t, 'paused'
		)
		paused = false
	}, 5000, destination, type)
})

$('#userInputText').keyup(function(e) {
	if (e.keyCode === 13) {
		e.preventDefault()
	}
})

$('#userInputSubmit').click(function() {
	$('#userInput').submit()
	$('#userInputText').select()
})

// Language selector.
$('#languageSelect').click(function() {
	$('#customServerDialog').hide()
	$('#languages li').css({'color': '#FFF', 'font-weight': 'normal'})
	$('#' + Cryptocat.Locale['language']).css({'color': '#97CEEC', 'font-weight': 'bold'})
	$('#footer').animate({'height': 180}, function() {
		$('#languages').fadeIn()
		$('#languages li').click(function() {
			var lang = $(this).attr('id')
			$('#languages').fadeOut(200, function() {
				Cryptocat.Locale.set(lang)
				Cryptocat.Storage.setItem('language', lang)
				$('#footer').animate({'height': 14})
			})
		})
	})
})

// Login form.
$('#conversationName').click(function() {
	$(this).select()
})
$('#nickname').click(function() {
	$(this).select()
})
$('#loginForm').submit(function() {
	// Don't submit if form is already being processed.
	if (($('#loginSubmit').attr('readonly') === 'readonly')) {
		return false
	}
	//Check validity of conversation name and nickname.
	$('#conversationName').val($.trim($('#conversationName').val().toLowerCase()))
	$('#nickname').val($.trim($('#nickname').val().toLowerCase()))
	if ($('#conversationName').val() === '') {
		loginFail(Cryptocat.Locale['loginMessage']['enterConversation'])
		$('#conversationName').select()
	}
	else if (!$('#conversationName').val().match(/^\w{1,20}$/)) {
		loginFail(Cryptocat.Locale['loginMessage']['conversationAlphanumeric'])
		$('#conversationName').select()
	}
	else if ($('#nickname').val() === '') {
		loginFail(Cryptocat.Locale['loginMessage']['enterNickname'])
		$('#nickname').select()
	}
	else if (!$('#nickname').val().match(/^\w{1,16}$/)) {
		loginFail(Cryptocat.Locale['loginMessage']['nicknameAlphanumeric'])
		$('#nickname').select()
	}
	// If no encryption keys, generate.
	else if (!myKey) {
		var progressForm = '<br /><p id="progressForm"><img src="img/keygen.gif" '
			+ 'alt="" /><p id="progressInfo"><span>'
			+ Cryptocat.Locale['loginMessage']['generatingKeys'] + '</span></p>'
		if (audioNotifications) { sounds.keygenStart.play() }
		dialogBox(progressForm, 240, false, function() {
			if (audioNotifications) {
				window.setTimeout(function() {
					sounds.keygenLoop.loop = true
					sounds.keygenLoop.play()
				}, 800)
			}

			// Create DSA key for OTR.
			DSA.createInWebWorker({
				path: 'js/workers/dsa.js',
				seed: Cryptocat.generateSeed
			}, function (key) {
				myKey = key
				// Key storage currently disabled as we are not yet sure if this is safe to do.
				//	Cryptocat.Storage.setItem('myKey', JSON.stringify(myKey))
				$('#loginInfo').text(Cryptocat.Locale['loginMessage']['connecting'])
				connectXMPP(
					Cryptocat.encodedBytes(16, CryptoJS.enc.Hex),
					Cryptocat.encodedBytes(16, CryptoJS.enc.Hex)
				)
			})

			// Key storage currently disabled as we are not yet sure if this is safe to do.
			// Cryptocat.Storage.setItem('multiPartyKey', multiParty.genPrivateKey())
			//else {
				multiParty.genPrivateKey()
			//}
			multiParty.genPublicKey()
		})
		if (Cryptocat.Locale['language'] === 'en') {
			$('#progressInfo').append(
				Mustache.render(Cryptocat.templates.catFact, {
					catFact: CatFacts.getFact()
				})
			)
		}
		$('#progressInfo').append(
			'<div id="progressBar"><div id="fill"></div></div>'
		)
		catFactInterval = window.setInterval(function() {
			$('#interestingFact').fadeOut(function() {
				$(this).text(CatFacts.getFact()).fadeIn()
			})
		}, 9000)
		$('#fill').animate({'width': '100%', 'opacity': '1'}, 14000, 'linear')
	}
	// If everything is okay, then register a randomly generated throwaway XMPP ID and log in.
	else {
		connectXMPP(Cryptocat.encodedBytes(16, CryptoJS.enc.Hex), Cryptocat.encodedBytes(16, CryptoJS.enc.Hex))
	}
	return false
})

// Registers a new user on the XMPP server, connects and join conversation.
function connectXMPP(username, password) {
	Cryptocat.conversationName = Strophe.xmlescape($('#conversationName').val())
	Cryptocat.myNickname = Strophe.xmlescape($('#nickname').val())
	Cryptocat.connection = new Strophe.Connection(Cryptocat.bosh)
	$('#loginSubmit').attr('readonly', 'readonly')
	Cryptocat.connection.register.connect(Cryptocat.domain, function(status) {
		if (status === Strophe.Status.REGISTER) {
			$('#loginInfo').text(Cryptocat.Locale['loginMessage']['registering'])
			Cryptocat.connection.register.fields.username = username
			Cryptocat.connection.register.fields.password = password
			Cryptocat.connection.register.submit()
		}
		else if (status === Strophe.Status.REGISTERED) {
			Cryptocat.connection.reset()
			Cryptocat.connection = new Strophe.Connection(Cryptocat.bosh)
			Cryptocat.connection.connect(username + '@' + Cryptocat.domain, password,function(status) {
				if (status === Strophe.Status.CONNECTING) {
					$('#loginInfo').animate({'background-color': '#97CEEC'}, 200)
					$('#loginInfo').text(Cryptocat.Locale['loginMessage']['connecting'])
				}
				else if (status === Strophe.Status.CONNECTED) {
					$('.conversationName').animate({'background-color': '#97CEEC'})
					Cryptocat.connection.ibb.addIBBHandler(Cryptocat.ibbHandler)
					/* jshint -W106 */
					Cryptocat.connection.si_filetransfer.addFileHandler(Cryptocat.fileHandler)
					/* jshint +W106 */
					Cryptocat.connection.muc.join(
						Cryptocat.conversationName + '@' + Cryptocat.conferenceServer,
						Cryptocat.myNickname,
						function(message) {
							if (handleMessage(message)) { return true }
						},
						function (presence) {
							if (handlePresence(presence)) { return true }
						}
					)
					if (audioNotifications) {
						sounds.keygenLoop.pause()
						sounds.keygenEnd.play()
					}
					$('#fill').stop().animate({
						'width': '100%', 'opacity': '1'
					}, 250, 'linear', function() {
						window.setTimeout(function() {
							$('#dialogBoxClose').click()
						}, 200)
					})
					window.setTimeout(function() {
						connected()
					}, 400)
				}
				else if (status === Strophe.Status.CONNFAIL) {
					showNotifications = false
					if (loginError) {
						reconnectXMPP(username, password)
					}
				}
				else if (status === Strophe.Status.DISCONNECTED) {
					if (loginError) {
						reconnectXMPP(username, password)
					}
				}
			})
		}
		else if (status === Strophe.Status.SBMTFAIL) {
			loginFail(Cryptocat.Locale['loginMessage']['authenticationFailure'])
			$('#conversationName').select()
			$('#loginSubmit').removeAttr('readonly')
			Cryptocat.connection = null
			return false
		}
	})
}

// Executes on successfully completed XMPP connection.
function connected() {
	clearInterval(catFactInterval)
	Cryptocat.Storage.setItem('myNickname', Cryptocat.myNickname)
	$('#buddy-main-Conversation').attr('status', 'online')
	$('#loginInfo').text('✓')
	$('#info').fadeOut(200)
	$('#loginOptions,#languages,#customServerDialog,#version,#logoText,#loginInfo').fadeOut(200)
	$('#header').animate({'background-color': '#151520'})
	$('.logo').animate({'margin': '-11px 5px 0 0'})
	$('#loginForm').fadeOut(200, function() {
		$('#conversationInfo').fadeIn()
		bindBuddyClick('main-Conversation')
		$('#buddy-main-Conversation').click()
		$('#conversationWrapper').fadeIn()
		$('#optionButtons').fadeIn()
		$('#footer').delay(200).animate({'height': 60}, function() {
			$('#userInput').fadeIn(200, function() {
				$('#userInputText').focus()
			})
		})
		$('#buddyWrapper').slideDown()
		window.setTimeout(function() {
			showNotifications = true
		}, 6000)
	})
	loginError = true
	document.title = Cryptocat.myNickname + '@' + Cryptocat.conversationName
}

// Reconnect to the same chatroom, on accidental connection loss.
function reconnectXMPP(username, password) {
	multiParty.reset()
	Cryptocat.connection.reset()
	Cryptocat.connection = new Strophe.Connection(Cryptocat.bosh)
	Cryptocat.connection.connect(username + '@' + Cryptocat.domain, password, function(status) {
		if (status === Strophe.Status.CONNECTING) {
			$('.conversationName').animate({'background-color': '#F00'})
		}
		else if (status === Strophe.Status.CONNECTED) {
			$('.conversationName').animate({'background-color': '#97CEEC'})
			Cryptocat.connection.ibb.addIBBHandler(Cryptocat.ibbHandler)
			/* jshint -W106 */
			Cryptocat.connection.si_filetransfer.addFileHandler(Cryptocat.fileHandler)
			/* jshint +W106 */
			Cryptocat.connection.muc.join(
				Cryptocat.conversationName + '@' + Cryptocat.conferenceServer,
				Cryptocat.myNickname
			)
			if (audioNotifications) {
				sounds.keygenLoop.pause()
				sounds.keygenEnd.play()
			}
		}
		else if ((status === Strophe.Status.CONNFAIL) || (status === Strophe.Status.DISCONNECTED)) {
			if (loginError) {
				window.setTimeout(function() {
				reconnectXMPP(username, password)
				}, 5000)
			}
		}
	})
}

// Executes on user logout.
function logout() {
	loginError = false
	Cryptocat.connection.muc.leave(Cryptocat.conversationName + '@' + Cryptocat.conferenceServer)
	Cryptocat.connection.disconnect()
	document.title = 'Cryptocat'
	$('#conversationInfo,#optionButtons').fadeOut()
	$('#header').animate({'background-color': 'transparent'})
	$('.logo').animate({'margin': '-5px 5px 0 5px'})
	$('#buddyWrapper').slideUp()
	$('.buddy').unbind('click')
	$('.buddyMenu').unbind('click')
	$('#buddy-main-Conversation').insertAfter('#buddiesOnline')
	$('#userInput').fadeOut(function() {
		$('#logoText').fadeIn()
		$('#footer').animate({'height': 14})
		$('#conversationWrapper').fadeOut(function() {
			$('#dialogBoxClose').click()
			$('#buddyList div').each(function() {
				if ($(this).attr('id') !== 'buddy-main-Conversation') {
					$(this).remove()
				}
			})
			$('#conversationWindow').html('')
			otrKeys = {}
			multiParty.reset()
			conversations = {}
			currentConversation = null
			Cryptocat.connection = null
			$('#info,#loginOptions,#version,#loginInfo').fadeIn()
			$('#loginForm').fadeIn(200, function() {
				$('#conversationName').select()
				$('#loginSubmit').removeAttr('readonly')
			})
		})
	})
}

// When the window/tab is not selected, set `isFocused` to false.
// The variable `isFocused` is used to know when to show desktop notifications.
$(window).blur(function() {
	isFocused = false
})

// On window focus, select text input field automatically if we are chatting.
// Also set `isFocused` to true.
$(window).focus(function() {
	isFocused = true
	newMessages = 0
	Tinycon.setBubble()
	if ($('#buddy-main-Conversation').attr('status') === 'online') {
		$('#userInputText').focus()
	}
})

// Prevent accidental window close.
$(window).bind('beforeunload', function() {
	if (showNotifications) {
		return Cryptocat.Locale['loginMessage']['thankYouUsing']
	}
})

// Logout on browser close.
$(window).unload(function() {
	if (Cryptocat.connection !== null) {
		Cryptocat.connection.disconnect()
	}
})

// Determine whether we are showing a top margin
// Depending on window size
if ($(window).height() > 595) {
	$('#bubble').css('margin-top', '1.5%')
}

// Show main window.
$('#bubble').show()

})}//:3
