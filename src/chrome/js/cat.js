/* Initialization */
var conn;
$('#username').attr('autocomplete', 'off');
function jidToId(jid) {
	return Strophe.getBareJidFromJid(jid);
		//.replace('@', '-')
		//.replace('.', '-');
}
function buildBuddyList(iq) {
	console.log(iq);
	$(iq).find('item').each(function() {
		var jid = $(this).attr('jid');
		var name = $(this).attr('name') || jid;
		var jidID = jidToId(jid);
		if ($('#buddyList div:last').attr('class') === 'buddyBlue') {
			$('#buddyList').append('<div class="buddyBlue">' + jid + '</div>');
		}
		else {
			$('#buddyList').append('<div class="buddyBlue">' + jid + '</div>');
		}
	});
	$('#buddyList').fadeIn(130, function() {
		function fadeAll(elems) {
			elems.filter(':hidden:first').fadeIn(130, function() { fadeAll(elems); });
		}
		fadeAll($('#buddyList div'));
		
	});
}
function loginFail(message) {
	$('#loginInfo').html(message);
	$('#bubble').animate({'left': '+=5px'}, 100)
		.animate({'left': '-=10px'}, 100)
		.animate({'left': '+=5px'}, 100);
	$('#loginInfo').css('color', '#F00');
	$('#username').attr('readonly', false);
	$('#password').attr('readonly', false);
	$('#username').select();
}
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
	$('#username').attr('readonly', true);
	$('#password').attr('readonly', true);
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
		conn.connect(username + '@crypto.cat', password, function(status) {
			if (status === Strophe.Status.CONNECTING) {
				$('#loginInfo').css('color', '#999');
				$('#loginInfo').html('Connecting...');
			}
			else if (status === Strophe.Status.CONNFAIL) {
				$('#username').attr('readonly', false);
				$('#password').attr('readonly', false);
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
							var iq = $iq({type: 'get'}).c('query', {xmlns: 'jabber:iq:roster'});
							conn.sendIQ(iq, buildBuddyList);
							//$('#conversationWindow').fadeIn();
						});
					});
				});
			}
			else if (status === Strophe.Status.DISCONNECTED) {
				$('#logout').fadeOut('fast', function() {
					$('.button').fadeOut();
					$('#buddyList').fadeOut();
					//$('#conversationWindow').fadeOut();
					$('#loginInfo').css('color', '#999');
					$('#loginInfo').html('Thank you for using Cryptocat.');
					$('#bubble').animate({'width': '670px'});
					$('#bubble').animate({'height': '310px'}).animate({'margin-top': '+=4.4%'}, function() {
						$('#buddyList').html('');
						$('#username').val('username');
						$('#password').val('password');
						$('#username').attr('readonly', false);
						$('#password').attr('readonly', false);
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
