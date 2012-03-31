var seed = Math.seedrandom();

var p = 
"FFFFFFFF FFFFFFFF C90FDAA2 2168C234 C4C6628B 80DC1CD1 29024E08 8A67CC74" +
"020BBEA6 3B139B22 514A0879 8E3404DD EF9519B3 CD3A431B 302B0A6D F25F1437" +
"4FE1356D 6D51C245 E485B576 625E7EC6 F44C42E9 A637ED6B 0BFF5CB6 F406B7ED" +
"EE386BFB 5A899FA5 AE9F2411 7C4B1FE6 49286651 ECE45B3D C2007CB8 A163BF05" +
"98DA4836 1C55D39A 69163FA8 FD24CF5F 83655D23 DCA3AD96 1C62F356 208552BB" +
"9ED52907 7096966D 670C354E 4ABC9804 F1746C08 CA18217C 32905E46 2E36CE3B" +
"E39E772C 180E8603 9B2783A2 EC07A28F B5C55DF0 6F4C52C9 DE2BCBF6 95581718" +
"3995497C EA956AE5 15D22618 98FA0510 15728E5A 8AAAC42D AD33170D 04507A33" +
"A85521AB DF1CBA64 ECFB8504 58DBEF0A 8AEA7157 5D060C7D B3970F85 A6E1E4C7" +
"ABF5AE8C DB0933D7 1E8C94E0 4A25619D CEE3D226 1AD2EE6B F12FFA06 D98A0864" +
"D8760273 3EC86A64 521F2B18 177B200C BBE11757 7A615D6C 770988C0 BAD946E2" +
"08E24FA0 74E5AB31 43DB5BFC E0FD108E 4B82D120 A9210801 1A723C12 A787E6D7" +
"88719A10 BDBA5B26 99C32718 6AF4E23C 1A946834 B6150BDA 2583E9CA 2AD44CE8" +
"DBBBC2DB 04DE8EF9 2E8EFC14 1FBECAA6 287C5947 4E6BC05D 99B2964F A090C3A2" +
"233BA186 515BE7ED 1F612970 CEE2D7AF B81BDD76 2170481C D0069127 D5B05AA9" +
"93B4EA98 8D8FDDC1 86FFB7DC 90A6C08F 4DF435C9 34063199 FFFFFFFF FFFFFFFF";

var p = str2bigInt(p.replace(/\s/g, ''), 16);
var g = str2bigInt("2", 10);
var z = []; for (var i=0; i!==274; i++) { z[i] = 0; } z[272] = 1;

var num = sound = pos = tag = prikey = pubkey = last = 0;
var cfocus = true;
var soundEmbed = null;
var nick = $("#nick").html();
var name = $("#name").html();
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

var notice = [
"Cryptocat is supported by people like you. Check out our <a href=\"https://crypto.cat/donate/\" target=\"_blank\">fundraiser</a> and keep us going.",
"Help Cryptocat become better - please <a href=\"https://crypto.cat/donate/\" target=\"_blank\">donate</a> by buying Cryptocat stickers!",
"Cryptocat is an open software effort. Your <a href=\"https://crypto.cat/donate/\" target=\"_blank\">donations</a> help us improve.",
"You can donate to Cryptocat using Bitcoin! Please <a href=\"https://crypto.cat/donate/\" target=\"_blank\">contribute</a> and keep us going.",
"Cryptocat is volunteer-run and handles thousands of conversations a week. Please <a href=\"https://crypto.cat/donate/\" target=\"_blank\">donate</a> today."
];

function scrolldown(s) {
	$("#chat").animate({scrollTop: document.getElementById("chat").scrollHeight + 20}, s);
}

function getstamp(n) {
	var time = new Date();
	var h = time.getHours();
	var m = time.getMinutes();
	var spaces = "";
	for (si=0; si < (n.length - 5); si++) {
		spaces += "&#160;";
	}
	if (String(h).length === 1) {
		h = "0" + String(h);
	}
	if (String(m).length === 1) {
		m = "0" + String(m);
	}
	return spaces + h + ":" + m;
}

function soundPlay(which) {
	function createSound(which) {
		soundEmbed = document.createElement("audio");
		soundEmbed.setAttribute("type", "audio/webm");
		soundEmbed.setAttribute("src", which);
		soundEmbed.setAttribute("style", "display: none;");
		soundEmbed.setAttribute("autoplay", true);
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

function gen(size, extra, s) {
	if (s) {
		Math.seedrandom(Crypto.Fortuna.RandomData(512) + hex_sha512(seed));
	}
	var str = "";
	var charset = "123456789";
	if (extra) {
		charset += "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
	}
	str += charset.charAt(Math.floor(Math.random() * charset.length));
	charset += "0";
	while (str.length < size) {
		str += charset.charAt(Math.floor(Math.random() * charset.length));
	}
	return str;
}

function dhgen(key, pub) {
	if (pub === "gen") {
		prikey = str2bigInt(key, 10);
		pubkey = powMod(g, prikey, p);
		return bigInt2str(pubkey, 64);
	}
	else {
		pub = bigInt2str(powMod(str2bigInt(pub, 64), key, p), 64);
		return hex_sha512(pub);
	}
}

function tagify(line) {
	var mime = new RegExp('(data:(application\/((x-compressed)|(x-zip-compressed)|(zip)))|(multipart\/x-zip)).*');
	line = line.replace(/</g,"&lt;").replace(/>/g,"&gt;");
	if ((match = line.match(/((mailto\:|(news|(ht|f)tp(s?))\:\/\/){1}\S+)/gi)) && genurl) {
		for (mc = 0; mc <= match.length - 1; mc++) {
			var sanitize = match[mc].split("");
			for (ii = 0; ii <= sanitize.length-1; ii++) {
				if (!sanitize[ii].match(/\w|\d|\:|\/|\?|\=|\#|\+|\,|\.|\&|\;|\%/)) {
					sanitize[ii] = encodeURIComponent(sanitize[ii]);
				}
			}
			sanitize = sanitize.join("");
			line = line.replace(sanitize, '<a target="_blank" href="' + '?redirect=' + escape(sanitize) + '">' + match[mc] + '</a>');
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
			line = line.replace(/^[a-z]{1,12}:/, "<span class=\"nick\" onmouseover=\"this.innerHTML = \'" +
			stamp + "\';\" onmouseout=\"this.innerHTML = \'" + match[0] + "\';\">" + match[0] + "</span>");
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
		else if (match = line.match(/^[a-z]{1,12}\:\s\[:3\](\w|\/|\+|\?|\=)*\|?(\d|a|b|c|d|e|f)*\[:3\]$/)) {
			thisnick = $.trim(match[0].match(/^[a-z]{1,12}/));
			match = line.match(/\[:3\](.*)\|/);
			match = match[0].substring(4, match[0].length - 1);
			var hmac = line.match(/\|\w{64}/);
			hmac = hmac[0].substring(1);
			line = line.replace(/\|\w{64}/, '');
			if ((Crypto.HMAC(Crypto.SHA256, match, seckeys[thisnick].substring(64, 128) + seq_r[thisnick]) !== hmac) || 
			(jQuery.inArray(hmac, usedhmac) >= 0)) {
				if (jQuery.inArray(thisnick, inblocked) < 0) {
					line = line.replace(/\[:3\](.*)\[:3\]/, "<span class=\"diffkey\">Error: message authentication failure.</span>");
					pushline(line, pos);
					$("#" + pos).css("background-image","url(\"img/error.png\")");
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
						$("#" + pos).css("background-image","url(\"img/fileb.png\")");
					}
				}
			}
		}
		else if (match = line.match(/^(\&gt\;|\&lt\;)\s[a-z]{1,12}\s(has arrived|has left)$/)) {
			updatekeys(true);
			line = "<span class=\"nick\">" + match[0] + "</span>";
			pushline(line, pos);
			$("#" + pos).css("background-image","url(\"img/user.png\")");
		}
		else {
			if (jQuery.inArray(thisnick, inblocked) < 0) {
				line = "<span class=\"diffkey\">Error: invalid message received.</span>";
				pushline(line, pos);
				$("#" + pos).css("background-image","url(\"img/error.png\")");
			}
		}
	}
	return "";
}

function pushline(line, id) {
	if (tag === "msg") {tag = "gsm";}
	else {tag = "msg";}
	line = "<div class=\"" + tag + "\" id=\"" + id + "\"><div class=\"text\">" + line + "</div></div>";
	$("#chat").html($("#chat").html() + line);
	if (sound) {
		soundPlay("snd/msg.webm");
	}
}

function updatekeys(sync) {
	$.ajax({ url: install,
		type: "POST", async: sync,
		data: "nick=" + $("#nickinput").val() + "&name=" + name + "&key=get",
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
						seckeys[names[i]] = dhgen(prikey, keys[names[i]]);
					}
					var big = str2bigInt(keys[names[i]], 64);
					if ((equals(big, p) || greater(big, p) || greater(z, big)) || 
					(keys[names[i]] !== data[i].replace(/^[a-z]{1,12}:/, ''))) {
						fingerprints[names[i]] = "<span class=\"red\">DANGER: This user is using suspicious keys. " + 
						"Communicating with this user is strongly not recommended.</span>";
						userinfo(names[i]);
					}
					else {
						fingerprints[names[i]] = hex_sha512(names[i] + keys[names[i]]);
						fingerprints[names[i]] = 
						fingerprints[names[i]].substring(24, 32) + ":" + 
						fingerprints[names[i]].substring(48, 56) + ":" + 
						fingerprints[names[i]].substring(72, 80) + ":" + 
						fingerprints[names[i]].substring(96, 104) + ":" + 
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
	$.ajax({ url: install, type: "POST", async: true, 
		data: "chat=" + name,
		success: function(data) {
			if (data === "NOEXIST") {
				if (pubkey) {
					errored("your chat no longer exists.");
					$("#chat").html("<div class=\"bsg\">" + notice[Math.floor(Math.random()*notice.length)] + "</div>");
					clearInterval(interval);
				}
			}
			else if (data === "NOLOGIN") {
				if (pubkey) {
					errored("you have been logged out.");
					clearInterval(interval);
				}
			}
			else if (data !== "") {
				pos++;
				if (data.match(/\s/)) {
					process(data, 0);
					if ((document.getElementById("chat").scrollHeight - $("#chat").scrollTop()) < 800) {
						scrolldown(600);
					}
					if (!cfocus || ((document.getElementById("chat").scrollHeight - $("#chat").scrollTop()) > 800)) {
						num++;
						document.title = "[" + num + "] Cryptocat";
					}
				}
				else if (data) {
					if ($("#" + data).html().match(/data:.+\<\/a\>\<\/div\>$/)) {
						$("#" + data).css("background-image","url(\"img/fileb.png\")");
					}
					else {
						$("#" + data).css("background-image","url(\"img/chat.png\")");
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
				var msg = queue[0].replace(/\$.+$/, '');
				var sentid = queue[0].replace(/^.+\$/, '');
				if ((msg[0] === "@") && (jQuery.inArray(msg.match(/^\@[a-z]{1,12}/).toString().substring(1), names) >= 0)) {
					if (msg.match(/^\@[a-z]{1,12}/).toString().substring(1) === nick) {
						$("#" + sentid).css("background-image","url(\"img/chat.png\")");
						queue.splice(0,1);
						return;
					}
					var loc = jQuery.inArray(msg.match(/^\@[a-z]{1,12}/).toString().substring(1), names);
					var crypt = Crypto.AES.encrypt(queue[0].replace(/\$.+$/, ''), 
					Crypto.util.hexToBytes(seckeys[names[loc]].substring(0, 64)), {
						mode: new Crypto.mode.CBC(Crypto.pad.iso10126)
					});
					var msg = "(" + msg.match(/^\@[a-z]{1,12}/).toString().substring(1) + ")" + crypt;
					msg += "|" + Crypto.HMAC(Crypto.SHA256, crypt, seckeys[names[loc]].substring(64, 128) + seq_s[names[loc]]);
					seq_s[names[loc]]++;
				}
				else {
					var msg = "";
					for (var i=0; i !== names.length; i++) {
						if (names && (names[i] !== nick) && (jQuery.inArray(names[i], outblocked) < 0)) {
							var crypt = Crypto.AES.encrypt(queue[0].replace(/\$.+$/, ''),
							Crypto.util.hexToBytes(seckeys[names[i]].substring(0, 64)), {
								mode: new Crypto.mode.CBC(Crypto.pad.iso10126)
							});
							msg += "(" + names[i] + ")" + crypt;
							msg += "|" + Crypto.HMAC(Crypto.SHA256, crypt, seckeys[names[i]].substring(64, 128) + seq_s[names[i]]);
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
	$("#input").val("");
	$("#input").focus();
	if (msg !== "") {
		var sentid = gen(8, 1, 0);
		process(nick + ": " + msg, sentid);
		scrolldown(600);
		if (names.length > 1) {
			$("#" + sentid).css("background-image","url(\"img/sending.gif\")");
			queue.push(msg + "$" + sentid);
			$("#talk").val(maxinput);
		}
	}
}

$("#chatform").submit(function() {
	sendmsg($.trim($("#input").val()));
	return false;
});

$("#nickform").submit(function() {
	$("#nickinput").val($("#nickinput").val().toLowerCase());
	if (!pubkey) {
		$('#keytext').html('Type on your keyboard as randomly as possible for a few seconds:' + 
		'<br /><input type="password" id="keytropy" />');
		$('#nickentry').fadeOut('fast', function() {
			$('#keygen').fadeIn('fast', function() {
				var down, up, e;
				$("#keytropy").focus();
				$("#keytropy").keydown(function(event) {
					if (Crypto.Fortuna.Ready() === 0) {
						e = String.fromCharCode(event.keyCode);
						var d = new Date();
						down = d.getTime();
					}
				});
				$("#keytropy").keyup(function() {
					if (Crypto.Fortuna.Ready() === 0) {
						var d = new Date();
						up = d.getTime();
						Crypto.Fortuna.AddRandomEvent(e + (up - down));
					}
					else {
						$('#keytext').html("<br />Generating keys");
						pubkey = dhgen(gen(24, 0, 1), "gen");
						$('#keytext').html($('#keytext').html() + ' &#160; &#160; ' + 
						'<span class=\"blue\">OK</span><br />Communicating');
						setTimeout("nickset()", 250);
					}
				});
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
				document.title = "[" + num + "] Cryptocat";
				interval = setInterval("updatechat()", update);
				updatekeys(false);
				$('#keytext').html($('#keytext').html() + " &#160; &#160; &#160; <span class=\"blue\">OK</span>");
				$('#keygen').fadeOut('fast', function() {
					$("#changenick").fadeOut('fast');
					$("#nickentry").fadeOut('fast');
					$("#front").fadeOut('fast');
				});
				$("#chat").html("<div class=\"bsg\">" + notice[Math.floor(Math.random()*notice.length)] + "</div>");
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

$("#file").click(function(){
	var mime = new RegExp('(image.*)|(application/((x-compressed)|(x-zip-compressed)|(zip)))|(multipart/x-zip)');
	$("#fadebox").html('<input type="button" id="close" value="x" />' +
	'<br /><h3>send encrypted file</h3>');
	if (window.File && window.FileReader) {
		$("#fadebox").html($("#fadebox").html() + 'Enter recipient: ' +
		'<input type="text" id="recipient" />' +
		'<br />Zip files and images accepted. Maximum size: <span class="blue">' + filesize + 
		'kb</span><br /><br /><span id="filewrap">' + 
		'<input type="button" id="filebutton" value="Select file" />' + 
		'<input type="file" id="fileselect" name="file[]" /></span><br /><br />');
		$("#recipient").keyup(function(){
			if (($("#recipient").val() === nick) || (jQuery.inArray($("#recipient").val(), names) < 0)) {
				$("#recipient").css("background-color", "#000");
				$("#recipient").css("color", "#97CEEC");
				$("#filebutton").css("display", "none");
			}
			else {
				$("#recipient").css("background-color", "#97CEEC");
				$("#recipient").css("color", "#FFF");
				$("#filebutton").css("display", "inline");
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
		$("#fadebox").html($("#fadebox").html() + '<br /><br /><span class="blue">Note:</span> ' +
		'Some browsers may save the encrypted data with an incorrect file extension. ' +
		'Simply rename your file with a .zip extension to remedy this.<br /><br />' + 
		'<a class="download" href="' + dataurl + '" target="_blank">Download encrypted .zip file</a>');
	}
	$("#close").click(function(){
		$('#fadebox').fadeOut('fast', function() {
			$('#front').fadeOut(0);
		});
	});
	$('#front').fadeIn(0, function() {
		$('#fadebox').fadeIn('fast');
	});
}

$("#sound").click(function(){
	if (sound) {
		$("#sound").attr("src", "img/nosound.png");
		$("#sound").attr("title", "message sounds off");
		sound = 0;
		$("#input").focus();
	}
	else {
		$("#sound").attr("src", "img/sound.png");
		$("#sound").attr("title", "message sounds on");
		sound = 1;
		$("#input").focus();
	}
});

$("#invite").click(function(){
	var url = "https://www.facebook.com/dialog/send?app_id=348025968541285&name=Cryptocat%20Chat%20Invitation&description=" + 
	"Chat%20with%20your%20friends%20in%20privacy%20with%20secure%20encryption%20using%20Cryptocat.&redirect_uri=" + 
	"https://crypto.cat/?close&link=" + install + "?c=" + name + "&picture=" + install + "img/ios.png&display=popup";
	var pop = window.open(url, 'name', 'height=330,width=550,location=0,menubar=0,resizable=0,scrollbars=0' + 
	',status=0,titlebar=0,toolbar=0,top='+($(window).height()/3.5)+',left='+($(window).width()/2.7));
	pop.focus();
});

function userinfo(n) {
	$("#fadebox").html('<input type="button" id="close" value="x" />' +
	'<br /><h3>' + n + '</h3>');
	if (n === nick) {
		$("#fadebox").html($("#fadebox").html() +
		'Users can send you a private message by typing:<br />' +
		'<span class="blue">@' + n + '</span> their message<br /><br />' +
		'<br />Verify your identity using your fingerprint:');
	}
	else {
		$("#fadebox").html($("#fadebox").html() +
		'Send <span class="blue">' + n + '</span> a private message:<br />' +
		'<span class="blue">@' + n + '</span> your message<br /><br />' +
		'View messages from <span class="blue">' + n + '</span>: &#160;<span class="block" id="incoming">yes</span><br />' +
		'Send my messages to <span class="blue">' + n + '</span>: <span class="block" id="outgoing">yes</span><br />' +
		'<br />Verify <span class="blue">' + n + '</span>\'s identity using their fingerprint:');
	}
	$("#fadebox").html($("#fadebox").html() + '<br />' + fingerprints[n]);
	if (jQuery.inArray(n, inblocked) >= 0) {
		$("#incoming").css("background-color", "#F00");
		$("#incoming").html("no");
	}
	$("#incoming").click(function(){
		if ($("#incoming").html() === "no") {
			inblocked.splice(jQuery.inArray(n, inblocked));
			$("#incoming").css("background-color", "#97CEEC");
			$("#incoming").html("yes");
		}
		else {
			inblocked.push(n);
			$("#incoming").css("background-color", "#F00");
			$("#incoming").html("no");
		}
	});
	if (jQuery.inArray(n, outblocked) >= 0) {
		$("#outgoing").css("background-color", "#F00");
		$("#outgoing").html("no");
	}
	$("#outgoing").click(function(){
		if ($("#outgoing").html() === "no") {
			outblocked.splice(jQuery.inArray(n, outblocked));
			$("#outgoing").css("background-color", "#97CEEC");
			$("#outgoing").html("yes");
		}
		else {
			outblocked.push(n);
			$("#outgoing").css("background-color", "#F00");
			$("#outgoing").html("no");
		}
	});
	$("#close").click(function(){
		$('#fadebox').fadeOut('fast', function() {
			$('#front').fadeOut(0);
		});
	});
	$('#front').fadeIn(0, function() {
		$('#fadebox').fadeIn('fast');
	});
}

$("#maximize").click(function(){
	if ($("#maximize").attr("title") === "contract") {
		$("#main").animate({"margin-top": "2%", "min-width": "600px", "min-height": "420px", width: "600px", height: "420px"}, 500);
		$("#info").animate({width: "588px"}, 500);
		$("#users").animate({width: "525px", "padding-right": "3px"}, 500);
		$("#input").animate({width: "508px"}, 500);
		$("#talk").animate({width: "67px"}, 500);
		$("#inchat").animate({height: "343px", "margin-bottom": "10px"}, 500);
		$("#chat").animate({height: "340px"}, 500, function() { scrolldown(999); });
		$("#maximize").attr("src", "img/maximize.png");
		$("#maximize").attr("title", "expand");
		$("#input").focus();
	}
	else {
		$("#main").animate({"margin-top": "1%", "min-width": "900px", width: "85%", height: "96.5%"}, 500);
		$("#info").animate({width: "99%"}, 500);
		$("#users").animate({width: "92.3%", "padding-right": "20px"}, 500);
		$("#input").animate({width: "92.3%"}, 500);
		$("#talk").animate({width: "5.2%"}, 500);
		$("#inchat").animate({height: "93%", "margin-bottom": "-30px"}, 500);
		$("#chat").animate({height: "91%"}, 500, function() { scrolldown(999); });
		$("#maximize").attr("src", "img/minimize.png");
		$("#maximize").attr("title", "contract");
		$("#input").focus();
	}
});

$("#input").keyup(function(){
	textcounter(document.chatform.input,document.chatform.talk,256);
	if ((match = $("#input").val().match(/^\@[a-z]{1,12}/)) &&
	(jQuery.inArray($("#input").val().match(/^\@[a-z]{1,12}/).toString().substring(1), names) >= 0)) {
		$("#input").css("color", "#97CEEC");
	}
	else if ($("#input").css("color") === "rgb(151, 206, 236)") {
		$("#input").css("color", "#FFF");
	}
});

$("#talk").mouseout(function(){
	textcounter(document.chatform.input,document.chatform.talk,256);
});

$("#talk").mouseover(function(){
	$("#talk").val("send");
});

window.onfocus = function() {
	clearTimeout(blur);
	cfocus = true;
	num = 0;
	document.title = "[" + num + "] Cryptocat";
};
window.onblur = function() {
	blur = setTimeout("cfocus = false", update);
};
document.onblur = window.onblur;
document.focus = window.focus;

function logout() {
	$.ajax({ url: install,
		type: "POST", async: false,
		data: "logout=" + name
	});
}

function errored(e) {
	$("#users").html("<span class=\"users\">x</span>&nbsp " + e);
	$("#users").css("background-color", "#FE1A12");
}

$(document).ajaxError(function(){
	errored("connection issues. stand by...");
});

$('#front').fadeIn(0, function() {
	$('#nickentry').fadeIn('fast', function() {
		if ((navigator.userAgent.match("Macintosh") && navigator.userAgent.match("Safari") && !navigator.userAgent.match("Chrome"))) {
			$('#nickentry').html('Sorry, but the latest version of Safari has a bug that prevents Cryptocat from working properly.' +
			' Consider switching to <a href="https://www.google.com/chrome/">Google Chrome</a>!');
		}
		else {
			$("#nickinput").focus();
			$("#nickinput").select();
		}
	});
});