(function(){ var Cryptocat = function() {};

/* Configuration */
var domain = 'crypto.cat';
var bosh = 'https://crypto.cat/http-bind';

/* Initialization */
var conversations = [];
var conversationInfo = [];
var loginCredentials = [];
var currentConversation = 0;
var audioNotifications = 0;
var currentStatus = 'online';
var soundEmbed = null;
var conn, myID, chatName;
$('.input[title]').qtip();
$('.button[title]').qtip();

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
	function createSound(audio) {
		soundEmbed = document.createElement('audio');
		soundEmbed.setAttribute('type', 'audio/webm');
		soundEmbed.setAttribute('src', audio);
		soundEmbed.setAttribute('style', 'display: none;');
		soundEmbed.setAttribute('autoplay', true);
	}
	if (!soundEmbed) {
		createSound(audio);
	}
	else {
		document.body.removeChild(soundEmbed);
		soundEmbed.removed = true;
		soundEmbed = null;
		createSound(audio);
	}
	soundEmbed.removed = false;
	document.body.appendChild(soundEmbed);
}

// Scrolls down the chat window to the bottom in a smooth animation.
function scrollDown(speed) {
	$('#conversationWindow').animate({
		scrollTop: document.getElementById('conversationWindow').scrollHeight + 20
	}, speed);
}
function initiateConversation(conversation) {
	if (!conversations[conversation]) {
		conversations[conversation] = '';
	}
}

// Switches the currently active conversation to `buddy`
function conversationSwitch(buddy) {
	$('#' + buddy).animate({'background-color': '#97CEEC'});
	$('#' + buddy).css('border-bottom', '1px dashed #76BDE5');
	$('#conversationInfo').animate({'width': '750px'}, function() {
		$('#conversationWindow').slideDown('fast', function() {
			if (conversationInfo[currentConversation]) {
				$('#conversationInfo').html(conversationInfo[currentConversation]);
			}
			else {
				$('#conversationInfo').html('<span>Conversation initiated at ' + currentTime(1) + '</span>');
				conversationInfo[currentConversation] = $('#conversationInfo').html();
			}
			$('#userInput').fadeIn('fast', function() {
				$('#userInputText').focus();
			});
			var scrollWidth = document.getElementById('conversationWindow').scrollWidth;
			$('#conversationWindow').css('width', (712 + scrollWidth) + 'px');
			scrollDown(600);
		});
	});
}

// Handles login failures (this function will probably be replaced)
function loginFail(message) {
	$('#loginInfo').html(message);
	$('#bubble').animate({'left': '+=5px'}, 130)
		.animate({'left': '-=10px'}, 130)
		.animate({'left': '+=5px'}, 130);
	$('#loginInfo').animate({'color': '#E93028'}, 'fast');
	$('#chatName').select();
}

// Seeds the RNG via Math.seedrandom().
// If the browser supports window.crypto.getRandomValues(), then that is used.
// Otherwise, the built-in Fortuna RNG is used.
function seedRNG() {
	if ((typeof window.crypto !== 'undefined') && (typeof window.crypto.getRandomValues === 'function')) {
		var buffer = new Uint8Array(1024);
		window.crypto.getRandomValues(buffer);
		var seed = '';
		for (var i in buffer) {
			seed += String.fromCharCode(buffer[i]);
			CryptoJS.Fortuna.AddRandomEvent(String.fromCharCode(buffer[i]));
		}
		Math.seedrandom(seed);
		delete seed;
		return true;
	}
	else {
		var e, up, down;
		var seedRNGForm = '<br /><p id="seedRNGForm"><img src="img/keygen.gif" alt="" />Please type on your keyboard'
			+ ' as randomly as possible for a few seconds.</p><input type="password" id="seedRNGInput" />';
		dialogBox(seedRNGForm, 1, function() {
			$('#loginInfo').html('Please login.');
			$('#chatName').select();
		});
		$('#seedRNGInput').select();
		$('#seedRNGInput').keydown(function(event) {
			if (CryptoJS.Fortuna.Ready() === 0) {
				e = String.fromCharCode(event.keyCode);
				var d = new Date();
				down = d.getTime();
			}
		});
		$('#seedRNGInput').keyup(function() {
			if (CryptoJS.Fortuna.Ready() === 0) {
				var d = new Date();
				up = d.getTime();
				if (e) {
					CryptoJS.Fortuna.AddRandomEvent(e + (up - down));
				}
			}
			else {
				$('#seedRNGInput').unbind('keyup').unbind('keydown');
				$('#chatName').attr('readonly', 'true');
				$('#seedRNGInput').attr('readonly', 'true');
				$('#dialogBoxClose').click();
				Math.seedrandom(CryptoJS.Fortuna.RandomData(1024));
				// Now that the RNG is seeded, we can again submit the login form
				$('#loginForm').submit();
			}
		});
		return false;
	}
}

// Generates a random string of length `size` characters.
// If `alpha = 1`, random string will contain alpha characters, and so on.
function randomString(size, alpha, uppercase, numeric) {
	var keyspace = '';
	var result = '';
	if (alpha) {
		keyspace += 'abcdefghijklmnopqrstuvwxyz';
	}
	if (uppercase) {
		keyspace += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
	}
	if (numeric) {
		keyspace += '0123456789';
	}
	for (var i = 0; i != size; i++) {
		result += keyspace[Math.floor(Math.random()*keyspace.length)];
	}
	return result;
}

// Converts format of jid so that it's usable as an element ID.
function jid2ID(jid) {
	jid = jid.match(/^(\w|\@|\.)+/);
	return jid[0].replace('@', '-').replace(/\./g, '-');
}

// Simply shortens a buddy's name to an acceptable size for display
// in certain parts of the UI.
function shortenBuddy(buddy, length) {
	if (buddy.length > length) {
		return buddy.substring(0, (length -2)) + '..';
	}
	return buddy;
}

// Builds a buddy element to be added to the buddy list.
function buildBuddy(buddyObject) {
	if (buddyObject.name.match(/^(\w|\s)+$/)) {
		var name = shortenBuddy(buddyObject.name, 19);
	}
	else {
		var name = shortenBuddy(buddyObject.jid, 19);
	}
	$('<div class="buddy" title="' + buddyObject.jid + '" id="' + jid2ID(buddyObject.jid) + '" status="offline">'
		+ '<span>' + name + '</span>' + '<div class="buddyMenu" id="' + jid2ID(buddyObject.jid)
		+ '-menu"></div></div>').insertAfter('#buddiesOffline').slideDown('fast');
}

// Handle incoming messages from the XMPP server.
function handleMessage(message) {
	var from = jid2ID($(message).attr('from'));
	var rosterID = $(message).attr('from').match(/^(\w|\@|\.)+/)[0];
	var sender = $('#' + jid2ID(rosterID)).find('span').html().match(/^\w+/)[0];
	var body = $(message).find('body').text();
	addtoConversation(body, sender, rosterID);
	if (currentConversation !== rosterID) {
		var backgroundColor = $('#' + from).css('background-color');
		$('#' + from).css('background-image', 'url("img/newMessage.png")');
		$('#' + from).animate({'backgroundColor': '#A7D8F7'}).animate({'backgroundColor': backgroundColor});
	}
	return true;
}

// Add a `message` from `sender` to the `conversation` display and log.
function addtoConversation(message, sender, conversation) {
	initiateConversation(conversation);
	if (sender === loginCredentials[0]) {
		lineDecoration = 1;
		audioNotification = 'snd/msgSend.webm';
	}
	else {
		lineDecoration = 2;
		audioNotification = 'snd/msgGet.webm';
	}
	message = message.replace(/</g,'&lt;').replace(/>/g,'&gt;');
	if ((URLs = message.match(/((mailto\:|(news|(ht|f)tp(s?))\:\/\/){1}\S+)/gi))) {
		for (var i in URLs) {
			var sanitize = URLs[i].split('');
			for (var l in sanitize) {
				if (!sanitize[l].match(/\w|\d|\:|\/|\?|\=|\#|\+|\,|\.|\&|\;|\%/)) {
					sanitize[l] = encodeURIComponent(sanitize[l]);
				}
			}
			sanitize = sanitize.join('');
			message = message.replace(sanitize, '<a target="_blank" href="' + sanitize + '">' + URLs[i] + '</a>');
		}
	}
	var timeStamp = '<span class="timeStamp">' + currentTime(0) + '</span>';
	var sender = '<span class="sender">' + shortenBuddy(sender, 16) + '</span>';
	message = '<div class="Line' + lineDecoration + '">' + timeStamp + sender + message + '</div>';
	conversations[conversation] += message;
	if (conversation === currentConversation) {
		$('#conversationWindow').append(message);
	}
	if (audioNotifications) {
		playSound(audioNotification);
	}
	if ((document.getElementById('conversationWindow').scrollHeight - $('#conversationWindow').scrollTop()) < 800) {	
		scrollDown(600);
	}
}

// Handle incoming presence updates from the XMPP server.
// Large, but fully handles any relevant presence update.
function handlePresence(presence) {
	var from = jid2ID($(presence).attr('from'));
	var rosterID = $(presence).attr('from').match(/^(\w|\@|\.)+/)[0];
	if ((from === myID)
		|| ($(presence).attr('type') === 'unsubscribed')
		|| ($(presence).attr('type') === 'error')) {
		return true;
	}
	else {
		sendStatus();
	}
	if ($('#' + from).length === 0) {
		buildBuddy({jid: rosterID, name: ''});
	}
	if ($(presence).attr('type') === 'unavailable') {
		if ($('#' + from).attr('status') !== 'offline') {
			$('#' + from).attr('status', 'offline');
			$('#' + from).animate({
				'color': '#BBB',
				'backgroundColor': '#222',
				'borderLeftColor': '#111'
			});
			$('#' + from).css('cursor', 'default');
			$('#' + from).css('background-image', 'none');
			if (audioNotifications) {
				playSound('snd/userOffline.webm');
			}
			if ($('#' + from).prev().attr('id') !== 'currentConversation') {
				$('#' + from).slideUp('fast', function() {
					$(this).insertAfter('#buddiesOffline').slideDown('fast');
				});
			}
		}
	}
	else if ($(presence).attr('type') === 'subscribe') {
		var authorizeForm = '<form id="authorizeForm"><div class="bar">authorize new buddy?</div>'
			+ '<div class="bar">' + rosterID + '</div>'
			+ '<div id="yes" class="yes">yes</div><div id="no" class="no">no</div></form>';
		dialogBox(authorizeForm, 1, function() {
			conn.addHandler(handlePresence, null, 'presence');
		});
		$('#yes').click(function() {
			conn.roster.authorize(rosterID);
			conn.roster.subscribe(rosterID);
			$('#dialogBoxClose').click();
		});
		$('#no').click(function() {
			conn.roster.unauthorize(rosterID);
			$('#dialogBoxClose').click();
		});
		return false;
	}
	else {
		if ($(presence).find('show').text() === '' || $(presence).find('show').text() === 'chat') {
			if ($('#' + from).attr('status') !== 'online') {
				var status = 'online';
				var backgroundColor = '#76BDE5';
				var placement = '#buddiesOnline';
				if (audioNotifications) {
					playSound('snd/userOnline.webm');
				}
			}
		}
		else if ($('#' + from).attr('status') !== 'away') {
				var status = 'away';
				var backgroundColor = '#5588A5';
				var placement = '#buddiesAway';
		}
		$('#' + from).attr('status', status);
		if ($('#' + from).attr('title') !== currentConversation) {
			$('#' + from).animate({
				'color': '#FFF',
				'backgroundColor': backgroundColor,
				'borderLeftColor': '#97CEEC'
			});
			$('#' + from).slideUp('fast', function() {
				$(this).insertAfter(placement).slideDown('fast');
			});
		}
		$('.buddyMenu').unbind('click');
		$('.buddyMenu').click(function(event) {
			event.stopPropagation();
			var buddy = $(this).attr('id').substring(0, ($(this).attr('id').length - 5));
			if ($('#' + buddy).height() === 15) {
				var buddyMenuContents = '<div class="buddyMenuContents" id="' + buddy + '-contents">'
					+ '<li class="startGroupChat">Start group chat</li>'
					+ '<li class="setNickname">Set nickname</li>'
					+ '<li class="removeBuddy">Remove buddy</li></div>';
				$(this).css('background-image', 'url("img/up.png")');
				$('#' + buddy).delay(10).animate({'height': '61px'}, 180, function() {
					$('#' + buddy).append(buddyMenuContents);
					$('#' + buddy + '-contents').fadeIn('fast', function() {
						$('.startGroupChat').click(function(event) {
							event.stopPropagation();
							dialogBox('<h1>Coming soon!</h1>', 1);
						});
						$('.setNickname').click(function(event) {
							event.stopPropagation();
							var defaultNickname = ['bunny', 'kitty', 'pony', 'puppy', 'squirrel', 'sparrow', 'turtle', 
								'kiwi', 'fox', 'owl', 'raccoon', 'koala', 'echidna', 'panther', 'sprite', 'ducky'];
							defaultNickname = defaultNickname[Math.floor((Math.random()*defaultNickname.length))];
							var setNicknameForm = '<form id="setNicknameForm">'
								+ '<div class="bar">Set nickname for ' + $('#' + buddy).attr('title') + '</div>'
								+ '<input id="setNicknameText" class="bar" type="text" value="'
								+ defaultNickname + '" autocomplete="off"/>'
								+ '<input class="yes" id="setNicknameSubmit" type="submit" value="Set nickname"/>'
								+ '</form>';
							dialogBox(setNicknameForm, 1);
							$('#setNicknameText').select();
							$('#setNicknameForm').submit(function() {
								if ($('#setNicknameText').val().match(/^(\w|\s)+$/)) {
									setNickname($('#' + buddy).attr('title'), $('#setNicknameText').val());
									$('#' + buddy).find('span').html($('#setNicknameText').val());
									$('#dialogBoxClose').click();
									return false;
								}
								else {
									$('#setNicknameText').val('Letters, numbers and spaces only').select();
									return false;
								}
							});
						});
						$('.removeBuddy').click(function(event) {
							event.stopPropagation();
							var buddy = $('.removeBuddy').parent().attr('id');
							buddy = buddy.substring(0, (buddy.length - 9));
							conn.roster.unauthorize($('#' + buddy).attr('title'));
							conn.roster.unsubscribe($('#' + buddy).attr('title'));
							var iq = $iq({type: 'set'})
								.c('query', {xmlns: Strophe.NS.ROSTER})
								.c('item', {jid: $('#' + buddy).attr('title'), subscription: 'remove'});
							conn.sendIQ(iq);
							$('#' + buddy).slideUp('fast', function() {
								$('#' + buddy).remove();
							});
						});
					});
				});
			}
			else {
				$(this).css('background-image', 'url("img/down.png")');
				$('#' + buddy).animate({'height': '15px'}, 190);
				$('#' + buddy + '-contents').fadeOut('fast', function() {
					$('#' + buddy + '-contents').remove();
				});
			}
		});
		$('#' + from).css('cursor', 'pointer');
		$('#' + from).unbind('click');
		$('#' + from).click(function() {
			if ($(this).prev().attr('id') === 'currentConversation') {
				$('#userInputText').focus();
				return true;
			}
			$(this).css('background-image', 'none');
			if ($(this).attr('status') !== 'offline') {
				if (currentConversation) {
					var oldConversation = '#' + jid2ID(currentConversation);
					if ($(oldConversation).attr('status') === 'online') {
						var placement = '#buddiesOnline';
						var backgroundColor = '#76BDE5';
					}
					else if ($(oldConversation).attr('status') === 'away') {
						var placement = '#buddiesAway';
						var backgroundColor = '#5588A5';
					}
					else {
						var placement = '#buddiesOffline';
						var backgroundColor = '#222';
					}
					$(oldConversation).slideUp('fast', function() {
						$(oldConversation).css('background-color', backgroundColor);
						$(oldConversation).css('border-bottom', 'none');
						$(oldConversation).insertAfter(placement).slideDown('fast');
					});
				}
				currentConversation = $(this).attr('title');
				initiateConversation(currentConversation);
				$('#conversationWindow').html(conversations[currentConversation]);
				if (($(this).prev().attr('id') === 'buddiesOnline')
					|| (($(this).prev().attr('id') === 'buddiesAway')
					&& $('#buddiesOnline').next().attr('id') === 'buddiesAway')) {
					$(this).insertAfter('#currentConversation');
					conversationSwitch($(this).attr('id'));
				}
				else {
					$(this).slideUp('fast', function() {
						$(this).insertAfter('#currentConversation').slideDown('fast', function() {
							conversationSwitch($(this).attr('id'));
						});
					});
				}
			}
		});
	}
	return true;
}

// Send your current status to the XMPP server.
function sendStatus() {
	if (currentStatus === 'away') {
		conn.send($pres().c('show').t('away'));
	}
	else {
		conn.send($pres());
	}
}

// Set a `nickname` for `buddy`.
function setNickname(buddy, nickname) {
	conn.sendIQ(
		$iq({type: 'set'}).c('query', {xmlns: 'jabber:iq:roster'}).c('item', {
			jid: buddy, name: nickname
		})
	);
}

// Displays the dialog box with `data` as the content HTML.
// If `closeable = 1`, then the dialog box has a close button on the top right.
// onClose may be defined as a callback function to execute on dialog box close.
function dialogBox(data, closeable, onClose) {
	if ($('#dialogBox').css('top') !== '-450px') {
		return false;
	}
	if (closeable) {
		$('#dialogBoxClose').css('display', 'block');
	}
	$('#dialogBoxContent').html(data);
	$('#dialogBox').animate({'top': '+=460px'}, 'fast').animate({'top': '-=10px'}, 'fast');
	$('#dialogBoxClose').click(function() {
		if ($('#dialogBoxClose').css('display') === 'none') {
			return false;
		}
		$('#dialogBox').animate({'top': '+=10px'}, 'fast').animate({'top': '-450px'}, 'fast');
		$('#dialogBoxClose').css('display', 'none');
		if (onClose) {
			onClose();
		}
		$('#userInputText').focus();
	});
	$(document).keydown(function(e) {
		if (e.keyCode == 27) {
			$('#dialogBoxClose').click();
		}
	});
}

// Buttons
// Status button
$('#status').click(function() {
	if ($(this).attr('title') === 'Status: Available') {
		$(this).attr('src', 'img/away.png');
		$(this).attr('alt', 'Status: Away');
		$(this).attr('title', 'Status: Away');
		currentStatus = 'away';
		sendStatus();
	}
	else {
		$(this).attr('src', 'img/available.png');
		$(this).attr('alt', 'Status: Available');
		$(this).attr('title', 'Status: Available');
		currentStatus = 'online';
		sendStatus();
	}
});

// Add buddy button (likely to be removed)
$('#add').click(function() {
	if ($('#dialogBoxClose').css('display') === 'block') {
		return false;
	}
	var addBuddyForm = '<form id="addBuddyForm"><div class="bar">add new buddy:</div>'
		+ '<input id="addBuddyJID" class="bar" type="text" value="user@' + domain + '" autocomplete="off"/>'
		+ '<input class="yes" id="addBuddySubmit" type="submit" value="Send buddy request"/>'
		+ '</form>';
	dialogBox(addBuddyForm, 1);
	$('#addBuddyJID').click(function() {
		$(this).select();
	});
	$('#addBuddyForm').submit(function() {
		conn.roster.subscribe($('#addBuddyJID').val());
		$('#dialogBoxClose').click();
		return false;
	});
	$('#addBuddyJID').select();
});

// Audio notifications button
$('#audio').click(function() {
	if ($(this).attr('title') === 'Audio Notifications Off') {
		$(this).attr('src', 'img/sound.png');
		$(this).attr('alt', 'Audio Notifications On');
		$(this).attr('title', 'Audio Notifications On');
		audioNotifications = 1;
	}
	else {
		$(this).attr('src', 'img/noSound.png');
		$(this).attr('alt', 'Audio Notifications Off');
		$(this).attr('title', 'Audio Notifications Off');
		audioNotifications = 0;
	}
});

$('#userInput').submit(function() {
	var message = $.trim($('#userInputText').val());
	if (message !== '') {
		conn.send($msg({to: currentConversation, 'type': 'chat'}).c('body').t(message));
		message = message;
		addtoConversation(message, loginCredentials[0], currentConversation);
	}
	$('#userInputText').val('');
	return false;
});

$('#logout').click(function() {
	conn.disconnect();
});

/* Login Form */
$('#chatName').select();
$('#chatName').click(function() {
	$(this).select();
});
$('#loginForm').submit(function() {
	// Don't process any login request if RNG isn't seeded
	if (CryptoJS.Fortuna.Ready() === 0) {
		if (!seedRNG()) {
			return false;
		}
	}
	chatName = $('#chatName').val();
	if ($('#chatName').val() === '') {
		return false;
	}
	else if (!$('#chatName').val().match(/^\w{1,20}$/)) {
		loginFail('Chat name must be alphanumeric.');
	}
	else {
		loginCredentials[0] = randomString(512, 1, 1, 1);
		loginCredentials[1] = randomString(512, 1, 1, 1);
		registerXMPPUser(loginCredentials[0], loginCredentials[1]);
	}
	return false;
});

// Registers a new user on the XMPP server.
function registerXMPPUser(username, password) {
	var registrationConnection = new Strophe.Connection(bosh);
	registrationConnection.register.connect(domain, function(status) {
		if (status === Strophe.Status.REGISTER) {
			$('#loginInfo').html('Registering...');
			registrationConnection.register.fields.username = username;
			registrationConnection.register.fields.password = password;
			registrationConnection.register.submit();
		}
		else if (status === Strophe.Status.REGISTERED) {
			registrationConnection.disconnect();
			login(loginCredentials[0], loginCredentials[1]);
			return true;
		}
		else if (status === Strophe.Status.SBMTFAIL) {
			return false;
		}
	});
}

// Logs into the XMPP server, creating main connection handlers.
function login(username, password) {
	conn = new Strophe.Connection(bosh);
	conn.connect(username + '@' + domain, password, function(status) {
		if (status === Strophe.Status.CONNECTING) {
			$('#loginInfo').animate({'color': '#999'}, 'fast');
			$('#loginInfo').html('Connecting...');
		}
		else if (status === Strophe.Status.CONNFAIL) {
			$('#loginInfo').html('Connection failed.');
			$('#loginInfo').animate({'color': '#E93028'}, 'fast');
		}
		else if (status === Strophe.Status.CONNECTED) {
			$('#loginInfo').html('Connected.');
			$('#loginInfo').animate({'color': '#0F0'}, 'fast');
			$('#bubble').animate({'margin-top': '1.5%'}, function() {
				$('#loginLinks').fadeOut();
				$('#info').fadeOut();
				$('#loginForm').fadeOut();
				$('#bubble').animate({'width': '900px'});
				$('#bubble').animate({'height': '550px'}, function() {
					$('.button').fadeIn();
					$('#buddyWrapper').fadeIn('fast', function() {
						var scrollWidth = document.getElementById('buddyList').scrollWidth;
						$('#buddyList').css('width', (150 + scrollWidth) + 'px');
					});
					conn.roster.init(conn);
					conn.roster.get(function(roster) {
						for (var i in roster) {
							if (!roster[i].name) {
								roster[i].name = '';
							}
							buildBuddy(roster[i]);
						}
						conn.addHandler(handlePresence, null, 'presence');
						conn.addHandler(handleMessage, null, 'message', 'chat');
						sendStatus();
					});
					myID = jid2ID(loginCredentials[0] + '@' + domain);
				});
			});
		}
		else if (status === Strophe.Status.DISCONNECTED) {
			$('.button').fadeOut('fast');
			$('#userInput').fadeOut(function() {
				$('#conversationInfo').animate({'width': '0'});
				$('#conversationInfo').html('');
				$('#conversationWindow').slideUp(function() {
					$('#buddyWrapper').fadeOut();
					$('#loginInfo').animate({'color': '#999'}, 'fast');
					$('#loginInfo').html('Thank you for using Cryptocat.');
					$('#bubble').animate({'width': '680px'});
					$('#bubble').animate({'height': '310px'}).animate({'margin-top': '5%'}, function() {
						$('#buddyList div').remove();
						$('#conversationWindow').html('');
						conversations = [];
						myID = null;
						loginCredentials = [];
						$('#chatName').val('');
						$('#chatName').removeAttr('readonly');
						$('#newAccount').attr('checked', false);
						$('#info').fadeIn();
						$('#loginLinks').fadeIn();
						$('#loginForm').fadeIn('fast', function() {
							$('#chatName').select();
						});
					});
				});
			});
		}
		else if (status === Strophe.Status.AUTHFAIL){
			loginFail('Authentication failure.');
		}
		else if (status === Strophe.Status.ERROR) {
			console.log('status ' + status);
		}
	});
}

})();