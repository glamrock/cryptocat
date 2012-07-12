/* Initialization */
var domain =  'crypto.cat';
var conn;
var myID;
function loginFail(message) {
	$('#loginInfo').html(message);
	$('#bubble').animate({'left': '+=5px'}, 130)
		.animate({'left': '-=10px'}, 130)
		.animate({'left': '+=5px'}, 130);
	$('#loginInfo').css('color', '#F00');
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
function updatePresence(presence) {
	var from = jid2ID($(presence).attr('from'));
	var rosterID = $(presence).attr('from').match(/^(\w|\@|\.)+/)[0];
	if (from === myID) {
		return true;
	}
	if ($('#' + from).length === 0) {
		if (rosterID.length > 22) {
			rosterID = rosterID.substring(0, 19) + '...';
		}
		$('<div class="buddy" title="' + from + '" id="' + from + '" status="offline">'
				+ rosterID + '</div>').insertBefore('#buddyListEnd');
	}
	if ($(presence).attr('type') === 'unavailable') {
		$('#' + from).attr('status', 'offline');
		$('#' + from).animate({'color': '#BBB', 'backgroundColor': '#222', 'borderLeftColor': '#111'});
		$('#' + from).slideUp('fast', function() {
			$(this).insertBefore('#buddyListEnd').slideDown('fast');
		});
	}
	else if ($(presence).attr('type') === 'subscribe') {
		var authorizeForm = '<form id="authorizeForm"><div class="bar">authorize new buddy?</div>'
			+ '<div class="bar">' + rosterID + '</div>'
			+ '<div id="yes" class="yes">yes</div><div id="no" class="no">no</div></form>';
		dialogBox(authorizeForm, 0);
		$('#yes').click(function() {
			conn.roster.authorize(rosterID);
			conn.addHandler(updatePresence, null, 'presence');
			$('#dialogBoxClose').click();
		});
		$('#no').click(function() {
			conn.roster.unauthorize(rosterID);
			conn.addHandler(updatePresence, null, 'presence');
			$('#dialogBoxClose').click();
		});
		return false;
	}
	else {
		if ($(presence).find('show').text() === '' || $(presence).find('show').text() === 'chat') {
			$('#' + from).attr('status', 'online');
			$('#' + from).animate({'color': '#FFF', 'backgroundColor': '#76BDE5', 'borderLeftColor': '#6BA7C9'});
		}
		else {
			$('#' + from).attr('status', 'away');
			$('#' + from).animate({'color': '#FFF', 'backgroundColor': '#F00', 'borderLeftColor': '#E00'});
		}
		$('#' + from).slideUp('fast', function() {
			$(this).insertAfter('#buddyListStart').slideDown('fast');
		});
	}
	return true;
}
function dialogBox(data, closeable) {
	$('#dialogBoxClose').css('display', 'block');
	if (!closeable) {
		$('#dialogBoxClose').css('display', 'none');
	}
	$('#dialogBoxContent').html(data);
	$('#dialogBox').animate({'top': '+=460px'}, 'fast').animate({'top': '-=10px'}, 'fast');
}
$('#dialogBoxClose').click(function() {
	$('#dialogBox').animate({'top': '+=10px'}, 'fast').animate({'top': '-450px'}, 'fast');
});
$('#add').click(function() {
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
		connect($('#username').val(), $('#password').val());
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
				$('#loginInfo').css('color', '#F00');
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
							//$('#buddyListStart').fadeIn();
							conn.roster.init(conn);
							conn.roster.get(function(roster) {
								buildBuddyList(roster);
								conn.addHandler(updatePresence, null, 'presence');
								conn.send($pres());
							});
							$('#buddyListStart').html(username + '@' + domain);
							myID = jid2ID(username + '@' + domain);
							//$('#conversationWindow').fadeIn();
						});
					});
				});
			}
			else if (status === Strophe.Status.DISCONNECTED) {
				$('.button').fadeOut('fast');
				$('#buddyList').fadeOut(function() {
					//$('#conversationWindow').fadeOut();
					$('#loginInfo').css('color', '#999');
					$('#loginInfo').html('Thank you for using Cryptocat.');
					$('#bubble').animate({'width': '670px'});
					$('#bubble').animate({'height': '310px'}).animate({'margin-top': '+=4.25%'}, function() {
						$('#buddyList div').remove();
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
