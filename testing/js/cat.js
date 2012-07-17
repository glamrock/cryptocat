/* Initialization */
var domain =  'crypto.cat';
var conversations = [];
var conn, myID, currentConversation, username;
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
function conversationSwitch(buddy) {
	var date = new Date();
	$('#conversationInfo').animate({'width': '750px'}, function() {
		$('#conversationWindow').slideDown('fast', function() {
			$('#conversationInfo').html('<span>Conversation initiated at ' + date.getHours() 
				+ ':' + date.getMinutes() + ':' + date.getSeconds() + '</span>');
			$('#userInput').fadeIn('fast', function() {
				$('#userInputText').focus();
			});
			var scrollWidth = document.getElementById('conversationWindow').scrollWidth;
			$('#conversationWindow').css('width', (712 + scrollWidth) + 'px');
			scrollDown(600);
		});
	});
}
function loginFail(message) {
	$('#loginInfo').html(message);
	$('#bubble').animate({'left': '+=5px'}, 130)
		.animate({'left': '-=10px'}, 130)
		.animate({'left': '+=5px'}, 130);
	$('#loginInfo').css('color', '#E93028');
	$('#username').attr('readonly', false);
	$('#password').attr('readonly', false);
	$('#loginSubmit').attr('readonly', false);
	$('#username').select();
}
function jid2ID(jid) {
	jid = jid.match(/^(\w|\@|\.)+/);
	return jid[0].replace('@', '-').replace('.', '-');
}
function shortenBuddy(buddy, length) {
	if (buddy.length > length) {
		return buddy.substring(0, (length -2)) + '..';
	}
	return buddy;
}
function buildBuddyList(roster) {
	for (var i in roster) {
		var rosterID = shortenBuddy(roster[i].jid, 21);
		$('<div class="buddy" title="' + roster[i].jid + '" id="' + jid2ID(roster[i].jid) + '" status="offline">'
			+ rosterID + '</div>').insertAfter('#buddiesOffline').slideDown('fast');
	}
}
function updatePresence(presence) {
	var from = jid2ID($(presence).attr('from'));
	var rosterID = shortenBuddy($(presence).attr('from').match(/^(\w|\@|\.)+/)[0], 21);
	if (from === myID) {
		return true;
	}
	if ($('#' + from).length === 0) {
		$('<div class="buddy" title="' + rosterID + '" id="' + from + '" status="offline">'
			+ rosterID + '</div>').insertAfter('#buddiesOffline');
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
			$('#' + from).slideUp('fast', function() {
				$(this).insertAfter('#buddiesOffline').slideDown('fast');
			});
		}
	}
	else if ($(presence).attr('type') === 'subscribe') {
		var authorizeForm = '<form id="authorizeForm"><div class="bar">authorize new buddy?</div>'
			+ '<div class="bar">' + rosterID + '</div>'
			+ '<div id="yes" class="yes">yes</div><div id="no" class="no">no</div></form>';
		dialogBox(authorizeForm, 1, function() {
			conn.addHandler(updatePresence, null, 'presence');
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
	else if ($(presence).attr('type') !== 'unsubscribed' && $(presence).attr('type') !== 'error') {
		if ($(presence).find('show').text() === '' || $(presence).find('show').text() === 'chat') {
			if ($('#' + from).attr('status') !== 'online') {
				$('#' + from).attr('status', 'online');
				$('#' + from).animate({
					'color': '#FFF',
					'backgroundColor': '#76BDE5',
					'borderLeftColor': '#97CEEC'
				});
				$('#' + from).slideUp('fast', function() {
					$(this).insertAfter('#buddiesOnline').slideDown('fast');
				});
			}
		}
		else {
			if ($('#' + from).attr('status') !== 'away') {
				$('#' + from).attr('status', 'away');
				$('#' + from).animate({
					'color': '#FFF',
					'backgroundColor': '#E93028',
					'borderLeftColor': '#97CEEC'
				});
				$('#' + from).slideUp('fast', function() {
					$(this).insertAfter('#buddiesAway').slideDown('fast');
				});
			}
		}
		$('#' + from).css('cursor', 'pointer');
		$('#' + from).click(function() {
			if ($(this).css('background-color') === 'rgb(151, 206, 236)') {
				$(this).animate({'background-color': 'rgb(118, 189, 229)'});
				$(this).css('background-image', 'none');
			}
			if ($(this).prev().attr('id') === 'currentConversation') {
				$('#userInputText').focus();
				return true;
			}
			if ($(this).attr('status') !== 'offline') {
				currentConversation = $(this).attr('title');
				initiateConversation(currentConversation);
				$('#conversationWindow').html(conversations[currentConversation]);
				if ($('#currentConversation').next().attr('status')) {
					if ($('#currentConversation').next().attr('status') === 'online') {
						var placement = '#buddiesOnline';
					}
					else if ($('#currentConversation').next().attr('status') === 'away') {
						var placement = '#buddiesAway';
					}
					else {
						var placement = '#buddiesOffline';
					}
					$('#currentConversation').next().slideUp('fast', function() {
						$('#currentConversation').next().insertAfter(placement).slideDown('fast');
					});
				}
				if ($(this).prev().attr('id') !== 'buddiesOnline') {
					$(this).slideUp('fast', function() {
						$(this).insertBefore('#buddiesOnline').slideDown('fast', function() {
							conversationSwitch($(this).attr('id'));
						});
					});
				}
				else {
					$(this).insertBefore('#buddiesOnline');
					conversationSwitch($(this).attr('id'));
				}
			}
		});
	}
	return true;
}
function dialogBox(data, closeable, onClose) {
	if (closeable) {
		$('#dialogBoxClose').css('display', 'block');
	}
	$('#dialogBoxContent').html(data);
	$('#dialogBox').animate({'top': '+=460px'}, 'fast').animate({'top': '-=10px'}, 'fast');
	$('#dialogBoxClose').click(function() {
		if ($('#dialogBoxClose').css('display') === 'none') {
			return false;
		}
		$('#dialogBox').animate({'top': '+=10px'}, 'fast').animate({'top': '-450px'}, 'fast', function() {
			$('#dialogBoxClose').css('display', 'none');
		});
		if (onClose) {
			onClose();
		}
		$('#userInputText').focus();
	});
	$(document).keyup(function(e) {
		if (e.keyCode == 27) {
			$('#dialogBoxClose').click();
		}
	});
}
$('#add').click(function() {
	if ($('#dialogBoxClose').css('display') === 'block') {
		return false;
	}
	var addBuddyForm = '<form id="addBuddyForm"><div class="bar">add new buddy:</div>'
		+ '<input id="addBuddyJID" class="bar" type="text" value="user@' + domain + '" autocomplete="off"/>'
		+ '<input class="yes" id="addBuddySubmit" type="submit" value="Send buddy request"/><br /><br />'
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
$('#remove').click(function() {
	if ($('#dialogBoxClose').css('display') === 'block') {
		return false;
	}
	var removeBuddyForm = '<form id="removeBuddyForm"><div class="bar">remove a buddy:</div>'
		+ '<input id="removeBuddyJID" class="bar" type="text" value="user@' + domain + '" autocomplete="off"/>'
		+ '<input class="yes" id="removeBuddySubmit" type="submit" value="Remove buddy :("/><br /><br />'
		+ '</form>';
	dialogBox(removeBuddyForm, 1);
	$('#removeBuddyJID').click(function() {
		$(this).select();
	});
	$('#removeBuddyForm').submit(function() {
		conn.roster.unauthorize($('#removeBuddyJID').val());
		conn.roster.unsubscribe($('#removeBuddyJID').val());
		$('#' + jid2ID($('#removeBuddyJID').val())).remove();
		$('#dialogBoxClose').click();
		return false;
	});
	$('#removeBuddyJID').select();
});
function handleMessage(message) {
	var from = jid2ID($(message).attr('from'));
	var rosterID = $(message).attr('from').match(/^(\w|\@|\.)+/)[0];
	var sender = $(message).attr('from').match(/^(\w)+/)[0];
	var body = $(message).find('body').text();
	addtoConversation(body, sender, rosterID);
	if (currentConversation !== rosterID) {
		$('#' + from).animate({'background-color': '#97CEEC'});
		$('#' + from).css('background-image', 'url("img/message.png")');
	}
	return true;
}
function addtoConversation(message, sender, conversation) {
	initiateConversation(conversation);
	if (sender === username) {
		lineDecoration = 1;
	}
	else {
		lineDecoration = 2;
	}
	sender = '<span class="sender">' + shortenBuddy(sender, 16) + '</span>';
	message = '<div class="Line' + lineDecoration + '">' + sender + message + '</div>';
	conversations[conversation] += message;
	if (conversation === currentConversation) {
		$('#conversationWindow').append(message);
	}
	if ((document.getElementById('conversationWindow').scrollHeight - $('#conversationWindow').scrollTop()) < 800) {	
		scrollDown(600);
	}
}
$('#userInput').submit(function() {
	var message = $.trim($('#userInputText').val());
	if (message !== '') {
		conn.send($msg({to: currentConversation, 'type': 'chat'}).c('body').t(message));
		message = message;
		addtoConversation(message, username, currentConversation);
	}
	$('#userInputText').val('');
	return false;
});
$('#logout').click(function() {
	conn.disconnect();
});

/* Login Form */
$('#username').select();
$('#username').click(function() {
	$(this).select();
});
$('#password').click(function() {
	$(this).select();
});
$('#loginForm').submit(function() {
	username = $('#username').val();
	if ($('#loginSubmit').attr('readonly')) {
		return false;
	}
	$('#username').attr('readonly', true);
	$('#password').attr('readonly', true);
	$('#loginSubmit').attr('readonly', true);
	if ($('#username').val() === '' || $('#username').val() === 'username') {
		loginFail('Please enter a username.');
		$('#username').focus();
	}
	else if ($('#password').val() === '' || $('#password').val() === 'password') {
		loginFail('Please enter a password.');
		$('#password').focus();
	}
	else if (!$('#username').val().match(/^\w{1,16}$/)) {
		loginFail('Username must be alphanumeric.');
	}
	else {
		connect(username, $('#password').val());
	}
	return false;
});

/* Connection */
function connect(username, password) {
	conn = new Strophe.Connection('https://crypto.cat/http-bind');
	if ($('#newAccount').attr('checked')) {
		conn.register.connect('crypto.cat', function(status) {
			if (status === Strophe.Status.REGISTER) {
				$('#loginInfo').html('Registering...');
				conn.register.fields.username = username;
				conn.register.fields.password = password;
				conn.register.submit();
			}
			else if (status === Strophe.Status.REGISTERED) {
				conn.disconnect();
				login();
			}
			else if (status === Strophe.Status.SBMTFAIL) {
				loginFail('Registration failure.');
			}
		});
	}
	else {
		login();
	}
	function login() {
		conn = new Strophe.Connection('https://crypto.cat/http-bind');
		conn.connect(username + '@' + domain, password, function(status) {
			if (status === Strophe.Status.CONNECTING) {
				$('#loginInfo').css('color', '#999');
				$('#loginInfo').html('Connecting...');
			}
			else if (status === Strophe.Status.CONNFAIL) {
				$('#username').attr('readonly', false);
				$('#password').attr('readonly', false);
				$('#loginSubmit').attr('readonly', false);
				$('#loginInfo').html('Connection failed.');
				$('#loginInfo').css('color', '#E93028');
			}
			else if (status === Strophe.Status.CONNECTED) {
				$('#loginInfo').html('Connected.');
				$('#loginInfo').css('color', '#0F0');
				$('#bubble').animate({'top': '+=10px'}, function() {
					$('#info').fadeOut();
					$('#loginForm').fadeOut();
					$('#bubble').animate({'margin-top': '-=5%'}, function() {
						$('#bubble').animate({'width': '900px'});
						$('#bubble').animate({'height': '550px'}, function() {
							$('.button').fadeIn();
							$('#buddyWrapper').fadeIn('fast', function() {
								var scrollWidth = document.getElementById('buddyList').scrollWidth;
								$('#buddyList').css('width', (150 + scrollWidth) + 'px');
							});
							conn.roster.init(conn);
							conn.roster.get(function(roster) {
								buildBuddyList(roster);
								conn.addHandler(updatePresence, null, 'presence');
								conn.addHandler(handleMessage, null, 'message', 'chat');
								conn.send($pres());
							});
							myID = jid2ID(username + '@' + domain);
						});
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
						$('#loginInfo').css('color', '#999');
						$('#loginInfo').html('Thank you for using Cryptocat.');
						$('#bubble').animate({'width': '670px'});
						$('#bubble').animate({'height': '310px'}).animate({'margin-top': '+=4.25%'}, function() {
							$('#buddyList div').remove();
							$('#conversationWindow').html('');
							conversations = [];
							myID = username = null;
							$('#username').val('username');
							$('#password').val('password');
							$('#username').attr('readonly', false);
							$('#password').attr('readonly', false);
							$('#newAccount').attr('checked', false);
							$('#loginSubmit').attr('readonly', false);
							$('#info').fadeIn();
							$('#loginForm').fadeIn('fast', function() {
								$('#username').select();
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
}
