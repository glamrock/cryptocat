/* Initialization */
var conn;
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
		console.log(jidID);
	});
}

/* Login Form */
$('#username').attr('autocomplete', 'off');
$('#username').select();
$('#username').click(function() {
	$(this).select();
});
$('#password').click(function() {
	$(this).select();
});
$('#newAccount').click(function() {
	//stuff here
});
$('#loginForm').submit(function() {
	$('#login').animate({'top': '+=10px'}, function() {
		$('#login').animate({'top': '-=500px'}, function() {
			connect($('#username').val(), $('#password').val());
		});
	});
	return false;
});

/* Connection */
function connect(username, password) {
	conn = new Strophe.Connection('https://crypto.cat/http-bind');
	conn.connect(username, password, function(status) {
		if (status === Strophe.Status.CONNECTED) {
			console.log('connected!');
			var iq = $iq({type: 'get'}).c('query', {xmlns: 'jabber:iq:roster'});
			conn.sendIQ(iq, buddyList);
		}
		else if (status === Strophe.Status.DISCONNECTED) {
			console.log('disconnected');
		}
	});
}