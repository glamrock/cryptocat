var seed = Math.seedrandom();
var z = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4096, 0];
var sound = notifications = pos = tag = prikey = pubkey = last = 0;
var browser = navigator.userAgent.toLowerCase();
var cfocus = true;
var soundEmbed = null;
var nick = $('#nick').html();
var name = $('#name').html();
var seq_s = [];
var seq_r = [];
var keys = [];
var names = [];
var queue = [];
var seckeys = [];
var usedhmac = [];
var inblocked = [];
var outblocked = [];
var fingerprints = [];

/*var notice = [
'Cryptocat is supported by people like you. Check out our <a href="https://crypto.cat/donate/" target="_blank">fundraiser</a> and keep us going.',
'Help Cryptocat become better - please <a href="https://crypto.cat/donate/" target="_blank">donate</a> by buying Cryptocat stickers!',
'Cryptocat is an open software effort. Your <a href="https://crypto.cat/donate/" target="_blank">donations</a> help us improve.',
'You can donate to Cryptocat using Bitcoin! Please <a href="https://crypto.cat/donate/" target="_blank">contribute</a> and keep us going.',
'Cryptocat is volunteer-run and handles thousands of conversations a week. Please <a href="https://crypto.cat/donate/" target="_blank">donate</a> today.'
];*/

var day = 139 - (Math.round((((new Date()) - (new Date((new Date()).getFullYear(), 0, 1))) / 1000 / 60 / 60 / 24) + .5, 0));
var notice = ['Only '+day+' days left of the Cryptocat Fundraiser - <a href="http://www.indiegogo.com/cryptocat" target="_blank">Please support a year of open development.</a>'];

function scrolldown(s) {
	$('#chat').animate({scrollTop: document.getElementById('chat').scrollHeight + 20}, s);
}

function getstamp(n) {
	var time = new Date();
	var h = time.getHours();
	var m = time.getMinutes();
	var spaces = '';
	for (si=0; si < (n.length - 5); si++) {
		spaces += '&#160;';
	}
	if (String(h).length === 1) {
		h = '0' + String(h);
	}
	if (String(m).length === 1) {
		m = '0' + String(m);
	}
	return spaces + h + ':' + m;
}

function soundPlay(which) {
	function createSound(which) {
		soundEmbed = document.createElement('audio');
		soundEmbed.setAttribute('type', 'audio/webm');
		soundEmbed.setAttribute('src', which);
		soundEmbed.setAttribute('style', 'display: none;');
		soundEmbed.setAttribute('autoplay', true);
	}
	if (!soundEmbed) {
		createSound(which);
	}
	else {
		document.body.removeChild(soundEmbed);
		soundEmbed.removed = true;
		soundEmbed = null;
		createSound(which);
	}
	soundEmbed.removed = false;
	document.body.appendChild(soundEmbed);
}

function textcounter(field,cntfield,maxlimit) {
	if (field.value.length > maxlimit) {
		field.value = field.value.substring(0, maxlimit);
	}
	else {
		cntfield.value = maxlimit - field.value.length;
	}
}

function integritycheck() {
	Math.seedrandom(str2bigInt(Crypto.HMAC(Whirlpool, Whirlpool('TaTWU55cBtxn65IP8KLD3GQjbrdQbhEo'), Whirlpool('UQ4rRqtvnFjoAQySIvoIMNLNpKeiW6fi')), 16).join(''));
	var testkey = Crypto.util.hexToBytes('744177635650617268753643526a6774775a3445353256584d72756d76725433');
	var testclear = 'A1695BD7CE297A4B8D84BD183A6F0C26F1D56BD12F025B3A07EB25AE60512F9A3A214130843C9479DBFD62E99D4BC151854D5C4A1C1603CCD889F618C0D2B096';
	var testbigint = bigInt2str(str2bigInt('2XQLlNpYbwIus4lHWwRmmcyTLhqIy2Mpe7woMkO54lcZeXGJ24F9Hvs=rYwPrBmL65JLnA71O3pDY9zXZ0qh2M', 64), 16);
	var testencrypt = Crypto.AES.encrypt(Whirlpool('TDqIfHBOvxoPGCRbbJAIqV3GoftvPZ2s'), Crypto.charenc.Binary.stringToBytes(gen(32, 1, 0)), {
		mode: new Crypto.mode.CBC(Crypto.pad.iso10126)});
	var testdecrypt = Crypto.AES.decrypt(testencrypt, testkey, {
		mode: new Crypto.mode.CBC(Crypto.pad.iso10126)});
	if (testdecrypt === testclear && testclear === testbigint) {
		Math.seedrandom(Crypto.Fortuna.RandomData(512) + Whirlpool(seed));
		return 1;
	}
	return 0;
}

function gen(size, extra, s) {
	if (s) {
		Math.seedrandom(Crypto.Fortuna.RandomData(512) + Whirlpool(seed));
	}
	var str = '';
	var charset = '123456789';
	if (extra) {
		charset += 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
	}
	str += charset.charAt(Math.floor(Math.random() * charset.length));
	charset += '0';
	while (str.length < size) {
		str += charset.charAt(Math.floor(Math.random() * charset.length));
	}
	return str;
}

function tagify(line) {
	var mime = new RegExp('(data:(application\/((x-compressed)|(x-zip-compressed)|(zip)))|(multipart\/x-zip)).*');
	line = line.replace(/</g,'&lt;').replace(/>/g,'&gt;');
	if ((match = line.match(/((mailto\:|(news|(ht|f)tp(s?))\:\/\/){1}\S+)/gi)) && genurl) {
		for (mc = 0; mc <= match.length - 1; mc++) {
			var sanitize = match[mc].split('');
			for (ii = 0; ii <= sanitize.length-1; ii++) {
				if (!sanitize[ii].match(/\w|\d|\:|\/|\?|\=|\#|\+|\,|\.|\&|\;|\%/)) {
					sanitize[ii] = encodeURIComponent(sanitize[ii]);
				}
			}
			sanitize = sanitize.join('');
			line = line.replace(sanitize, '<a target="_blank" href="' + sanitize + '">' + match[mc] + '</a>');
		}
	}
	else {
		line = line.replace(/(:|=)-?3/gi, '<div class="emoticon" id="e_cat">$&</div>');
		line = line.replace(/(:|=)-?'\(/gi, '<div class="emoticon" id="e_cry">$&</div>');
		line = line.replace(/(:|=)-?o/gi, '<div class="emoticon" id="e_gasp">$&</div>');
		line = line.replace(/(:|=)-?D/gi, '<div class="emoticon" id="e_grin">$&</div>');
		line = line.replace(/(:|=)-?\(/gi, '<div class="emoticon" id="e_sad">$&</div>');
		line = line.replace(/(:|=)-?\)/gi, '<div class="emoticon" id="e_smile">$&</div>');
		line = line.replace(/-_-/gi, '<div class="emoticon" id="e_squint">$&</div>');
		line = line.replace(/(:|=)-?p/gi, '<div class="emoticon" id="e_tongue">$&</div>');
		line = line.replace(/(:|=)-?(\/|s)/gi, '<div class="emoticon" id="e_unsure">$&</div>');
		line = line.replace(/;-?\)/gi, '<div class="emoticon" id="e_wink">$&</div>');
		line = line.replace(/;-?\p/gi, '<div class="emoticon" id="e_winktongue">$&</div>');
		line = line.replace(/\^(_|\.)?\^/gi, '<div class="emoticon" id="e_yay">$&</div>');
		line = line.replace(/(:|=)-?x/gi, '<div class="emoticon" id="e_shut">$&</div>');
		line = line.replace(/\&lt\;3/g, '<span class="monospace">&#9829;</span>');
	}
	thisnick = line.match(/^[a-z]{1,12}/).toString();
	if (match = line.match(/^[a-z]{1,12}/)) {
		var atmatch = line.match(/^[a-z]{1,12}:\s\@[a-z]{1,12}/);
		if (atmatch && jQuery.inArray(atmatch.toString().substring(thisnick.length + 3), names) >= 0 &&
		(atmatch.toString().substring(thisnick.length + 3) === nick || thisnick === nick)) {
			line = line.replace(/^[a-z]{1,12}\:\s\@[a-z]{1,12}/, '<span class="nick">' + thisnick + ' <span class="blue">&gt;</span> ' +
			atmatch.toString().substring(thisnick.length + 3) + '</span>');  
			if (match = line.match(/data:image\S+$/)) {
				line = line.replace(/data:image.+/, '<a onclick="display(\'' + match + '\', \'' + getstamp(5) + '\', 1)">view encrypted image</a>');
			}
			else if (match = line.match(mime)) {
				line = line.replace(mime, '<a onclick="display(\'' + match[0] + '\', \'' + getstamp(5) + '\', 0)">download encrypted .zip file</a>');
			}
		}
		else {
			var stamp = getstamp(match[0]);
			line = line.replace(/^[a-z]{1,12}:/, '<span class="nick" onmouseover="this.innerHTML = \'' +
			stamp + '\';" onmouseout="this.innerHTML = \'' + match[0] + '\';">' + match[0] + '</span>');
		}
	}
	return line;
}

function process(line, sentid) {
	if (line) {
		line = $.trim(line);
		if (sentid) {
			line = tagify(line);
			pushline(line, sentid);
			return;
		}
		else if (match = line.match(/^[a-z]{1,12}\:\s\[:3\](\w|\/|\+|\?|\=)*\|(\d|a|b|c|d|e|f){128}\[:3\]$/)) {
			thisnick = $.trim(match[0].match(/^[a-z]{1,12}/));
			match = line.match(/\[:3\](.*)\|/);
			match = match[0].substring(4, match[0].length - 1);
			var hmac = line.match(/\|\w{128}/);
			hmac = hmac[0].substring(1);
			line = line.replace(/\|\w{128}/, '');
			if ((Crypto.HMAC(Whirlpool, match, seckeys[thisnick].substring(64, 128) + seq_r[thisnick]) !== hmac) || 
			(jQuery.inArray(hmac, usedhmac) >= 0)) {
				if (jQuery.inArray(thisnick, inblocked) < 0) {
					line = line.replace(/\[:3\](.*)\[:3\]/, '<span class="diffkey">Error: message authentication failure.</span>');
					pushline(line, pos);
					$('#' + pos).css('background-image', 'url("img/error.png")');
				}
			}
			else {
				seq_r[thisnick]++;
				match = Crypto.AES.decrypt(match, Crypto.util.hexToBytes(seckeys[thisnick].substring(0, 64)), {
					mode: new Crypto.mode.CBC(Crypto.pad.iso10126)
				});
				usedhmac.push(hmac);
				if (jQuery.inArray(thisnick, inblocked) < 0) {
					line = line.replace(/\[:3\](.*)\[:3\]/, match);
					line = tagify(line);
					pushline(line, pos);
					if ($("#" + pos).html().match(/data:.+\<\/a\>\<\/div\>$/)) {
						$("#" + pos).css('background-image', 'url("img/fileb.png")');
					}
				}
				return [thisnick, line.match(/<\/span>.+$/).toString().substring(8)];
			}
		}
		else if (match = line.match(/^(\&gt\;|\&lt\;)\s[a-z]{1,12}\s(has arrived|has left)$/)) {
			updatekeys(true);
			line = '<span class="nick">' + match[0] + '</span>';
			pushline(line, pos);
			$("#" + pos).css('background-image', 'url("img/user.png")');
			line = match[0].toString().substring(5);
			return [line.match(/^\w+/).toString(), line];
		}
		else {
			thisnick = $.trim(match[0].match(/^[a-z]{1,12}/));
			if (jQuery.inArray(thisnick, inblocked) < 0) {
				line = '<span class="diffkey">Error: invalid message received.</span>';
				pushline(line, pos);
				$('#' + pos).css('background-image', 'url("img/error.png")');
			}
		}
	}
	return;
}

function pushline(line, id) {
	if (tag === 'msg') {tag = 'gsm';}
	else {tag = 'msg';}
	line = '<div class="' + tag + '" id="' + id + '"><div class="text">' + line + '</div></div>';
	$('#chat').html($('#chat').html() + line);
	if (sound) {
		soundPlay('snd/msg.webm');
	}
}

function updatekeys(sync) {
	$.ajax({ url: install,
		type: 'POST', async: sync,
		data: 'nick=' + $('#nickinput').val() + '&name=' + name + '&key=get',
		success: function(data) {
			data = data.split('|');
			data.splice(data.length - 1, 1);
			if (data.length !== names.length) {
				oldnames = names.slice(0);
				names = [];
				fingerprints = [];
				for (var i=0; i <= data.length - 1; i++) {
					names[i] = data[i].replace(/:.+$/, '');
					if (typeof keys[names[i]] === 'undefined') {
						seq_s[names[i]] = 1;
						seq_r[names[i]] = 1;
						keys[names[i]] = data[i].replace(/^[a-z]{1,12}:/, '');
						seckeys[names[i]] = Whirlpool(ecDH(prikey, str2bigInt(keys[names[i]], 64)));
					}
					var big = str2bigInt(keys[names[i]], 64);
					if ((equals(big, p25519) || greater(big, p25519) || greater(z, big)) || 
					(keys[names[i]] !== data[i].replace(/^[a-z]{1,12}:/, ''))) {
						fingerprints[names[i]] = '<span class="red">DANGER: This user is using suspicious keys.' + 
						' Communicating with this user is strongly not recommended.</span>';
						userinfo(names[i]);
					}
					else {
						fingerprints[names[i]] = Whirlpool(names[i] + keys[names[i]]);
						fingerprints[names[i]] = 
						fingerprints[names[i]].substring(24, 32)  + ':' + 
						fingerprints[names[i]].substring(48, 56)  + ':' + 
						fingerprints[names[i]].substring(72, 80)  + ':' + 
						fingerprints[names[i]].substring(96, 104) + ':' + 
						fingerprints[names[i]].substring(120, 128);
						fingerprints[names[i]] = fingerprints[names[i]].toUpperCase();
					}
				}
				for (var i=0; i !== oldnames.length; i++) {
					if (jQuery.inArray(oldnames[i], names) < 0) {
						delete seq_s[oldnames[i]];
						delete seq_r[oldnames[i]];
						delete keys[oldnames[i]];
						delete seckeys[oldnames[i]];
					}
				}
			}
			var users = [];
			for (var i=0; i!==names.length; i++) {
				users[i] = '<span class="user" onclick="userinfo(\'' + names[i] + '\')">' + names[i] + '</span>';
			}
			$("#users").html('<span class="users">' + users.length + '</span> ' + users.join(' '));
		}
	});
}

function updatechat() {
	$.ajax({ url: install, type: 'POST', async: true, 
		data: 'chat=' + name,
		success: function(data) {
			if (data === 'NOEXIST') {
				if (pubkey) {
					errored('your chat no longer exists.');
					$("#chat").html('<div class="bsg">' + notice[Math.floor(Math.random()*notice.length)] + '</div>');
					clearInterval(interval);
				}
			}
			else if (data === "NOLOGIN") {
				if (pubkey) {
					errored("you have been logged out.");
					clearInterval(interval);
				}
			}
			else if (data !== '') {
				pos++;
				if (data.match(/\s/)) {
					var message = process(data, 0);
					message[1] = message[1].replace(/<div class.+<\/div>/, '');
					if ((document.getElementById("chat").scrollHeight - $("#chat").scrollTop()) < 800) {
						scrolldown(600);
					}
					if (!cfocus || ((document.getElementById("chat").scrollHeight - $("#chat").scrollTop()) > 800)) {
						if (notifications) {
							Notification.createNotification('img/icon-128.png', message[0], message[1]);
						}
					}
				}
				else if (data) {
					if ($("#" + data).html().match(/data:.+\<\/a\>\<\/div\>$/)) {
						$("#" + data).css('background-image', 'url("img/fileb.png")');
					}
					else {
						$("#" + data).css('background-image', 'url("img/chat.png")');
					}
					$("#" + data).attr("id", "x");
				}
			}
			if ($("#users").html() === '<span class="users">x</span>&nbsp; connection issues. stand by...') {
				updatekeys(true);
				$("#users").css("background-color", "#97CEEC");
			}
			if (queue[0]) {
				if (last && $("#" + last).css("background-image")) {
					return;
				}
				else if (last) {
					queue.splice(0, 1);
					if (!queue[0]) {
						last = 0;
						return;
					}
				}
				var msg = queue[0][0];
				var sentid = queue[0][1];
				if ((msg[0] === "@") && (jQuery.inArray(msg.match(/^\@[a-z]{1,12}/).toString().substring(1), names) >= 0)) {
					if (msg.match(/^\@[a-z]{1,12}/).toString().substring(1) === nick) {
						$("#" + sentid).css('background-image', 'url("img/chat.png")');
						queue.splice(0,1);
						return;
					}
					var loc = jQuery.inArray(msg.match(/^\@[a-z]{1,12}/).toString().substring(1), names);
					var crypt = Crypto.AES.encrypt(queue[0][0], 
					Crypto.util.hexToBytes(seckeys[names[loc]].substring(0, 64)), {
						mode: new Crypto.mode.CBC(Crypto.pad.iso10126)
					});
					var msg = "(" + msg.match(/^\@[a-z]{1,12}/).toString().substring(1) + ")" + crypt;
					msg += "|" + Crypto.HMAC(Whirlpool, crypt, seckeys[names[loc]].substring(64, 128) + seq_s[names[loc]]);
					seq_s[names[loc]]++;
				}
				else {
					var msg = '';
					for (var i=0; i !== names.length; i++) {
						if (names && (names[i] !== nick) && (jQuery.inArray(names[i], outblocked) < 0)) {
							var crypt = Crypto.AES.encrypt(queue[0][0],
							Crypto.util.hexToBytes(seckeys[names[i]].substring(0, 64)), {
								mode: new Crypto.mode.CBC(Crypto.pad.iso10126)
							});
							msg += "(" + names[i] + ")" + crypt;
							msg += "|" + Crypto.HMAC(Whirlpool, crypt, seckeys[names[i]].substring(64, 128) + seq_s[names[i]]);
							seq_s[names[i]]++;
						}
					}
				}
				msg = nick + "|" + sentid + ": " + "[:3]" + msg + "[:3]";
				msg = "name=" + name + "&talk=send" + "&input=" + msg.replace(/\+/g, "%2B");
				last = sentid;
				function postmsg() {
					$.ajax({
						type: 'POST', url: install,
						data: msg,
						error: function() {
							postmsg();
						}
					});
				}
				postmsg();
			}
		}
	});
}

function sendmsg(msg) {
	msg = msg.replace(/\$/g,"&#36;");
	$("#input").val('');
	$("#input").focus();
	if (msg !== '') {
		var sentid = gen(8, 1, 0);
		process(nick + ": " + msg, sentid);
		scrolldown(600);
		if (names.length > 1) {
			$("#" + sentid).css('background-image', 'url("img/sending.gif")');
			queue.push([msg, sentid]);
			$("#talk").val(maxinput);
		}
	}
}

$("#chatform").submit(function() {
	sendmsg($.trim($("#input").val()));
	return false;
});

$("#nickform").submit(function() {
	function seeded() {
		$('#keytext').css('margin-top', '-=6px');
		$('#keytext').html("<br />Checking integrity");
		if (integritycheck()) {
			$('#keytext').html($('#keytext').html() + 
			'  &#160;<span class="blue">OK</span>' + '<br />Generating keys');
			prikey = gen(32, 0, 1).toString();
			pubkey = bigInt2str(ecDH(prikey), 64);
			$('#keytext').html($('#keytext').html() + ' &#160; &#160; ' + 
			'<span class="blue">OK</span><br />Communicating');
			setTimeout("nickset()", 250);
		}
		else {
			$('#keytext').html('<span class="red">Integrity check failed. Cryptocat cannot proceed safely.</span>');
		}
	}
	$("#nickinput").val($("#nickinput").val().toLowerCase());
	if (!pubkey) {
		if (typeof window.crypto.getRandomValues === 'function') {
			var buf = new Uint8Array(512);
			window.crypto.getRandomValues(buf);
			for (var i=0; i<buf.byteLength; i++) {
				Crypto.Fortuna.AddRandomEvent(String.fromCharCode(buf[i]));
			}
		}
		if (Crypto.Fortuna.Ready() === 0) {
			$('#keytext').html('Type on your keyboard as randomly as possible for a few seconds:' + 
			'<br /><input type="password" id="keytropy" />');
		}
		$('#nickentry').fadeOut('fast', function() {
			$('#keygen').fadeIn('fast', function() {
				if (Crypto.Fortuna.Ready()) {
					seeded();
				}
				else {
					var down, up, e;
					$('#keytropy').focus();
					$('#keytropy').keydown(function(event) {
						if (Crypto.Fortuna.Ready() === 0) {
							e = String.fromCharCode(event.keyCode);
							var d = new Date();
							down = d.getTime();
						}
					});
					$('#keytropy').keyup(function() {
						if (Crypto.Fortuna.Ready() === 0) {
							var d = new Date();
							up = d.getTime();
							Crypto.Fortuna.AddRandomEvent(e + (up - down));
						}
						else {
							seeded();
						}
					});
				}
			});
		});
	}
	else {
		nickset();
	}
	return false;
});

$("#nickinput").keyup(function() {
	if ($("#nickinput").val().match(/^\w{1,12}$/)) {
		$("#nick").html($("#nickinput").val().toLowerCase());
	}
});

function nickset() {
	$.ajax({ url: install, type: "POST",
		data: "nick=" + $("#nickinput").val() + "&name=" + name + "&key=" + encodeURIComponent(pubkey),
		success: function(data) {
			if ((data !== "error") && (data !== "inuse") && (data !== "full")) {
				nick = $("#nick").html();
				$("#input").focus();
				document.title = '[-] Cryptocat';
				interval = setInterval("updatechat()", update);
				updatekeys(false);
				$('#keytext').html($('#keytext').html() + ' &#160; &#160; &#160; <span class="blue">OK</span>');
				$('#keygen').fadeOut('fast', function() {
					$("#changenick").fadeOut('fast');
					$("#nickentry").fadeOut('fast');
					$("#front").fadeOut('fast');
				});
				$('#chat').html('<div class="bsg">' + notice[Math.floor(Math.random()*notice.length)] + '</div>');
				updatechat();
			}
			else {
				$('#keygen').fadeOut('fast', function() {
					$("#nickentry").fadeIn('fast');
					if (data === "inuse") {
						$("#nickinput").val("nickname in use");
					}
					else if (data === "full") {
						$("#nickinput").val("chat is full");
					}
					else if (data === "error") {
						$("#nickinput").val("letters only");
					}
					$("#front").fadeIn();
					$("#nickinput").focus();
				});
			}
		}
	});
}

$('#file').click(function(){
	var mime = new RegExp('(image.*)|(application/((x-compressed)|(x-zip-compressed)|(zip)))|(multipart/x-zip)');
	$('#fadebox').html('<input type="button" id="close" value="x" />' +
	'<br /><h3>send encrypted file</h3>');
	if (window.File && window.FileReader) {
		$('#fadebox').html($('#fadebox').html() + 'Enter recipient: ' +
		'<input type="text" id="recipient" />' +
		'<br />Zip files and images accepted. Maximum size: <span class="blue">' + filesize + 
		'kb</span><br /><br /><span id="filewrap">' + 
		'<input type="button" id="filebutton" value="Select file" />' + 
		'<input type="file" id="fileselect" name="file[]" /></span><br /><br />');
		$('#recipient').keyup(function(){
			if (($('#recipient').val() === nick) || (jQuery.inArray($('#recipient').val(), names) < 0)) {
				$('#recipient').css('background-color', '#000');
				$('#recipient').css("color", "#97CEEC");
				$('#filebutton').css("display", "none");
			}
			else {
				$('#recipient').css('background-color', '#97CEEC');
				$('#recipient').css('color', '#FFF');
				$('#filebutton').css('display', 'inline');
			}
		});
		$("#filebutton").click(function(){
			$('input[type=file]').trigger('click');
		});
		function handleFileSelect(evt) {
			var file = evt.target.files;
			var reader = new FileReader();
			reader.onload = (function(theFile) {
				return function(e) {
					sendmsg('@' + $("#recipient").val() + ' ' + e.target.result);
				};
			})(file[0]);
			if (file[0].type.match(mime)) {
				if (file[0].size > (filesize * 1024)) {
					$("#filewrap").html('<span class="red">Maximum file size is ' + filesize + 'kb.</span>');
				}
				else {
					reader.readAsDataURL(file[0]);
					$("#close").click();
				}
			}
			else {
				$("#filewrap").html('<span class="red">Only zip and image files are supported.</span>');
			}
		}
		document.getElementById('fileselect').addEventListener('change', handleFileSelect, false);
	}
	else {
		$("#fadebox").html($("#fadebox").html() + 
		'Sorry, your browser does not support this feature. Consider switching to ' + 
		'<a href="http://google.com/chrome" target="_blank">Google Chrome</a>, it\'s great!');
	}
	$("#close").click(function(){
		$('#fadebox').fadeOut('fast', function() {
			$('#front').fadeOut(0);
		});
	});
	$('#front').fadeIn(0, function() {
		$('#fadebox').fadeIn('fast', function() {
			$("#recipient").focus();
		});
	});
});

function display(dataurl, time, image) {
	$("#fadebox").html('<input type="button" id="close" value="x" />');
	if (image) {
		$("#fadebox").html($("#fadebox").html() + '<br /><center><a href="' + dataurl +
		'" target="_blank"><img class="encrypted" src="' + dataurl + '" alt="" /></a><br />' +
		'<span style="margin-left:-10px">(<span class="blue">' + time + '</span>) click to enlarge</span></center>');
	}
	else {
		$('#fadebox').html($('#fadebox').html() + '<br /><br /><span class="blue">Note:</span> ' +
		'Some browsers may save the encrypted data with an incorrect file extension. ' +
		'Simply rename your file with a .zip extension to remedy this.<br /><br />' + 
		'<a class="download" href="' + dataurl + '" target="_blank">Download encrypted .zip file</a>');
	}
	$('#close').click(function(){
		$('#fadebox').fadeOut('fast', function() {
			$('#front').fadeOut(0);
		});
	});
	$('#front').fadeIn(0, function() {
		$('#fadebox').fadeIn('fast');
	});
}

$('#sound').click(function(){
	if (sound) {
		$('#sound').attr('src', 'img/nosound.png');
		$('#sound').attr('title', 'Message sounds off');
		sound = 0;
	}
	else {
		$('#sound').attr('src', 'img/sound.png');
		$('#sound').attr('title', 'Message sounds on');
		sound = 1;
	}
});

$('#notifications').click(function(){
	if (notifications) {
		$('#notifications').attr('src', 'img/nonotifications.png');
		$('#notifications').attr('title', 'Desktop notifications off');
		notifications = 0;
	}
	else {
		$('#notifications').attr('src', 'img/notifications.png');
		$('#notifications').attr('title', 'Desktop notifications on');
		notifications = 1;
		if (Notification.checkPermission() === 1){
			Notification.requestPermission();
		}
	}
});

$('#invite').click(function(){
	var url = 'https://www.facebook.com/dialog/send?app_id=348025968541285&name=Cryptocat%20Chat%20Invitation&description=' + 
	'Chat%20with%20your%20friends%20in%20privacy%20with%20secure%20encryption%20using%20Cryptocat.&redirect_uri=' + 
	'https://crypto.cat/?close&link=' + install + '?c=' + name + '&picture=' + install + 'img/ios.png&display=popup';
	var pop = window.open(url, 'name', 'height=330,width=550,location=0,menubar=0,resizable=0,scrollbars=0' + 
	',status=0,titlebar=0,toolbar=0,top='+($(window).height()/3.5)+',left='+($(window).width()/2.7));
	pop.focus();
});

$('#maximize').click(function(){
	if ($('#maximize').attr('title') === 'Contract') {
		$('#main').animate({'margin-top': '2%', 'min-width': '600px', 'min-height': '420px', width: '600px', height: '420px'}, 500);
		$('#info').animate({width: '588px'}, 500);
		$('#users').animate({width: '525px', 'padding-right': '3px'}, 500);
		$('#input').animate({width: '508px'}, 500);
		$('#talk').animate({width: '67px'}, 500);
		$('#inchat').animate({height: '343px', 'margin-bottom': '10px'}, 500);
		$('#chat').animate({height: '340px'}, 500, function() { scrolldown(999); });
		$('#maximize').attr('src', 'img/maximize.png');
		$('#maximize').attr('title', 'Expand');
	}
	else {
		$('#main').animate({'margin-top': '1%', 'min-width': '900px', width: '85%', height: '96.5%'}, 500);
		$('#info').animate({width: '99%'}, 500);
		$('#users').animate({width: '92.3%', 'padding-right': '20px'}, 500);
		$('#input').animate({width: '92.3%'}, 500);
		$('#talk').animate({width: '5.2%'}, 500);
		$('#inchat').animate({height: '93%', 'margin-bottom': '-30px'}, 500);
		$('#chat').animate({height: '91%'}, 500, function() { scrolldown(999); });
		$('#maximize').attr('src', 'img/minimize.png');
		$('#maximize').attr('title', 'Contract');
	}
});

function userinfo(n) {
	$('#fadebox').html('<input type="button" id="close" value="x" />' +
	'<br /><h3>' + n + '</h3>');
	if (n === nick) {
		$('#fadebox').html($('#fadebox').html() +
		'Users can send you a private message by typing:<br />' +
		'<span class="blue">@' + n + '</span> their message<br /><br />' +
		'<br />Verify your identity using your fingerprint:');
	}
	else {
		$('#fadebox').html($('#fadebox').html() +
		'Send <span class="blue">' + n + '</span> a private message:<br />' +
		'<span class="blue">@' + n + '</span> your message<br /><br />' +
		'View messages from <span class="blue">' + n + '</span>: &#160;<span class="block" id="incoming">yes</span><br />' +
		'Send my messages to <span class="blue">' + n + '</span>: <span class="block" id="outgoing">yes</span><br />' +
		'<br />Verify <span class="blue">' + n + '</span>\'s identity using their fingerprint:');
	}
	$('#fadebox').html($('#fadebox').html() + '<br />' + fingerprints[n]);
	if (jQuery.inArray(n, inblocked) >= 0) {
		$('#incoming').css('background-color', '#F00');
		$('#incoming').html('no');
	}
	$('#incoming').click(function(){
		if ($('#incoming').html() === 'no') {
			inblocked.splice(jQuery.inArray(n, inblocked));
			$('#incoming').css('background-color', '#97CEEC');
			$('#incoming').html('yes');
		}
		else {
			inblocked.push(n);
			$('#incoming').css('background-color', '#F00');
			$('#incoming').html('no');
		}
	});
	if (jQuery.inArray(n, outblocked) >= 0) {
		$('#outgoing').css('background-color', '#F00');
		$('#outgoing').html('no');
	}
	$('#outgoing').click(function(){
		if ($('#outgoing').html() === 'no') {
			outblocked.splice(jQuery.inArray(n, outblocked));
			$('#outgoing').css('background-color', '#97CEEC');
			$('#outgoing').html('yes');
		}
		else {
			outblocked.push(n);
			$('#outgoing').css('background-color', '#F00');
			$('#outgoing').html('no');
		}
	});
	$('#close').click(function(){
		$('#fadebox').fadeOut('fast', function() {
			$('#front').fadeOut(0);
		});
	});
	$('#front').fadeIn(0, function() {
		$('#fadebox').fadeIn('fast');
	});
}

$('#input').keyup(function(){
	textcounter(document.chatform.input,document.chatform.talk,256);
	if ((match = $('#input').val().match(/^\@[a-z]{1,12}/)) &&
	(jQuery.inArray($('#input').val().match(/^\@[a-z]{1,12}/).toString().substring(1), names) >= 0)) {
		$('#input').css('color', '#97CEEC');
	}
	else if ($('#input').css('color') === 'rgb(151, 206, 236)') {
		$('#input').css('color', '#FFF');
	}
});

$('#talk').mouseout(function(){
	textcounter(document.chatform.input,document.chatform.talk,256);
});

$('#talk').mouseover(function(){
	$('#talk').val('send');
});

window.onfocus = function() {
	clearTimeout(blur);
	cfocus = true;
	document.title = '[-] Cryptocat';
};
window.onblur = function() {
	blur = setTimeout('cfocus = false', update);
};
document.onblur = window.onblur;
document.focus = window.focus;

function logout() {
	$.ajax({ url: install,
		type: 'POST', async: false,
		data: 'logout=' + name
	});
}

function errored(e) {
	$('#users').html('<span class="users">x</span>&nbsp ' + e);
	$('#users').css('background-color', '#FE1A12');
}

$(document).ajaxError(function(){
	errored('connection issues. stand by...');
});

$('#front').fadeIn(0, function() {
	$('#nickentry').fadeIn('fast', function() {
		$('#nickinput').focus();
		$('#nickinput').select();
	});
});