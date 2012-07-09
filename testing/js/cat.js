/* Initialization */
var conn;
$('#username').attr('autocomplete', 'off');
function jidToId() {
	return Strophe.getBareJidFromJid(jid)
		.replace('@', '-')
		.replace('.', '-');
}
function buddyList(iq) {
	$(iq).find('item').each(function() {
		var jid = $(this).attr('jid');
		var name = $(this).attr('name') || jid;
		var jidID = jidToId(jid);
		alert(jid);
	});
}

/* Login Form */
$('#username').select();
$('#username').click(function() {
	$(this).select();
});
$('#password').click(function() {
	$(this).select();
});
$('#newAccount').click(function() {
	alert('New account registration doesn\'t work yet.');
});
$('#loginForm').submit(function() {
	$('#username').attr('readonly', true);
	$('#password').attr('readonly', true);
	connect($('#username').val() + '@crypto.cat', $('#password').val());
	return false;
});

/* Connection */
function connect(username, password) {
	conn = new Strophe.Connection('https://crypto.cat/http-bind');
	conn.connect(username, password, function(status) {
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
			$('#login').animate({'top': '+=10px'}, function() {
				$('#login').animate({'top': '-=500px'}, function() {
					var iq = $iq({type: 'get'}).c('query', {xmlns: 'jabber:iq:roster'});
					conn.sendIQ(iq, buddyList);
					/* Morph here */
				});
			});
		}
		else if (status === Strophe.Status.DISCONNECTED) {
			$('#loginInfo').html('Disconnected.');
		}
		else if (status === Strophe.Status.AUTHFAIL){
			$('#loginInfo').html('Authentication failure.');
			$('#loginInfo').css('color', '#F00');
			$('#username').attr('readonly', false);
			$('#password').attr('readonly', false);
			$('#username').select();
			console.log('authfail');
		}
		else if (status === Strophe.Status.ERROR) {
			console.log('status ' + status);
		}
	});
}
