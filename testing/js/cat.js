/* Initialization */
var domain =  'crypto.cat';
var conversations = [];
var conn, myID, currentConversation, username;
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
function buildBuddyList(roster) {
	for (var i in roster) {
		var rosterID = roster[i].jid;
		if (rosterID.length > 22) {
			rosterID = rosterID.substring(0, 19) + '...';
		}
		$('<div class="buddy" title="' + roster[i].jid + '" id="' + jid2ID(roster[i].jid) + '" status="offline">'
			+ rosterID + '</div>').insertAfter('#buddyListStart').slideDown('fast');
	}
}
function goOffline(buddy) {
	$(buddy).attr('status', 'offline');
	$(buddy).animate({
		'color': '#BBB',
		'backgroundColor': '#222',
		'borderLeftColor': '#111'
	});
	$(buddy).css('cursor', 'default');
	$(buddy).slideUp('fast', function() {
		$(this).insertBefore('#buddyListEnd').slideDown('fast');
	});
}
function updatePresence(presence) {
	var from = jid2ID($(presence).attr('from'));
	var rosterID = $(presence).attr('from').match(/^(\w|\@|\.)+/)[0];
	if (from === myID) {
		return true;
	}
	if ($('#' + from).length === 0) {
		if (rosterID.length > 24) {
			rosterID = rosterID.substring(0, 21) + '...';
		}
		$('<div class="buddy" title="' + rosterID + '" id="' + from + '" status="offline">'
			+ rosterID + '</div>').insertBefore('#buddyListEnd');
	}
	if ($(presence).attr('type') === 'unavailable') {
		goOffline('#' + from);
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
			$('#' + from).attr('status', 'online');
			$('#' + from).animate({
				'color': '#FFF',
				'backgroundColor': '#76BDE5',
				'borderLeftColor': '#97CEEC'
			});
		}
		else {
			$('#' + from).attr('status', 'away');
			$('#' + from).animate({
				'color': '#FFF',
				'backgroundColor': '#E93028',
				'borderLeftColor': '#97CEEC'
			});
		}
		$('#' + from).css('cursor', 'pointer');
		$('#' + from).slideUp('fast', function() {
			$(this).insertAfter('#buddyListStart').slideDown('fast');
		});
		$('#' + from).click(function() {
			$('#buddyList div').each(function(index, item) {
				if ($(item).css('border-left-width') !== '3px') {
					$(item).animate({'border-left-width': '3px', 'right': '0px'}, 300, function() {
					});
				}
			});
			if ($(this).attr('status') !== 'offline' && $(this).css('border-left-width') === '3px') {
				$(this).animate({'border-left-width': '25px', 'right': '22px'}, 300, function() {
					currentConversation = $(this).attr('title');
					$('#conversationWindow').slideDown(function() {
						var scrollWidth = document.getElementById('conversationWindow').scrollWidth;
						$('#conversationWindow').css('width', (702 + scrollWidth) + 'px');
						$('#userInput').fadeIn();
					});
				});
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
	var addBuddyForm = '<form id="removeBuddyForm"><div class="bar">remove a buddy:</div>'
		+ '<input id="removeBuddyJID" class="bar" type="text" value="user@' + domain + '" autocomplete="off"/>'
		+ '<input class="yes" id="removeBuddySubmit" type="submit" value="Remove buddy :("/><br /><br />'
		+ '</form>';
	dialogBox(addBuddyForm, 1);
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
	return true;
}
function addtoConversation(message, sender, conversation) {
	if (!conversations[conversation]) {
		conversations[conversation] = '<div class="Line0">Cryptocat chat initiated.</div>';
	}
	if (sender === username) {
		lineDecoration = 1;
	}
	else {
		lineDecoration = 2;
	}
	sender = '<span class="sender">' + sender + '</span>';
	message = '<div class="Line' + lineDecoration + '">' + sender + message + '</div>';
	conversations[conversation] += message;
	$('#conversationWindow').append(message);
	if ((document.getElementById('conversationWindow').scrollHeight - $('#conversationWindow').scrollTop()) < 800) {	
		$('#conversationWindow').animate({scrollTop: document.getElementById('conversationWindow').scrollHeight + 20}, 600);
	}
}
$('#userInput').submit(function() {
	var message = $('#userInputText').val();
	$('#userInputText').val('');
	conn.send($msg({to: currentConversation, 'type': 'chat'}).c('body').t(message));
	message = message;
	addtoConversation(message, username, currentConversation);
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
				$('#loginInfo').html('Registered. Connecting...');
				$('#newAccount').attr('checked', false).attr('readonly', true);
				$('#loginSubmit').delay(500).click();
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
							$('#buddyList').fadeIn();
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
					$('#conversationWindow').slideUp(function() {
						$('#buddyList').fadeOut();
						$('#loginInfo').css('color', '#999');
						$('#loginInfo').html('Thank you for using Cryptocat.');
						$('#bubble').animate({'width': '670px'});
						$('#bubble').animate({'height': '310px'}).animate({'margin-top': '+=4.25%'}, function() {
							$('#buddyList div').remove();
							$('#conversationWindow').html();
							conversations = [];
							myID = username = null;
							$('#username').val('username');
							$('#password').val('password');
							$('#username').attr('readonly', false);
							$('#password').attr('readonly', false);
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
