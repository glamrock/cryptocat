/* Initialization */
var conn;
$('#username').attr('autocomplete', 'off');
function jidToId(jid) {
	return Strophe.getBareJidFromJid(jid)
		.replace('@', '-')
		.replace('.', '-');
}
function buildBuddyList(iq) {
	console.log(iq);
	$(iq).find('item').each(function() {
		var jid = $(this).attr('jid');
		var name = $(this).attr('name') || jid;
		var jidID = jidToId(jid);
		console.log(jidID);
	});
}
function loginFail(message) {
	$('#loginInfo').html(message);
	$('#bubble').animate({'left': '+=5px'}, 100, function() {
		$('#bubble').animate({'left': '-=10px'}, 100, function() {
			$('#bubble').animate({'left': '+=5px'}, 100);
		});
	});
	$('#loginInfo').css('color', '#F00');
	$('#username').attr('readonly', false);
	$('#password').attr('readonly', false);
	$('#username').select();
}

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
	connect($('#username').val(), $('#password').val());
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
				$("#loginSubmit").click().delay(1000);
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
							$('#buddyList').fadeIn(130, function() {
								function fadeAll(elems) {
									elems.filter(':hidden:first').fadeIn(130, function() { fadeAll(elems); });
								}
								fadeAll($('#buddyList div'));
								$('#conversationWindow').fadeIn();
							});
						});
						var iq = $iq({type: 'get'}).c('query', {xmlns: 'jabber:iq:roster'});
						conn.sendIQ(iq, buildBuddyList);
					});
				});
			}
			else if (status === Strophe.Status.DISCONNECTED) {
				$('#loginInfo').html('Disconnected.');
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
