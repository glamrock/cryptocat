var Cryptocat = function() {};
Cryptocat.version = '2.0.42'; // Version number
Cryptocat.fileSize = 5120; // Maximum encrypted file sharing size, in kilobytes.
Cryptocat.chunkSize = 64511; // Size in which file chunks are split, in bytes.
Cryptocat.fileKeys = {}
Cryptocat.connection = null;
Cryptocat.domain = null;
Cryptocat.conferenceServer = null;
Cryptocat.bosh = null;
Cryptocat.conversationName = null;
Cryptocat.myNickname = null;

if (typeof(window) !== 'undefined') { $(window).ready(function() {

/* Configuration */
// Domain name to connect to for XMPP.
var defaultDomain = 'crypto.cat';
// Address of the XMPP MUC server.
var defaultConferenceServer = 'conference.crypto.cat';
// BOSH is served over an HTTPS proxy for better security and availability.
var defaultBOSH = 'https://crypto.cat/http-bind';
var localStorageEnabled = true; 
if (navigator.userAgent.match('Firefox')) {
	localStorageEnabled = false;
}

/* Initialization */
var otrKeys = {};
var conversations = {};
var loginCredentials = [];
var currentConversation = 0;
var audioNotifications = 0;
var desktopNotifications = 0;
var buddyNotifications = 0;
var loginError = 0;
var currentStatus = 'online';
var soundEmbed = null;
var myKey;

// Set server information to defaults
Cryptocat.domain = defaultDomain;
Cryptocat.conferenceServer = defaultConferenceServer;
Cryptocat.bosh = defaultBOSH;

// Set version number in UI
$('#version').text(Cryptocat.version);

// Seed RNG
Cryptocat.setSeed(Cryptocat.generateSeed());

// Initialize language settings
if (!localStorageEnabled) {
	Language.set(window.navigator.language.toLowerCase());
}

// If localStorage is implemented, load saved settings
if (localStorageEnabled) {
	// Load language settings
	if (localStorage.getItem('language')) {
		Language.set(localStorage.getItem('language'));
	}
	else {
		Language.set(window.navigator.language.toLowerCase());
	}
	// Load nickname settings
	if (localStorage.getItem('myNickname')) {
		window.setTimeout(function() {
			$('#nickname').animate({'color': 'transparent'}, function() {
				$(this).val(localStorage.getItem('myNickname'));
				$(this).animate({'color': '#FFF'});
			});
		}, 0);
	}
	// Load notification settings
	if (localStorage.getItem('desktopNotifications') === '1') {
		$('#notifications').click();
	}
	if (localStorage.getItem('audioNotifications') === '1') {
		$('#audio').click();
	}
	// Load custom server settings
	if (localStorage.getItem('domain')) {
		Cryptocat.domain = localStorage.getItem('domain');
	}
	if (localStorage.getItem('conferenceServer')) {
		Cryptocat.conferenceServer = localStorage.getItem('conferenceServer');
	}
	if (localStorage.getItem('bosh')) {
		Cryptocat.bosh = localStorage.getItem('bosh');
	}
	// Load pre-existing encryption keys
	// Key storage currently disabled as we are not yet sure if this is safe to do.
	/* if (localStorage.getItem('myKey') !== null) {
		myKey = new DSA(JSON.parse(localStorage.getItem('myKey')));
		multiParty.setPrivateKey(localStorage.getItem('multiPartyKey'));
		multiParty.genPublicKey();
	} */
}

// Initialize workers
var keyGenerator = new Worker('js/workers/keyGenerator.js');
keyGenerator.onmessage = function(e) {
	myKey = new DSA(e.data);
	// Key storage currently disabled as we are not yet sure if this is safe to do.
	//if (localStorageEnabled) {
	//	localStorage.setItem('myKey', JSON.stringify(myKey));
	//}
	$('#fill').stop().animate({'width': '100%', 'opacity': '1'}, 400, 'linear', function() {
		$('#loginInfo').text(Cryptocat.language['loginMessage']['connecting']);
		$('#dialogBoxClose').click();
	});
}

// Outputs the current hh:mm.
// If `seconds = 1`, outputs hh:mm:ss.
function currentTime(seconds) {
	var date = new Date();
	var time = [];
	time.push(date.getHours().toString());
	time.push(date.getMinutes().toString());
	if (seconds) {
		time.push(date.getSeconds().toString());
	}
	for (var just in time) {
		if (time[just].length === 1) {
			time[just] = '0' + time[just];
		}
	}
	return time.join(':');
}

// Plays the audio file defined by the `audio` variable.
function playSound(audio) {
	(new Audio('snd/' + audio + '.wav')).play();
}

// Scrolls down the chat window to the bottom in a smooth animation.
// 'speed' is animation speed in milliseconds.
function scrollDown(speed) {
	$('#conversationWindow').animate({
		scrollTop: $('#conversationWindow')[0].scrollHeight + 20
	}, speed);
}

// Initiates a conversation. Internal use.
function initiateConversation(conversation) {
	if (!conversations.hasOwnProperty(conversation)) {
		conversations[conversation] = '';
	}
}

// OTR functions
// Handle incoming messages
var uicb = function(buddy) {
	return function(msg) {
		Cryptocat.addToConversation(msg, buddy, buddy);
	}
}

// Handle outgoing messages
var iocb = function(buddy) {
	return function(message) {
		Cryptocat.connection.muc.message(Cryptocat.conversationName + '@' + Cryptocat.conferenceServer, buddy, message, null);
	}
}

// Creates a template for the conversation info bar at the top of each conversation.
function buildConversationInfo(conversation) {
	$('#conversationInfo').html(
		'<span class="conversationUserCount">' + $('.buddy').length + '</span>'
		+ '<span class="conversationName">' + Cryptocat.myNickname + '@' + Cryptocat.conversationName + '</span>'
	);
	if (conversation === 'main-Conversation') {
		$('#conversationInfo').append(
			'<span id="groupConversation">' + Cryptocat.language['chatWindow']['groupConversation'] + '</span>'
		);
	}
}

// Switches the currently active conversation to `buddy'
function switchConversation(buddy) {
	if ($('#buddy-' + buddy).attr('status') !== 'offline') {
		$('#' + buddy).animate({'background-color': '#97CEEC'});
		$('#buddy-' + buddy).css('border-bottom', '1px solid #72B1DB');
	}
	if (buddy !== 'main-Conversation') {
		$('#buddy-' + buddy).css('background-image', 'none');
	}
	$('#conversationInfo').slideDown(function() {
		buildConversationInfo(currentConversation);
		$('#conversationWindow').slideDown('fast', function() {
			$('#userInput').fadeIn('fast', function() {
				$('#userInputText').focus();
			});
			var scrollWidth = document.getElementById('conversationWindow').scrollWidth;
			$('#conversationWindow').css('width', (712 + scrollWidth) + 'px');
			scrollDown(600);
		});
		$(window).resize();
	});
	// Clean up finished conversations
	$('#buddyList div').each(function() {
		if (($(this).attr('id') !== ('buddy-' + currentConversation))
			&& ($(this).css('background-image') === 'none')
			&& ($(this).attr('status') === 'offline')) {
			$(this).slideUp(500, function() {
				$(this).remove();
				updateUserCount();
			});
		}
	});
}

// Handles login failures
function loginFail(message) {
	buddyNotifications = 0;
	$('#loginInfo').text(message);
	$('#bubble').animate({'left': '+=5px'}, 130)
		.animate({'left': '-=10px'}, 130)
		.animate({'left': '+=5px'}, 130);
	$('#loginInfo').animate({'color': '#E93028'}, 'fast');
}

// Simply shortens a string `string` to length `length.
// Adds '..' to delineate that string was shortened.
function shortenString(string, length) {
	if (string.length > length) {
		return string.substring(0, (length - 2)) + '..';
	}
	return string;
}

// Clean nickname so that it's safe to use.
function cleanNickname(nickname) {
	var clean = nickname.match(/\/([\s\S]+)/);
	if (clean) {
		clean = Strophe.xmlescape(clean[1]);
	} else {
		return false;
	}
	if (clean.match(/\W/)) {
		return false;
	}
	return clean;
}

// Get a fingerprint, formatted for readability
function getFingerprint(buddy, OTR) {
	var fingerprint;
	if (OTR) {
		if (buddy === Cryptocat.myNickname) {
			fingerprint = myKey.fingerprint();
		}
		else {
			fingerprint = otrKeys[buddy].their_priv_pk.fingerprint();
		}
	}
	else {
		if (buddy === Cryptocat.myNickname) {
			fingerprint = multiParty.genFingerprint();
		}
		else {
			fingerprint = multiParty.genFingerprint(buddy);
		}
	}
	var formatted = '';
	for (var i in fingerprint) {
		if ((i !== 0) && !(i % 8)) {
			formatted += ' ';
		}
		formatted += fingerprint[i];
	}
	return formatted.toUpperCase();
}

// Convert message URLs to links. Used internally.
function addLinks(message) {
	if ((URLs = message.match(/(((news|(ht|f)tp(s?))\:\/\/){1}\S+)/gi))) {
		for (var i in URLs) {
			var sanitize = URLs[i].split('');
			for (var l in sanitize) {
				if (!sanitize[l].match(/\w|\d|\:|\/|\?|\=|\#|\+|\,|\.|\&|\;|\%/)) {
					sanitize[l] = encodeURIComponent(sanitize[l]);
				}
			}
			sanitize = sanitize.join('');
			var processed = sanitize.replace(':','&colon;');
			message = message.replace(sanitize, '<a target="_blank" href="' + processed + '">' + processed + '</a>');		
		}
	}
	return message;
}

// Convert text emoticons to graphical emoticons.
function addEmoticons(message) {
	return message
		.replace(/(\s|^)(:|(=))-?3(?=(\s|$))/gi, ' <div class="emoticon" id="eCat">$&</div> ')
		.replace(/(\s|^)(:|(=))-?\&apos;\((?=(\s|$))/gi, ' <div class="emoticon" id="eCry">$&</div> ')
		.replace(/(\s|^)(:|(=))-?o(?=(\s|$))/gi, ' <div class="emoticon" id="eGasp">$&</div> ')
		.replace(/(\s|^)(:|(=))-?D(?=(\s|$))/gi, ' <div class="emoticon" id="eGrin">$&</div> ')
		.replace(/(\s|^)(:|(=))-?\((?=(\s|$))/gi, ' <div class="emoticon" id="eSad">$&</div> ')
		.replace(/(\s|^)(:|(=))-?\)(?=(\s|$))/gi, ' <div class="emoticon" id="eSmile">$&</div> ')
		.replace(/(\s|^)-_-(?=(\s|$))/gi, ' <div class="emoticon" id="eSquint">$&</div> ')
		.replace(/(\s|^)(:|(=))-?p(?=(\s|$))/gi, ' <div class="emoticon" id="eTongue">$&</div> ')
		.replace(/(\s|^)(:|(=))-?(\/|s)(?=(\s|$))/gi, ' <div class="emoticon" id="eUnsure">$&</div> ')
		.replace(/(\s|^);-?\)(?=(\s|$))/gi, ' <div class="emoticon" id="eWink">$&</div> ')
		.replace(/(\s|^);-?\p(?=(\s|$))/gi, ' <div class="emoticon" id="eWinkTongue">$&</div> ')
		.replace(/(\s|^)\^(_|\.)?\^(?=(\s|$))/gi, ' <div class="emoticon" id="eHappy">$&</div> ')
		.replace(/(\s|^)(:|(=))-?x\b(?=(\s|$))/gi, ' <div class="emoticon" id="eShut">$&</div> ')
		.replace(/(\s|^)\&lt\;3\b(?=(\s|$))/g, ' <span class="monospace">&#9829;</span> ');
}

// Update a file transfer progress bar.
Cryptocat.updateFileProgressBar = function(file, chunk, size, recipient) {
	progress = (chunk * 100) / (Math.ceil(size / Cryptocat.chunkSize));
	if (progress > 100) { progress = 100 };
	$('[file=' + file + '] .fileProgressBarFill').animate({'width': progress + '%'});
	var conversationBuffer = $(conversations[recipient]);
	conversationBuffer.find('[file=' + file + '] .fileProgressBarFill').width(progress + '%');
	conversations[recipient] = $('<div>').append($(conversationBuffer).clone()).html();
}

// Convert Data blob to downloadable file, replacing the progress bar.
Cryptocat.addFile = function(blob, file, conversation, filename) {
	var conversationBuffer = $(conversations[conversation]);
	var fileLink = '<a href="' + blob
		+ '" class="fileView" target="_blank" download="' + filename + '">'
		+ Cryptocat.language['chatWindow']['downloadFile'] + '</a>';
	$('[file=' + file + ']').replaceWith(fileLink);
	conversationBuffer.find('[file=' + file + ']').replaceWith(fileLink);
	conversations[conversation] = $('<div>').append($(conversationBuffer).clone()).html();
}

// Add a `message` from `sender` to the `conversation` display and log.
// If `isFile`, then we are adding a recieved file to the conversation,
// not a typical message.
Cryptocat.addToConversation = function(message, sender, conversation, isFile) {
	if (!message) {
		return false;
	}
	initiateConversation(conversation);
	if (sender === Cryptocat.myNickname) {
		lineDecoration = 1;
		message = Strophe.xmlescape(message);
	}
	else {
		lineDecoration = 2;
		if (audioNotifications) {
			playSound('msgGet');
		}
		if (!document.hasFocus()) {
			desktopNotification('img/keygen.gif', sender, message, 0x1337);
		}
		message = Strophe.xmlescape(message);
		if (message.match(Cryptocat.myNickname)) {
			var nickRegEx = new RegExp(Cryptocat.myNickname, 'g');
			message = message.replace(nickRegEx, '<span class="nickHighlight">$&</span>');
			lineDecoration = 3;
		}
	}
	if (isFile) {
		message = '<div class="fileProgressBar" file="' + message + '"><div class="fileProgressBarFill"></div></div>'
	}
	else {
		message = addLinks(message);
		message = addEmoticons(message);
	}
	message = message.replace(/:/g, '&#58;');
	var timeStamp = '<span class="timeStamp">' + currentTime(0) + '</span>';
	sender = '<span class="sender">' + Strophe.xmlescape(shortenString(sender, 16)) + '</span>';
	if (conversation === currentConversation) {
		message = '<div class="Line' + lineDecoration + '">' + timeStamp + sender + message + '</div>';
		conversations[conversation] += message;
		var width = $(window).width() - $('#buddyWrapper').width();
		$('#conversationWindow').append(message);
		$('.Line' + lineDecoration).last()
			.css('width', width - 60)
			.animate({'margin-top': '20px', 'opacity': '1'}, 'fast');
		if (($('#conversationWindow')[0].scrollHeight - $('#conversationWindow').scrollTop()) < 1500) {	
			scrollDown(400);
		}
	}
	else {
		message = '<div class="Line' + lineDecoration + '">' + timeStamp + sender + message + '</div>';
		conversations[conversation] += message;
		iconNotify(conversation);
	}
}

function iconNotify(conversation) {
	var backgroundColor = $('#buddy-' + conversation).css('background-color');
	$('#buddy-' + conversation).css('background-image', 'url("img/newMessage.png")');
	$('#buddy-' + conversation)
		.animate({'backgroundColor': '#A7D8F7'})
		.animate({'backgroundColor': backgroundColor});
}

function desktopNotification(image, title, body, timeout) {
	if (desktopNotifications) {
		if (navigator.userAgent.match('Sentenza')) {
			Stz.notifyMe_({'title': 'Cryptocat', subtitle: title, content: body});
			return true;
		}
		var notice = window.webkitNotifications.createNotification(image, title, body);
		notice.show();
		if (timeout > 0) {
			window.setTimeout(function() {
				notice.cancel();
			}, timeout);
		}
	}
}

// Add a join/part notification to the main conversation window.
// If 'join === 1', shows join notification, otherwise shows part
function buddyNotification(buddy, join) {
	var status, audioNotification;
	if (join) {
		status = '<div class="userJoin"><strong>+</strong>' + buddy + '</div>';
		audioNotification = 'userOnline';
	}
	else {
		status = '<div class="userLeave"><strong>-</strong>' + buddy + '</div>';
		audioNotification = 'userOffline';
	}
	conversations['main-Conversation'] += status;
	if (currentConversation !== 'main-Conversation') {
		conversations[currentConversation] += status;
	}
	$('#conversationWindow').append(status);
	if (($('#conversationWindow')[0].scrollHeight - $('#conversationWindow').scrollTop()) < 1500) {	
		scrollDown(400);
	}
	if (!document.hasFocus()) {
		desktopNotification('img/keygen.gif', buddy, '', 0x1337);
	}
	if (audioNotifications) {
		playSound(audioNotification);
	}
}

// Update user count for display in conversation info bar.
function updateUserCount() {
	if ($('.conversationUserCount').text() !== $('.buddy').length.toString()) {
		$('.conversationUserCount').animate({'color': '#70B9E0'}, function() {
			$(this).text($('.buddy').length);
			$(this).animate({'color': '#FFF'});
		});	
	}
}

// Build new buddy
function addBuddy(nickname) {
	$('#buddyList').queue(function() {
		var buddyTemplate = '<div class="buddy" title="' + nickname + '" id="buddy-' 
			+ nickname + '" status="online"><span>' + nickname + '</span>'
			+ '<div class="buddyMenu" id="menu-' + nickname + '"></div></div>'
		$(buddyTemplate).insertAfter('#buddiesOnline').slideDown(100, function() {
			$('#buddy-' + nickname).unbind('click');
			$('#menu-' + nickname).unbind('click');
			bindBuddyMenu(nickname);
			bindBuddyClick(nickname);
			updateUserCount();
			var sendPublicKey = multiParty.sendPublicKey(nickname);
			Cryptocat.connection.muc.message(
				Cryptocat.conversationName + '@' + Cryptocat.conferenceServer, null,
				sendPublicKey, null
			);
			if (buddyNotifications) {
				buddyNotification(nickname, true);
			}
		});
	});
	$('#buddyList').dequeue();
}

// Handle buddy going offline
function removeBuddy(nickname) {
	// Delete their encryption keys
	delete otrKeys[nickname];
	multiParty.removeKeys(nickname);
	if (($('#buddy-' + nickname).length !== 0)
		&& ($('#buddy-' + nickname).attr('status') !== 'offline')) {
		if ((currentConversation !== nickname)
			&& ($('#buddy-' + nickname).css('background-image') === 'none')) {
			$('#buddy-' + nickname).slideUp(500, function() {
				$(this).remove();
				updateUserCount();
			});
		}
		else {
			$('#buddy-' + nickname).attr('status', 'offline');
			$('#buddy-' + nickname).animate({
				'color': '#BBB',
				'backgroundColor': '#222',
				'borderLeftColor': '#111',
				'borderBottom': 'none'
			});
		}
	}
	if (buddyNotifications) {
		buddyNotification(nickname, false);
	}
}

// Handle nickname change (which may be done by non-Cryptocat XMPP clients)
function changeNickname(oldNickname, newNickname) {
	otrKeys[newNickname] = otrKeys[oldNickname];
	multiParty.renameKeys(oldNickname, newNickname);
	conversations[newNickname] = conversations[oldNickname];
	removeBuddy(oldNickname);
}

// Handle incoming messages from the XMPP server.
function handleMessage(message) {
	var nickname = cleanNickname($(message).attr('from'));
	var body = $(message).find('body').text().replace(/\&quot;/g, '"');
	var type = $(message).attr('type');
	// If archived message, ignore.
	if ($(message).find('delay').length !== 0) {
		return true;
	}
	// If message is from me, ignore.
	if (nickname === Cryptocat.myNickname) {
		return true;
	}
	// If message is from someone not on buddy list, ignore.
	if (!$('#buddy-' + nickname).length) {
		return true;
	}
	if (type === 'groupchat') {
		body = multiParty.receiveMessage(nickname, Cryptocat.myNickname, body);
		if (typeof(body) === 'string') {
			Cryptocat.addToConversation(body, nickname, 'main-Conversation');
		}
	}
	else if (type === 'chat') {
		otrKeys[nickname].receiveMsg(body);
	}
	return true;
}

// Handle incoming presence updates from the XMPP server.
function handlePresence(presence) {
	var nickname = cleanNickname($(presence).attr('from'));
	// If invalid nickname, do not process
	if ($(presence).attr('type') === 'error') {
		if ($(presence).find('error').attr('code') === '409') {
			// Delay logout in order to avoid race condition with window animation
			window.setTimeout(function() {
				loginError = 1;
				logout();
				loginFail(Cryptocat.language['loginMessage']['nicknameInUse']);
			}, 3000);
			return false;
		}
		return true;
	}
	// Ignore if presence status is coming from myself
	if (nickname === Cryptocat.myNickname) {
		return true;
	}
	// Detect nickname change (which may be done by non-Cryptocat XMPP clients)
	if ($(presence).find('status').attr('code') === '303') {
		var newNickname = cleanNickname('/' + $(presence).find('item').attr('nick'));
		changeNickname(nickname, newNickname);
		return true;
	}
	// Add to otrKeys if necessary
	if (nickname !== 'main-Conversation' && !otrKeys.hasOwnProperty(nickname)) {
		var options = {
		// 	fragment_size: 8192,
		// 	send_interval: 400,
			priv: myKey
		};
		otrKeys[nickname] = new OTR(options);
		otrKeys[nickname].REQUIRE_ENCRYPTION = true;
		otrKeys[nickname].on('ui', uicb(nickname));
		otrKeys[nickname].on('io', iocb(nickname));
		otrKeys[nickname].on('error', function(err) {
		console.log('OTR error: ' + err);
	});
	otrKeys[nickname].on('status', (function(nickname) {
		return function(state) {
			// close generating fingerprint dialog after AKE
			if (otrKeys[nickname].genFingerCb
			&& state === OTR.CONST.STATUS_AKE_SUCCESS) {
				closeGenerateFingerprints(nickname, otrKeys[nickname].genFingerCb);
				delete otrKeys[nickname].genFingerCb;
			}
		};
	}(nickname)));
	otrKeys[nickname].on('file', (function (nickname) {
		return function(type, key, filename) {
			// make two keys, for encrypt then mac
			key = CryptoJS.SHA512(CryptoJS.enc.Latin1.parse(key));
			key = key.toString(CryptoJS.enc.Latin1);
			if (!Cryptocat.fileKeys[nickname]) {
				Cryptocat.fileKeys[nickname] = {};
			}
			Cryptocat.fileKeys[nickname][filename] = [
				key.substring(0, 32), key.substring(32)
			];
		};
	})(nickname));
	}
	// Detect buddy going offline
	if ($(presence).attr('type') === 'unavailable') {
		removeBuddy(nickname);
		return true;
	}
	// Create buddy element if buddy is new
	else if (!$('#buddy-' + nickname).length) {
		addBuddy(nickname);
	}
	// Handle buddy status change to 'available'
	else if ($(presence).find('show').text() === '' || $(presence).find('show').text() === 'chat') {
		if ($('#buddy-' + nickname).attr('status') !== 'online') {
			var status = 'online';
			var backgroundColor = '#72B1DB';
			var placement = '#buddiesOnline';
		}
	}
	// Handle buddy status change to 'away'
	else if ($('#buddy-' + nickname).attr('status') !== 'away') {
			var status = 'away';
			var backgroundColor = '#5588A5';
			var placement = '#buddiesAway';
	}
	// Perform status change
	$('#buddy-' + nickname).attr('status', status);
	if (placement) {
		$('#buddy-' + nickname).animate({
			'color': '#FFF',
			'backgroundColor': backgroundColor,
			'borderLeftColor': '#97CEEC'
		});
		if (currentConversation !== nickname) {
			$('#buddy-' + nickname).slideUp('fast', function() {
				$(this).insertAfter(placement).slideDown('fast');
			});
		}
	}
	return true;
}

// Bind buddy click actions. Used internally.
function bindBuddyClick(nickname) {
	$('#buddy-' + nickname).click(function() {
		if ($(this).prev().attr('id') === 'currentConversation') {
			$('#userInputText').focus();
			return true;
		}
		if (nickname !== 'main-Conversation') {
			$(this).css('background-image', 'none');
		}
		else {
			$(this).css('background-image', 'url("img/groupChat.png")');
		}
		if (currentConversation) {
			var oldConversation = currentConversation;
			if ($('#buddy-' + oldConversation).attr('status') === 'online') {
				var placement = '#buddiesOnline';
				var backgroundColor = '#72B1DB';
				var color = '#FFF';
			}
			else if ($('#buddy-' + oldConversation).attr('status') === 'away') {
				var placement = '#buddiesAway';
				var backgroundColor = '#5588A5';
				var color = '#FFF';
			}
			$('#buddy-' + oldConversation).slideUp('fast', function() {
				$(this).css('background-color', backgroundColor);
				$(this).css('color', color);
				$(this).css('border-bottom', 'none');
				$(this).insertAfter(placement).slideDown('fast');
			});
		}
		currentConversation = nickname;
		initiateConversation(currentConversation);
		$('#conversationWindow').html(conversations[currentConversation]);
		$('.Line1, .Line2, .Line3').addClass('visibleLine');
		$(window).resize();
		if (($(this).prev().attr('id') === 'buddiesOnline')
			|| (($(this).prev().attr('id') === 'buddiesAway')
			&& $('#buddiesOnline').next().attr('id') === 'buddiesAway')) {
			$(this).insertAfter('#currentConversation');
			$(this).animate({'background-color': '#97CEEC'});
			switchConversation(nickname);
		}
		else {
			$(this).slideUp('fast', function() {
				$(this).insertAfter('#currentConversation').slideDown('fast', function() {
					$(this).animate({'background-color': '#97CEEC'});
					switchConversation(nickname);
				});
			});
		}
	});
}

// Send encrypted file
function sendFile(nickname) {
	var sendFileDialog = '<div class="bar">' + Cryptocat.language['chatWindow']['sendEncryptedFile'] + '</div>'
		+ '<input type="file" id="fileSelector" name="file[]" />'
		+ '<input type="button" id="fileSelectButton" class="button" value="Select file" />'
		+ '<div id="fileInfoField">' + Cryptocat.language['chatWindow']['fileTransferInfo'] + '</div>';
	ensureOTRdialog(nickname, false, function() {
		dialogBox(sendFileDialog, 1);
		$('#fileSelector').change(function(e) {
			e.stopPropagation();
			if (this.files) {
				var file = this.files[0];
				otrKeys[nickname].sendFile(file.name);
				var key = Cryptocat.fileKeys[nickname][file.name];
				Cryptocat.beginSendFile({
					file: file,
					to: nickname,
					key: key
				});
				delete Cryptocat.fileKeys[nickname][file.name];
			}
		});
		$('#fileSelectButton').click(function() {
			$('#fileSelector').click();
		});
	});
}

// Display info dialog
function displayInfoDialog(nickname) {
	return '<input type="button" class="bar" value="'
		+ nickname + '"/><div id="displayInfo">'
		+ Cryptocat.language['chatWindow']['otrFingerprint']
		+ '<br /><span id="otrFingerprint"></span><br />'
		+ '<div id="otrColorprint"></div>'
		+ Cryptocat.language['chatWindow']['groupFingerprint']
		+ '<br /><span id="multiPartyFingerprint"></span><br />'
		+ '<div id="multiPartyColorprint"></div><br /></div>';
}

// Close generating fingerprints dialog
function closeGenerateFingerprints(nickname, arr) {
	var close = arr[0];
	var cb = arr[1];
	$('#fill').stop().animate({'width': '100%', 'opacity': '1'}, 400, 'linear', function() {
		$('#dialogBoxContent').fadeOut(function() {
			$(this).empty().show();
			if (close) {
				$('#dialogBoxClose').click();
			}
			cb();
		});
	});
}

// If OTR fingerprints have not been generated, show a progress bar and generate them.
function ensureOTRdialog(nickname, close, cb) {
	if (nickname === Cryptocat.myNickname || otrKeys[nickname].msgstate) return cb();
	var progressDialog = '<div id="progressBar"><div id="fill"></div></div>';
	dialogBox(progressDialog, 1);
	$('#progressBar').css('margin', '70px auto 0 auto');
	$('#fill').animate({'width': '100%', 'opacity': '1'}, 8000, 'linear');
	// add some state for status callback
	otrKeys[nickname].genFingerCb = [close, cb];
	otrKeys[nickname].sendQueryMsg();
}

// Display buddy information, including fingerprints etc.
function displayInfo(nickname) {
	nickname = Strophe.xmlescape(nickname);
	ensureOTRdialog(nickname, false, function() {
		dialogBox(displayInfoDialog(nickname), 1);
		showFingerprints(nickname);
	});
}

// Show fingerprints internal function
function showFingerprints(nickname) {
	$('#otrFingerprint').text(getFingerprint(nickname, 1));
	$('#multiPartyFingerprint').text(getFingerprint(nickname, 0));
	var otrColorprint = getFingerprint(nickname, 1).split(' ');
	otrColorprint.splice(0, 1);
	for (var color in otrColorprint) {
		$('#otrColorprint').append(
			'<div class="colorprint" style="background:#'
			+ otrColorprint[color].substring(0, 6) + '"></div>'
		);
	}
	var multiPartyColorprint = getFingerprint(nickname, 0).split(' ');
	multiPartyColorprint.splice(0, 1);
	for (var color in multiPartyColorprint) {
		$('#multiPartyColorprint').append(
			'<div class="colorprint" style="background:#'
			+ multiPartyColorprint[color].substring(0, 6) + '"></div>'
		);
	}
}

// Bind buddy menus for new buddies. Used internally.
function bindBuddyMenu(nickname) {
	nickname = Strophe.xmlescape(nickname);
	$('#menu-' + nickname).attr('status', 'inactive');
	$('#menu-' + nickname).click(function(e) {
		e.stopPropagation();
		if ($('#menu-' + nickname).attr('status') === 'inactive') {
			$('#menu-' + nickname).attr('status', 'active');
			var buddyMenuContents = '<div class="buddyMenuContents" id="' + nickname + '-contents">';
			$(this).css('background-image', 'url("img/up.png")');
			$('#buddy-' + nickname).delay(10).animate({'height': '44px'}, 180, function() {
				$(this).append(buddyMenuContents);
				$('#' + nickname + '-contents').append(
					'<li class="option1">' + Cryptocat.language['chatWindow']['sendEncryptedFile'] + '</li>'
				);
				$('#' + nickname + '-contents').append(
					'<li class="option2">' + Cryptocat.language['chatWindow']['displayInfo'] + '</li>'
				);
				$('#' + nickname + '-contents').fadeIn('fast', function() {
					$('.option1').click(function(e) {
						e.stopPropagation();
						sendFile(nickname);
						$('#menu-' + nickname).click();
					});
					$('.option2').click(function(e) {
						e.stopPropagation();
						displayInfo(nickname);
						$('#menu-' + nickname).click();
					});
				});
			});
		}
		else {
			$('#menu-' + nickname).attr('status', 'inactive');
			$(this).css('background-image', 'url("img/down.png")');
			$('#buddy-' + nickname).animate({'height': '15px'}, 190);
			$('#' + nickname + '-contents').fadeOut('fast', function() {
				$('#' + nickname + '-contents').remove();
			});
		}
	});
}

// Send your current status to the XMPP server.
function sendStatus() {
	if (currentStatus === 'away') {
		Cryptocat.connection.muc.setStatus(Cryptocat.conversationName + '@' + Cryptocat.conferenceServer, Cryptocat.myNickname, 'away', 'away');
	}
	else {
		Cryptocat.connection.muc.setStatus(Cryptocat.conversationName + '@' + Cryptocat.conferenceServer, Cryptocat.myNickname, '', '');
	}
}

// Displays a pretty dialog box with `data` as the content HTML.
// If `closeable = 1`, then the dialog box has a close button on the top right.
// onAppear may be defined as a callback function to execute on dialog box appear.
// onClose may be defined as a callback function to execute on dialog box close.
function dialogBox(data, closeable, onAppear, onClose) {
	if ($('#dialogBox').css('top') !== '-450px') {
		$('#dialogBoxContent').html(data);
		return false;
	}
	if (closeable) {
		$('#dialogBoxClose').css('width', '18px');
		$('#dialogBoxClose').css('font-size', '12px');
	}
	$('#dialogBoxContent').html(data);
	$('#dialogBox').animate({'top': '+=440px'}, 'fast').animate({
		'top': '-=10px'
	}, 'fast', function() {
		if (onAppear) {
			onAppear();
		}
	});
	$('#dialogBoxClose').unbind('click');
	$('#dialogBoxClose').click(function(e) {
		e.stopPropagation();
		$(this).unbind('click');
		if ($(this).css('width') === 0) {
			return false;
		}
		$('#dialogBox').animate({'top': '+=10px'}, 'fast')
			.animate({'top': '-450px'}, 'fast', function() {
				$('#dialogBoxContent').empty();
				$('#dialogBoxClose').css('width', '0');
				$('#dialogBoxClose').css('font-size', '0');
				if (onClose) {
					onClose();
				}
			});
		$('#userInputText').focus();
	});
	if (closeable) {
		$(document).keydown(function(e) {
			if (e.keyCode === 27) {
				e.stopPropagation();
				$('#dialogBoxClose').click();
				$(document).unbind('keydown');
			}
		});
	}
}

// Buttons
// Status button
$('#status').click(function() {
	if ($(this).attr('src') === 'img/available.png') {
		$(this).attr('src', 'img/away.png');
		$(this).attr('alt', Cryptocat.language['chatWindow']['statusAway']);
		$(this).attr('title', Cryptocat.language['chatWindow']['statusAway']);
		currentStatus = 'away';
		sendStatus();
	}
	else {
		$(this).attr('src', 'img/available.png');
		$(this).attr('alt', Cryptocat.language['chatWindow']['statusAvailable']);
		$(this).attr('title', Cryptocat.language['chatWindow']['statusAvailable']);
		currentStatus = 'online';
		sendStatus();
	}
});

// My info button
$('#myInfo').click(function() {
	displayInfo(Cryptocat.myNickname);
});

// Desktop notifications button
if (!window.webkitNotifications) {
	$('#notifications').remove();
}
else {
	$('#notifications').click(function() {
		if ($(this).attr('src') === 'img/noNotifications.png') {
			$(this).attr('src', 'img/notifications.png');
			$(this).attr('alt', Cryptocat.language['chatWindow']['desktopNotificationsOn']);
			$(this).attr('title', Cryptocat.language['chatWindow']['desktopNotificationsOn']);
			desktopNotifications = 1;
			localStorage.setItem('desktopNotifications', '1');
			if (window.webkitNotifications.checkPermission()) {
				window.webkitNotifications.requestPermission(function() {});
			}
		}
		else {
			$(this).attr('src', 'img/noNotifications.png');
			$(this).attr('alt', Cryptocat.language['chatWindow']['desktopNotificationsOff']);
			$(this).attr('title', Cryptocat.language['chatWindow']['desktopNotificationsOff']);
			desktopNotifications = 0;
			localStorage.setItem('desktopNotifications', '0');
		}
	});
}

// Audio notifications button
// If using Safari, remove this button
// (Since Safari does not support audio notifications)
if (!navigator.userAgent.match(/(Chrome)|(Firefox)/)) {
	$('#audio').remove();
}
else {
	$('#audio').click(function() {
		if ($(this).attr('src') === 'img/noSound.png') {
			$(this).attr('src', 'img/sound.png');
			$(this).attr('alt', Cryptocat.language['chatWindow']['audioNotificationsOn']);
			$(this).attr('title', Cryptocat.language['chatWindow']['audioNotificationsOn']);
			audioNotifications = 1;
			localStorage.setItem('audioNotifications', '1');
		}
		else {
			$(this).attr('src', 'img/noSound.png');
			$(this).attr('alt', Cryptocat.language['chatWindow']['audioNotificationsOff']);
			$(this).attr('title', Cryptocat.language['chatWindow']['audioNotificationsOff']);
			audioNotifications = 0;
			localStorage.setItem('audioNotifications', '0');
		}
	});
}


// Logout button
$('#logout').click(function() {
	logout();
});

// Submit user input
$('#userInput').submit(function() {
	var message = $.trim($('#userInputText').val());
	if (message !== '') {
		if (currentConversation === 'main-Conversation') {
			if (multiParty.userCount() >= 1) {
				Cryptocat.connection.muc.message(
					Cryptocat.conversationName + '@' + Cryptocat.conferenceServer, null,
					multiParty.sendMessage(message), null
				);
			}
		}
		else {
			otrKeys[currentConversation].sendMsg(message);
		}
		Cryptocat.addToConversation(message, Cryptocat.myNickname, currentConversation);
	}
	$('#userInputText').val('');
	return false;
});

// User input key event detection.
// (Message submission, nick completion...)
$('#userInputText').keydown(function(e) {
	if (e.keyCode === 9) {
		e.preventDefault();
		for (var nickname in otrKeys) {
			if (match = nickname.match($(this).val().match(/(\S)+$/)[0])) {
				if ($(this).val().match(/\s/)) {
					$(this).val($(this).val().replace(match, nickname + ' '));
				}
				else {
					$(this).val($(this).val().replace(match, nickname + ': '));
				}
			}
		}
	}
	if (e.keyCode === 13) {
		e.preventDefault();
		$('#userInput').submit();
	}
});
$('#userInputText').keyup(function(e) {
	if (e.keyCode === 13) {
		e.preventDefault();
	}
});

// Custom server dialog
$('#customServer').click(function() {
	Cryptocat.bosh = Strophe.xmlescape(Cryptocat.bosh);
	Cryptocat.conferenceServer = Strophe.xmlescape(Cryptocat.conferenceServer);
	Cryptocat.domain = Strophe.xmlescape(Cryptocat.domain);
	$('#footer').animate({'height': '180px'}, function() {
		$('#customServerDialog').fadeIn();
		$('#customDomain').val(Cryptocat.domain)
			.click(function() {$(this).select()});
		$('#customConferenceServer').val(Cryptocat.conferenceServer)
			.click(function() {$(this).select()});
		$('#customBOSH').val(Cryptocat.bosh)
			.click(function() {$(this).select()});
		$('#customServerReset').val(Cryptocat.language['loginWindow']['reset']).click(function() {
			$('#customDomain').val(defaultDomain);
			$('#customConferenceServer').val(defaultConferenceServer);
			$('#customBOSH').val(defaultBOSH);
			if (localStorageEnabled) {
				localStorage.removeItem('domain');
				localStorage.removeItem('conferenceServer');
				localStorage.removeItem('bosh');
			}
		});
		$('#customServerSubmit').val(Cryptocat.language['chatWindow']['continue']).click(function() {
			$('#customServerDialog').fadeOut(200, function() {
				$('#footer').animate({'height': '14px'});
			});
			Cryptocat.domain = $('#customDomain').val();
			Cryptocat.conferenceServer = $('#customConferenceServer').val();
			Cryptocat.bosh = $('#customBOSH').val();
			if (localStorageEnabled) {
				localStorage.setItem('domain', Cryptocat.domain);
				localStorage.setItem('conferenceServer', Cryptocat.conferenceServer);
				localStorage.setItem('bosh', Cryptocat.bosh);
			}
		});
		$('#customDomain').select();
	});
});

// Language selector.
$('#languageSelect').click(function() {
	$('#footer').animate({'height': '180px'}, function() {
		$('#languages li').css({'color': '#FFF', 'font-weight': 'normal'});
		$('#' + Cryptocat.language['language']).css({'color': '#97CEEC', 'font-weight': 'bold'});
		$('#languages').fadeIn();
		$('#languages li').click(function() {
			var lang = $(this).attr('id');
			$('#languages').fadeOut(200, function() {
				Language.set(lang);
				if (localStorageEnabled) {
					localStorage.setItem('language', lang);
				}
				$('#footer').animate({'height': '14px'});
			});
		});
	});
});

// Login form.
$('#conversationName').click(function() {
	$(this).select();
});
$('#nickname').click(function() {
	$(this).select();
});
$('#loginForm').submit(function() {
	// Don't submit if form is already being processed.
	if (($('#loginSubmit').attr('readonly') === 'readonly')) {
		return false;
	}
	//Check validity of conversation name and nickname.
	$('#conversationName').val($.trim($('#conversationName').val().toLowerCase()));
	$('#nickname').val($.trim($('#nickname').val().toLowerCase()));
	if ($('#conversationName').val() === '') {
		loginFail(Cryptocat.language['loginMessage']['enterConversation']);
		$('#conversationName').select();
	}
	else if (!$('#conversationName').val().match(/^\w{1,20}$/)) {
		loginFail(Cryptocat.language['loginMessage']['conversationAlphanumeric']);
		$('#conversationName').select();
	}
	else if ($('#nickname').val() === '') {
		loginFail(Cryptocat.language['loginMessage']['enterNickname']);
		$('#nickname').select();
	}
	else if (!$('#nickname').val().match(/^\w{1,16}$/)) {
		loginFail(Cryptocat.language['loginMessage']['nicknameAlphanumeric']);
		$('#nickname').select();
	}
	// If no encryption keys, generate.
	else if (!myKey) {
		var progressForm = '<br /><p id="progressForm"><img src="img/keygen.gif" '
			+ 'alt="" /><p id="progressInfo"><span>'
			+ Cryptocat.language['loginMessage']['generatingKeys'] + '</span></p>';
		dialogBox(progressForm, 0, function() {
			// We need to pass the web worker a pre-generated seed.
			keyGenerator.postMessage(Cryptocat.generateSeed());
			startConnection();
			// Key storage currently disabled as we are not yet sure if this is safe to do.
			//if (localStorageEnabled) {
			//	localStorage.setItem('multiPartyKey', multiParty.genPrivateKey());
			//}
			//else {
				multiParty.genPrivateKey();
			//}
			multiParty.genPublicKey();
		}, function() {
			$('#loginSubmit').removeAttr('readonly')
			$('#loginSubmit').attr('readonly', 'readonly');
		});
		if (Cryptocat.language['language'] === 'en') {
			$('#progressInfo').append(
				'<br />Here is an interesting fact while you wait:'
				+ '<br /><div id="interestingFact">'
				+ CatFacts.getFact() + '</div>'
			);
		}
		$('#progressInfo').append(
			'<div id="progressBar"><div id="fill"></div></div>'
		);
		var catFactInterval = window.setInterval(function() {
			$('#interestingFact').fadeOut(function() {
				$(this).text(CatFacts.getFact()).fadeIn();
			});
			if (myKey) {
				clearInterval(catFactInterval);
			}
		}, 9000);
		$('#fill').animate({'width': '100%', 'opacity': '1'}, 9000, 'linear');
	}
	// If everything is okay, then register a randomly generated throwaway XMPP ID and log in.
	else {
		startConnection();
	}
	return false;
});


// Begin connection process.
function startConnection() {
	Cryptocat.conversationName = Strophe.xmlescape($('#conversationName').val());
	Cryptocat.myNickname = Strophe.xmlescape($('#nickname').val());
	loginCredentials[0] = Cryptocat.randomString(256, 1, 1, 1, 0);
	loginCredentials[1] = Cryptocat.randomString(256, 1, 1, 1, 0);
	connectXMPP(loginCredentials[0], loginCredentials[1]);
	$('#loginSubmit').attr('readonly', 'readonly');
}

// Registers a new user on the XMPP server, connects and join conversation.
function connectXMPP(username, password, connect) {
	Cryptocat.connection = new Strophe.Connection(Cryptocat.bosh);
	Cryptocat.connection.register.connect(Cryptocat.domain, function(status) {
		if (status === Strophe.Status.REGISTER) {
			$('#loginInfo').text(Cryptocat.language['loginMessage']['registering']);
			Cryptocat.connection.register.fields.username = username;
			Cryptocat.connection.register.fields.password = password;
			Cryptocat.connection.register.submit();
		}
		else if (status === Strophe.Status.REGISTERED) {
			Cryptocat.connection = new Strophe.Connection(Cryptocat.bosh);
			Cryptocat.connection.connect(username + '@' + Cryptocat.domain, password, function(status) {
				if (status === Strophe.Status.CONNECTING) {
					$('#loginInfo').animate({'color': '#FFF'}, 'fast');
					$('#loginInfo').text(Cryptocat.language['loginMessage']['connecting']);
				}
				else if (status === Strophe.Status.CONNECTED) {
					Cryptocat.connection.ibb.addIBBHandler(Cryptocat.ibbHandler);
					Cryptocat.connection.si_filetransfer.addFileHandler(Cryptocat.fileHandler);
					connected();
				}
				else if (status === Strophe.Status.CONNFAIL) {
					if (!loginError) {
						$('#loginInfo').text(Cryptocat.language['loginMessage']['connectionFailed']);
						$('#loginInfo').animate({'color': '#E93028'}, 'fast');
					}
				}
				else if (status === Strophe.Status.DISCONNECTED) {
					if (loginError) {
						$('#loginInfo').text(Cryptocat.language['loginMessage']['connectionFailed']);
						$('#loginInfo').animate({'color': '#E93028'}, 'fast');
					}
					logout();
				}
			});
		}
		else if (status === Strophe.Status.SBMTFAIL) {
			loginFail(Cryptocat.language['loginMessage']['authenticationFailure']);
			$('#conversationName').select();
			$('#loginSubmit').removeAttr('readonly');
			Cryptocat.connection = null;
			return false;
		}
	});
}

// Executes on successfully completed XMPP connection.
function connected() {
	Cryptocat.connection.muc.join(
		Cryptocat.conversationName + '@' + Cryptocat.conferenceServer, Cryptocat.myNickname, 
		function(message) {
			if (handleMessage(message)) {
				return true;
			}
		},
		function (presence) {
			if (handlePresence(presence)) {
				return true;
			}
		}
	);
	if (localStorageEnabled) {
		localStorage.setItem('myNickname', Cryptocat.myNickname);
	}
	$('#buddy-main-Conversation').attr('status', 'online');
	$('#loginInfo').text('✓');
	$('#info').fadeOut(200);
	$('#loginForm').fadeOut(200, function() {
		$('#bubble').animate({'margin-top': '+=0.5%'}, function() {
			$('#bubble').animate({'margin-top': '0'}, function() {
				$('#loginLinks').fadeOut();
				$('#version').fadeOut();
				$('#options').fadeOut();
				$('#bubble').animate({'width': '100%'})
				.animate({'height': $(window).height()}, function() {
					$(this).animate({'margin': '0', 'border-radius': '0'});
					$('.button').fadeIn();
					$('#buddyWrapper').slideDown('fast', function() {
						var scrollWidth = document.getElementById('buddyList').scrollWidth;
						$('#buddyList').css('width', (150 + scrollWidth) + 'px');
						bindBuddyClick('main-Conversation');
						$('#buddy-main-Conversation').click();
						buddyNotifications = 1;
					});
				});
			});
		});
	});
	loginError = 0;
}

// Executes on user logout.
function logout() {
	buddyNotifications = 0;
	Cryptocat.connection.muc.leave(Cryptocat.conversationName + '@' + Cryptocat.conferenceServer);
	Cryptocat.connection.disconnect();
	$('.button').fadeOut('fast');
	$('#conversationInfo').slideUp();
	$('#conversationInfo').text('');
	$('#buddy-main-Conversation').attr('status', 'offline');
	$('#userInput').fadeOut(function() {
		$('#conversationWindow').slideUp(function() {
			$('#buddyWrapper').slideUp();
			if (!loginError) {
				$('#loginInfo').animate({'color': '#FFF'}, 'fast');
				$('#loginInfo').text(Cryptocat.language['loginMessage']['thankYouUsing']);
			}
			$('#bubble').css({
				'border-radius': '8px 0 8px 8px',
				'margin': '0 auto'
			});
			$('#bubble').animate({
				'margin-top': '5%',
				'height': '310px'
			}).animate({'width': '680px'}, function() {
				$('#buddyList div').each(function() {
					if ($(this).attr('id') !== 'buddy-main-Conversation') {
						$(this).remove();
					}
				});
				$('#conversationWindow').text('');
				otrKeys = {};
				multiParty.reset();
				conversations = {};
				loginCredentials = [];
				currentConversation = 0;
				Cryptocat.connection = null;
				if (!loginError) {
					$('#conversationName').val('');
				}
				$('#info').fadeIn();
				$('#loginLinks').fadeIn();
				$('#version').fadeIn();
				$('#options').fadeIn();
				$('#loginForm').fadeIn('fast', function() {
					$('#conversationName').select();
					$('#loginSubmit').removeAttr('readonly');
				});
			});
			$('.buddy').unbind('click');
			$('.buddyMenu').unbind('click');
			$('#buddy-main-Conversation').insertAfter('#buddiesOnline');
		});
	});
}

// On window focus, select text input field automatically if we are chatting.
$(window).focus(function() {
	if ($('#buddy-main-Conversation').attr('status') === 'online') {
		$('#userInputText').focus();
	}
});

// On browser resize, also resize Cryptocat window.
// (This can be done with CSS for width, but not really for height.)
$(window).resize(function() {
	if ($('#buddy-main-Conversation').attr('status') === 'online') {
		var width = $(window).width() - $('#buddyWrapper').width();
		if ($(window).height() > 525) {
			$('#bubble').css('height', $(window).height());
		}
		$('#conversationWrapper').css('width', width);
		$('#userInputText').css('width', width - 61);
		$('#conversationWindow').css('height', $('#bubble').height() - 133);
		$('#conversationInfo').css({'width': width});
		$('.Line1, .Line2, .Line3').css('width', width - 60);
	}
});

// Logout on browser close.
$(window).unload(function() {
	logout();
});

})}//:3