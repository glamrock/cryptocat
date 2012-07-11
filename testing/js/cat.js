/* Initialization */
var domain =  'crypto.cat';
var conn;
var myID;
$('#username').attr('autocomplete', 'off');
function jid2ID(jid) {
	jid = jid.match(/^(\w|\@|\.)+/);
	return jid[0].replace('@', '-').replace('.', '-');
}
function buildBuddyList(roster) {
	console.log(roster);
	for (var i in roster) {
		$('<div class="buddy" id="' + jid2ID(roster[i].jid) + '">' + roster[i].jid + '</div>').insertAfter('#buddyListStart');
	}
	$('#buddyList').fadeIn(130, function() {
		function fadeAll(elems) {
			elems.filter(':hidden:first').fadeIn(130, function() { fadeAll(elems); });
		}
		fadeAll($('#buddyList div'));
		
	});
}
function updatePresence(presence) { 
	console.log(presence);
	var from = jid2ID($(presence).attr('from'));
		if ($(presence).attr('type') === 'unavailable') {
			$('#' + from).animate({'color': '#BBB', 'backgroundColor': '#222', 'borderLeftColor': '#111'});
			$('#' + from).slideUp(function() {
				$(this).insertBefore('#buddyListEnd').slideDown();
			});
		}
		else {
			if ($(presence).find('show').text() === '' || $(presence).find('show').text() === 'chat') {
				$('#' + from).animate({'color': '#FFF', 'backgroundColor': '#76BDE5', 'borderLeftColor': '#6BA7C9'});
			}
			else {
				$('#' + from).animate({'color': '#FFF', 'backgroundColor': '#F00', 'borderLeftColor': '#E00'});
			}
			$('#' + from).slideUp(function() {
				$(this).insertAfter('#buddyListStart').slideDown();
			});
		}
		return true;
}
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
							conn.roster.init(conn);
							conn.roster.get(function(roster) {
								buildBuddyList(roster);
							});
							conn.addHandler(updatePresence, null, 'presence');
							conn.send($pres());
							myID = jid2ID(username + '@' + domain);
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
