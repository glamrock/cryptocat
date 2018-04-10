/*
-------------------
GLOBAL VARIABLES
-------------------
*/

if (typeof Cryptocat === 'undefined') {
	Cryptocat = function() {}
}
Cryptocat.version = '2.1.17' // Version number

Cryptocat.ignoredUsers = []
Cryptocat.authenticatedUsers = []
Cryptocat.conversationName = null
Cryptocat.myNickname = null

Cryptocat.audioExtension = '.mp3'
if (navigator.userAgent.match('OPR')) {
	Cryptocat.audioExt = '.ogg' // Opera doesn't support mp3 HTML5 audio
}
Cryptocat.sounds = {
	'keygenStart': (new Audio('snd/keygenStart' + Cryptocat.audioExt)),
	'keygenLoop': (new Audio('snd/keygenLoop' + Cryptocat.audioExt)),
	'keygenEnd': (new Audio('snd/keygenEnd' + Cryptocat.audioExt)),
	'userJoin': (new Audio('snd/userJoin' + Cryptocat.audioExt)),
	'userLeave': (new Audio('snd/userLeave' + Cryptocat.audioExt)),
	'msgGet': (new Audio('snd/msgGet' + Cryptocat.audioExt))
}

/*
-------------------
END GLOBAL SCOPE
-------------------
*/

if (typeof(window) !== 'undefined') {
$(window).ready(function() {

/*
-------------------
INTIALIZATION
-------------------
*/

// Set version number in UI.
$('#version').text(Cryptocat.version)

// Seed RNG.
Cryptocat.random.setSeed(Cryptocat.random.generateSeed())

var conversations = {}
var buddyList = []
var newMessages = 0
var isFocused = true
var paused = false

// Load favicon notification settings.
Tinycon.setOptions({
	colour: '#FFFFFF',
	background: '#76BDE5'
})

/*
-------------------
GLOBAL INTERFACE FUNCTIONS
-------------------
*/

// Update a file transfer progress bar.
Cryptocat.updateFileProgressBar = function(file, chunk, size, recipient) {
	var progress = (chunk * 100) / (Math.ceil(size / Cryptocat.otr.chunkSize))
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
		downloadFile: Cryptocat.locale['chatWindow']['downloadFile']
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
			if (Cryptocat.audioNotifications) { Cryptocat.sounds.msgGet.play() }
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
			if (Cryptocat.audioNotifications) { Cryptocat.sounds.msgGet.play() }
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
			if (Cryptocat.audioNotifications) { Cryptocat.sounds.msgGet.play() }
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
		if (conversation === Cryptocat.currentConversation) {
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
	if (conversation === Cryptocat.currentConversation) {
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

// Show a preview for a received message from a buddy.
// Message previews will not overlap and are removed after 5 seconds.
Cryptocat.messagePreview = function(message, nickname) {
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
Cryptocat.showAuthenticated = function(nickname, speed) {
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

// Handles login failures.
Cryptocat.loginFail = function(message) {
	$('#loginInfo').text(message)
	$('#bubble').animate({'left': '+=5px'}, 130)
		.animate({'left': '-=10px'}, 130)
		.animate({'left': '+=5px'}, 130)
	$('#loginInfo').animate({'background-color': '#E93028'}, 200)
}

// Build new buddy.
Cryptocat.addBuddy = function(nickname) {
	nickname = Strophe.xmlescape(nickname)
	$('#buddyList').queue(function() {
		var buddyTemplate = Mustache.render(Cryptocat.templates.buddy, {
			nickname: nickname,
			shortNickname: shortenString(nickname, 12)
		})
		$(buddyTemplate).insertAfter('#buddiesOnline').slideDown(100, function() {
			$('#buddy-' + nickname).unbind('click')
			$('#menu-' + nickname).unbind('click')
			$('#menu-' + nickname).attr('status', 'inactive')
			if (Cryptocat.ignoredUsers.indexOf(nickname) >= 0) {
				$('#buddy-' + nickname).addClass('ignored')
			}
			$('#menu-' + nickname).click(function(e) {
				e.stopPropagation()
				openBuddyMenu(nickname)
			})
			$('#buddy-' + nickname).click(function() {
				Cryptocat.onBuddyClick(nickname)
			})
			buddyList.push(nickname)
			for (var u = 0; u < 6000; u += 2000) {
				window.setTimeout(Cryptocat.xmpp.sendPublicKey, u, nickname)
			}
			buddyNotification(nickname, true)
		})
	})
	$('#buddyList').dequeue()
}

// Handle buddy going offline.
Cryptocat.removeBuddy = function(nickname) {
	// Delete their encryption keys.
	delete Cryptocat.otr.keys[nickname]
	multiParty.removeKeys(nickname)
	buddyList.splice(buddyList.indexOf(nickname), 1)
	Cryptocat.authenticatedUsers.splice(Cryptocat.authenticatedUsers.indexOf(nickname), 1)
	if (($('#buddy-' + nickname).length !== 0)
		&& ($('#buddy-' + nickname).attr('status') !== 'offline')) {
		if ((Cryptocat.currentConversation !== nickname)
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

// Bind buddy click actions.
Cryptocat.onBuddyClick = function(nickname) {
	$('#buddy-' + nickname).removeClass('newMessage')
	if ($('#buddy-' + nickname).prev().attr('id') === 'currentConversation') {
		$('#userInputText').focus()
		return true
	}
	$('#buddy-' + nickname).css('background-image', 'none')
	if (nickname === 'main-Conversation') {
		$('#buddy-' + nickname).css('background-image', 'url("img/groupChat.png")')
	}
	if (Cryptocat.currentConversation) {
		var buddyStatus = $('#buddy-' + Cryptocat.currentConversation).attr('status')
		if (buddyStatus === 'online') {
			$('#buddy-' + Cryptocat.currentConversation)
				.insertAfter('#buddiesOnline').slideDown(100)
		}
		else if (buddyStatus === 'away') {
			$('#buddy-' + Cryptocat.currentConversation)
				.insertAfter('#buddiesAway').slideDown(100)
		}
	}
	Cryptocat.currentConversation = nickname
	initiateConversation(Cryptocat.currentConversation)
	switchConversation(Cryptocat.currentConversation)
	$('#conversationWindow').children().addClass('visibleLine')
}

// Close generating fingerprints dialog.
Cryptocat.closeGenerateFingerprints = function(nickname, arr) {
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

// Displays a pretty dialog box with `data` as the content HTML.
// If `closeable = true`, then the dialog box has a close button on the top right.
// `height` is the height of the dialog box, in pixels.
// onAppear may be defined as a callback function to execute on dialog box appear.
// onClose may be defined as a callback function to execute on dialog box close.
Cryptocat.dialogBox = function(data, height, closeable, onAppear, onClose) {
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

// Handle nickname change (which may be done by non-Cryptocat XMPP clients)
Cryptocat.changeNickname = function(oldNickname, newNickname) {
	Cryptocat.otr.keys[newNickname] = Cryptocat.otr.keys[oldNickname]
	multiParty.renameKeys(oldNickname, newNickname)
	conversations[newNickname] = conversations[oldNickname]
	Cryptocat.removeBuddy(oldNickname)
}

// Executes on user logout.
Cryptocat.logout = function() {
	Cryptocat.loginError = false
	Cryptocat.xmpp.connection.muc.leave(Cryptocat.conversationName + '@' + Cryptocat.xmpp.conferenceServer)
	Cryptocat.xmpp.connection.disconnect()
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
			Cryptocat.otr.keys = {}
			buddyList = []
			multiParty.reset()
			conversations = {}
			Cryptocat.currentConversation = null
			Cryptocat.xmpp.connection = null
			$('#info,#loginOptions,#version,#loginInfo').fadeIn()
			$('#loginForm').fadeIn(200, function() {
				$('#conversationName').select()
				$('#loginSubmit').removeAttr('readonly')
			})
		})
	})
}

/*
-------------------
PRIVATE INTERFACE FUNCTIONS
-------------------
*/

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

// Creates a template for the conversation info bar at the top of each conversation.
function buildConversationInfo(conversation) {
	$('.conversationName').text(Cryptocat.myNickname + '@' + Cryptocat.conversationName)
	if (conversation === 'main-Conversation') {
		$('#groupConversation').text(Cryptocat.locale['chatWindow']['groupConversation'])
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
	buildConversationInfo(Cryptocat.currentConversation)
	$('#conversationWindow').html(conversations[Cryptocat.currentConversation])
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
		if ($(this).attr('id') !== ('buddy-' + Cryptocat.currentConversation)) {
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

// Simply shortens a string `string` to length `length.
// Adds '..' to delineate that string was shortened.
function shortenString(string, length) {
	if (string.length > length) {
		return string.substring(0, (length - 2)) + '..'
	}
	return string
}

// Get a fingerprint, formatted for readability.
function getFingerprint(buddy, OTR) {
	var fingerprint
	if (OTR) {
		if (buddy === Cryptocat.myNickname) {
			fingerprint = Cryptocat.otr.myKey.fingerprint()
		}
		else {
			/* jshint -W106 */
			fingerprint = Cryptocat.otr.keys[buddy].their_priv_pk.fingerprint()
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
	var sanitize
	var URLs = message.match(/((http(s?)\:\/\/){1}\S+)/gi)
	if (!URLs) { return message }
	for (var i = 0; i !== URLs.length; i++) {
		sanitize = URLs[i].split('')
		for (var l = 0; l !== sanitize.length; l++) {
			if (!sanitize[l].match(/\w|\d|\:|\/|\?|\=|\#|\+|\,|\.|\&|\;|\%/)) {
				sanitize[l] = encodeURIComponent(sanitize[l])
			}
		}
		sanitize = sanitize.join('')
		var url = sanitize.replace(':', '&colon;')
		if (navigator.userAgent === 'Chrome (Mac app)') {
			message = message.replace(
				sanitize, '<a href="' + url + '">' + url + '</a>'
			)
			continue
		}
		message = message.replace(
			sanitize, '<a href="' + url + '" target="_blank">' + url + '</a>'
		)
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
	if (!Cryptocat.desktopNotifications || isFocused) { return false }
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
	if (Cryptocat.currentConversation === 'main-Conversation') {
		$('#conversationWindow').append(status)
	}
	scrollDownConversation(400, true)
	desktopNotification('img/keygen.gif',
		nickname + ' has ' + (join ? 'joined ' : 'left ') + Cryptocat.conversationName, '', 0x1337)
	if (Cryptocat.audioNotifications) {
		Cryptocat.sounds[audioNotification].play()
	}
}

// Send encrypted file.
function sendFile(nickname) {
	var sendFileDialog = Mustache.render(Cryptocat.templates.sendFile, {
		sendEncryptedFile: Cryptocat.locale['chatWindow']['sendEncryptedFile'],
		fileTransferInfo: Cryptocat.locale['chatWindow']['fileTransferInfo']
	})
	ensureOTRdialog(nickname, false, function() {
		Cryptocat.dialogBox(sendFileDialog, 240, true)
		$('#fileSelector').change(function(e) {
			e.stopPropagation()
			if (this.files) {
				var file = this.files[0]
				var filename = Cryptocat.random.encodedBytes(16, CryptoJS.enc.Hex)
				filename += file.name.match(/\.(\w)+$/)[0]
				Cryptocat.otr.keys[nickname].sendFile(filename)
				var key = Cryptocat.otr.fileKeys[nickname][filename]
				Cryptocat.otr.beginSendFile({
					file: file,
					filename: filename,
					to: nickname,
					key: key
				})
				;delete Cryptocat.otr.fileKeys[nickname][filename]
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

// If OTR fingerprints have not been generated, show a progress bar and generate them.
function ensureOTRdialog(nickname, close, cb) {
	if (nickname === Cryptocat.myNickname || Cryptocat.otr.keys[nickname].msgstate) {
		return cb()
	}
	var progressDialog = '<div id="progressBar"><div id="fill"></div></div>'
	Cryptocat.dialogBox(progressDialog, 240, true)
	$('#progressBar').css('margin', '70px auto 0 auto')
	$('#fill').animate({'width': '100%', 'opacity': '1'}, 10000, 'linear')
	// add some state for status callback
	Cryptocat.otr.keys[nickname].genFingerCb = [close, cb]
	Cryptocat.otr.keys[nickname].sendQueryMsg()
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
		otrFingerprint: Cryptocat.locale['chatWindow']['otrFingerprint'],
		groupFingerprint: Cryptocat.locale['chatWindow']['groupFingerprint'],
		authenticate: Cryptocat.locale['chatWindow']['authenticate'],
		verifyUserIdentity: Cryptocat.locale['chatWindow']['verifyUserIdentity'],
		secretQuestion: Cryptocat.locale['chatWindow']['secretQuestion'],
		secretAnswer: Cryptocat.locale['chatWindow']['secretAnswer'],
		ask: Cryptocat.locale['chatWindow']['ask'],
		identityVerified: Cryptocat.locale['chatWindow']['identityVerified']
	})
	ensureOTRdialog(nickname, false, function() {
		if ((Cryptocat.authenticatedUsers.indexOf(nickname) >= 0)
		|| (nickname === Cryptocat.myNickname)) {
			Cryptocat.dialogBox(infoDialog, 250, true)
			if (nickname !== Cryptocat.myNickname) {
				Cryptocat.showAuthenticated(nickname, 0)
			}
		}
		else {
			Cryptocat.dialogBox(infoDialog, 340, true)
			$('#authSubmit').unbind('click').bind('click', function(e) {
				e.preventDefault()
				var question = $('#authQuestion').val()
				var answer = $('#authAnswer').val().toLowerCase()
					.replace(/(\s|\.|\,|\'|\"|\;|\?|\!)/, '')
				if (answer.length === 0) {
					// a secret is required!
					return
				}
				$('#authSubmit').val(Cryptocat.locale['chatWindow']['asking'])
				$('#authSubmit').unbind('click').bind('click', function(e) {
					e.preventDefault()
				})
				Cryptocat.otr.keys[nickname].smpSecret(answer, question)
			})
		}
		$('#otrFingerprint').text(getFingerprint(nickname, 1))
		$('#multiPartyFingerprint').text(getFingerprint(nickname, 0))
	})
}

// Open a buddy's contact list context menu.
function openBuddyMenu(nickname) {
	if ($('#menu-' + nickname).attr('status') === 'active') {
		$('#menu-' + nickname).attr('status', 'inactive')
		$('#menu-' + nickname).css('background-image', 'url("img/down.png")')
		$('#buddy-' + nickname).animate({'height': 15}, 190)
		$('#' + nickname + '-contents').fadeOut(200, function() {
			$('#' + nickname + '-contents').remove()
		})
		return
	}
	var ignoreAction = Cryptocat.locale['chatWindow']['ignore']
	var buddyMenuContents = '<div class="buddyMenuContents" id="' + nickname + '-contents">'
	$('#menu-' + nickname).attr('status', 'active')
	$('#menu-' + nickname).css('background-image', 'url("img/up.png")')
	if (Cryptocat.ignoredUsers.indexOf(nickname) >= 0) {
		ignoreAction = Cryptocat.locale['chatWindow']['unignore']
	}
	$('#buddy-' + nickname).delay(10).animate({'height': 130}, 180, function() {
		$('#buddy-' + nickname).append(buddyMenuContents)
		$('#' + nickname + '-contents').append(
			Mustache.render(Cryptocat.templates.buddyMenu, {
				sendEncryptedFile: Cryptocat.locale['chatWindow']['sendEncryptedFile'],
				displayInfo: Cryptocat.locale['chatWindow']['displayInfo'],
				ignore: ignoreAction
			})
		)
		$('#' + nickname + '-contents').fadeIn(200)
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
			if (Cryptocat.ignoredUsers.indexOf(nickname) < 0) {
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
}

// Prepare our own encryption keys etc. before connecting for the first time.
function prepareKeysAndConnect() {
	if (Cryptocat.audioNotifications) {
		window.setTimeout(function() {
			Cryptocat.sounds.keygenLoop.loop = true
			Cryptocat.sounds.keygenLoop.play()
		}, 800)
	}
	// Create DSA key for OTR.
	DSA.createInWebWorker({
		path: 'js/workers/dsa.js',
		seed: Cryptocat.random.generateSeed
	}, function (key) {
		Cryptocat.otr.myKey = key
		// Key storage currently disabled as we are not yet sure if this is safe to do.
		//	Cryptocat.storage.setItem('myKey', JSON.stringify(Cryptocat.otr.myKey))
		$('#loginInfo').text(Cryptocat.locale['loginMessage']['connecting'])
		Cryptocat.xmpp.connect(
			Cryptocat.random.encodedBytes(16, CryptoJS.enc.Hex),
			Cryptocat.random.encodedBytes(16, CryptoJS.enc.Hex)
		)
	})
	// Key storage currently disabled as we are not yet sure if this is safe to do.
	// Cryptocat.storage.setItem('multiPartyKey', multiParty.genPrivateKey())
	//else {
	multiParty.genPrivateKey()
	//}
	multiParty.genPublicKey()
}

/*
-------------------
USER INTERFACE BINDINGS
-------------------
*/

// Buttons:
// Status button.
$('#status').click(function() {
	if ($(this).attr('src') === 'img/available.png') {
		$(this).attr('src', 'img/away.png')
		$(this).attr('alt', Cryptocat.locale['chatWindow']['statusAway'])
		$(this).attr('title', Cryptocat.locale['chatWindow']['statusAway'])
		Cryptocat.xmpp.currentStatus = 'away'
		Cryptocat.xmpp.sendStatus()
	}
	else {
		$(this).attr('src', 'img/available.png')
		$(this).attr('alt', Cryptocat.locale['chatWindow']['statusAvailable'])
		$(this).attr('title', Cryptocat.locale['chatWindow']['statusAvailable'])
		Cryptocat.xmpp.currentStatus = 'online'
		Cryptocat.xmpp.sendStatus()
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
			$(this).attr('alt', Cryptocat.locale['chatWindow']['desktopNotificationsOn'])
			$(this).attr('title', Cryptocat.locale['chatWindow']['desktopNotificationsOn'])
			Cryptocat.desktopNotifications = true
			Cryptocat.storage.setItem('desktopNotifications', 'true')
			if (window.webkitNotifications) {
				if (window.webkitNotifications.checkPermission()) {
					window.webkitNotifications.requestPermission(function() {})
				}
			}
		}
		else {
			$(this).attr('src', 'img/noNotifications.png')
			$(this).attr('alt', Cryptocat.locale['chatWindow']['desktopNotificationsOff'])
			$(this).attr('title', Cryptocat.locale['chatWindow']['desktopNotificationsOff'])
			Cryptocat.desktopNotifications = false
			Cryptocat.storage.setItem('desktopNotifications', 'false')
		}
	})
}

// Audio notifications button.
$('#audio').click(function() {
	if ($(this).attr('src') === 'img/noSound.png') {
		$(this).attr('src', 'img/sound.png')
		$(this).attr('alt', Cryptocat.locale['chatWindow']['audioNotificationsOn'])
		$(this).attr('title', Cryptocat.locale['chatWindow']['audioNotificationsOn'])
		Cryptocat.audioNotifications = true
		Cryptocat.storage.setItem('audioNotifications', 'true')
	}
	else {
		$(this).attr('src', 'img/noSound.png')
		$(this).attr('alt', Cryptocat.locale['chatWindow']['audioNotificationsOff'])
		$(this).attr('title', Cryptocat.locale['chatWindow']['audioNotificationsOff'])
		Cryptocat.audioNotifications = false
		Cryptocat.storage.setItem('audioNotifications', 'false')
	}
})

// Logout button.
$('#logout').click(function() {
	$('#loginInfo').text(Cryptocat.locale['loginMessage']['thankYouUsing'])
	$('#loginInfo').animate({'background-color': '#97CEEC'}, 200)
	Cryptocat.logout()
})

// Submit user input.
$('#userInput').submit(function() {
	var message = $.trim($('#userInputText').val())
	$('#userInputText').val('')
	if (!message.length) { return false }
	if (Cryptocat.currentConversation !== 'main-Conversation') {
		Cryptocat.otr.keys[Cryptocat.currentConversation].sendMsg(message)
	}
	else {
		if (multiParty.userCount() < 1) { return false }
		var ciphertext = JSON.parse(multiParty.sendMessage(message))
		var missingRecipients = []
		for (var i = 0; i !== buddyList.length; i++) {
			if (typeof(ciphertext['text'][buddyList[i]]) !== 'object') {
				missingRecipients.push(buddyList[i])
			}
		}
		if (missingRecipients.length) {
			Cryptocat.addToConversation(
				missingRecipients, Cryptocat.myNickname,
				'main-Conversation', 'missingRecipients'
			)
		}
		Cryptocat.xmpp.connection.muc.message(
			Cryptocat.conversationName + '@' + Cryptocat.xmpp.conferenceServer,
			null, JSON.stringify(ciphertext), null, 'groupchat', 'active'
		)
	}
	Cryptocat.addToConversation(
		message, Cryptocat.myNickname,
		Cryptocat.currentConversation, 'message'
	)
	return false
})

// User input key event detection.
// (Message submission, nick completion...)
$('#userInputText').keydown(function(e) {
	if (e.keyCode === 9) {
		e.preventDefault()
		var nickname, match, suffix
		for (nickname in Cryptocat.otr.keys) {
			if (Cryptocat.otr.keys.hasOwnProperty(nickname)) {
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
	if (Cryptocat.currentConversation === 'main-Conversation') {
		destination = null
		type = 'groupchat'
	}
	else {
		destination = Cryptocat.currentConversation
		type = 'chat'
	}
	if (paused === false) {
		Cryptocat.xmpp.connection.muc.message(
			Cryptocat.conversationName + '@' + Cryptocat.xmpp.conferenceServer,
			destination, '', null, type, 'composing'
		)
	}
	window.clearTimeout(paused)
	paused = window.setTimeout(function(d, t) {
		Cryptocat.xmpp.connection.muc.message(
			Cryptocat.conversationName + '@' + Cryptocat.xmpp.conferenceServer,
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
	$('#' + Cryptocat.locale['language']).css({'color': '#97CEEC', 'font-weight': 'bold'})
	$('#footer').animate({'height': 180}, function() {
		$('#languages').fadeIn()
	})
	$('#languages li').click(function() {
		var lang = $(this).attr('id')
		$('#languages').fadeOut(200, function() {
			Cryptocat.locale.set(lang)
			Cryptocat.storage.setItem('language', lang)
			$('#footer').animate({'height': 14})
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
		Cryptocat.loginFail(Cryptocat.locale['loginMessage']['enterConversation'])
		$('#conversationName').select()
	}
	else if (!$('#conversationName').val().match(/^\w{1,20}$/)) {
		Cryptocat.loginFail(Cryptocat.locale['loginMessage']['conversationAlphanumeric'])
		$('#conversationName').select()
	}
	else if ($('#nickname').val() === '') {
		Cryptocat.loginFail(Cryptocat.locale['loginMessage']['enterNickname'])
		$('#nickname').select()
	}
	else if (!$('#nickname').val().match(/^\w{1,16}$/)) {
		Cryptocat.loginFail(Cryptocat.locale['loginMessage']['nicknameAlphanumeric'])
		$('#nickname').select()
	}
	// If no encryption keys, prepare keys before connecting.
	else if (!Cryptocat.otr.myKey) {
		var progressForm = Mustache.render(Cryptocat.templates.generatingKeys, {
			text: Cryptocat.locale['loginMessage']['generatingKeys']
		})
		if (Cryptocat.audioNotifications) { Cryptocat.sounds.keygenStart.play() }
		Cryptocat.dialogBox(progressForm, 240, false, prepareKeysAndConnect())
		if (Cryptocat.locale['language'] === 'en') {
			$('#progressInfo').append(
				Mustache.render(Cryptocat.templates.catFact, {
					catFact: CatFacts.getFact()
				})
			)
		}
		$('#progressInfo').append(
			'<div id="progressBar"><div id="fill"></div></div>'
		)
		CatFacts.interval = window.setInterval(function() {
			$('#interestingFact').fadeOut(function() {
				$(this).text(CatFacts.getFact()).fadeIn()
			})
		}, 9000)
		$('#fill').animate({'width': '100%', 'opacity': '1'}, 14000, 'linear')
	}
	// If everything is okay, then register a randomly generated throwaway XMPP ID and log in.
	else {
		Cryptocat.xmpp.connect(
			Cryptocat.random.encodedBytes(16, CryptoJS.enc.Hex),
			Cryptocat.random.encodedBytes(16, CryptoJS.enc.Hex)
		)
	}
	return false
})

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
	if (buddyList.length) {
		return Cryptocat.locale['loginMessage']['thankYouUsing']
	}
})

// Logout on browser close.
$(window).unload(function() {
	if (Cryptocat.xmpp.connection !== null) {
		Cryptocat.xmpp.connection.disconnect()
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
