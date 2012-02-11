var seed = Math.seedrandom();

var p = str2bigInt(
	"C41F45CE6AA3AEB23A9202F8152779A4E42223354306AE1DC3BCC95568518345" +
	"80A65E95D6EACA6845EA6DD53E21E01AEE47B58A20E02DCC092337B6D41BDF24" +
	"EB04A96C0C83F39E08EA00604A9E4D6D0E78E1515F89C2822AB96C6AD78D8364" +
	"EDFCC788C28CAA234A17807119C6ECD43CDF5210347E59145B7B8E37B497A617" +
	"A7CBA65CCE00BBA7693D9DECE37EF9D185689A2E6B2FCCF97830520FE2859863" +
	"CD370DE738C417B52320D728CFCA51808946A5DA1A94E5D27EFF02B607F178AC" +
	"CCB8237D8A756B918B22E1A88F5162CB2557F665889D56E18C622355AEEF2B83" +
	"4F0876E6B7CD0FD7B5C98AE6C27787BED4725394F0052D79159409EEFEED5861" +
	"96DBF39EDEB01507E1F99922B1EA1FB1B3ECF99820596A2F28EEE0AA136909F6" +
	"CEA12199207CA8348637473207611A7E97351C4B326FE69A32FFB2F98B3E52F9" +
	"EED788B34A5208D67C0E613AA8D21277A84BE24A5B2B5C8FD4E7BE4F53815DBD" +
	"B1A413C8EC99C47A530657D8C178DDD09E0F6D76C938504B0E59E7D6500E47BC" +
	"456C2C798F6898E1889DEABFAF39EF1147FD6705B85288C3156C307ECA33C3DE" +
	"9830AF6C261FCC11A760A809EF83633F32BD8BAF3339E7537F81F5BC1FE0158B" +
	"D4AE88D99C7EA8C19117D2DFE39775A3D0BA00CDFB244D36EF8AEABFB111C5FF" +
	"3771B3BAF8AFBAA33C1D1AF159FD577902A3DC600813EB83C93BAF4CB394C6D3", 
16);

var g = str2bigInt("2", 10);
var num, interval, sound, pos, tag, prikey, pubkey;
num = interval = sound = pos = tag = 0;
var names = new Array();
var keys = new Array();
var seckeys = new Array();
var fingerprints = new Array();
var queue = new Array();
var sending = new Array();
var usedhmac = new Array();
var inblocked = new Array();
var outblocked = new Array();
var nick = $("#nick").html();
var name = $("#name").html();
var focus = true;
var soundEmbed = null;

var notice = ["Cryptocat is supported by people like you. Check out our " +
"<a href=\"https://crypto.cat/fundraiser/\" target=\"_blank\">fundraiser</a> and keep us going."];

function scrolldown() {
	$("#chat").animate({scrollTop: document.getElementById("chat").scrollHeight + 20}, 820);
}

function getstamp(n) {
	var time = new Date();
	var h = time.getHours();
	var m = time.getMinutes();
	var spaces = "";
	for (si=0; si < (n.length - 5); si++) {
		spaces += "&#160;";
	}
	if (String(h).length == 1) {
		h = "0" + String(h);
	}
	if (String(m).length == 1) {
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
		Math.seedrandom(Crypto.Fortuna.RandomData(512) + Crypto.SHA256(seed));
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
	if (pub == "gen") {
		prikey = str2bigInt(key, 10);
		pubkey = powMod(g, prikey, p);
		return bigInt2str(pubkey, 64);
	}
	else {
		pub = bigInt2str(powMod(str2bigInt(pub, 64), key, p), 64);
		return Crypto.PBKDF2(pub, Crypto.SHA256(pub), 32);
	}
}

function tagify(line) {
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
			line = line.replace(sanitize, "<a target=\"_blank\" href=\"" + "?redirect=" + escape(sanitize) + "\">" + match[mc] + "</a>");
		}
	}
	line = line.replace(/\&lt\;3/g, "<span class=\"monospace\">&#9829;</span>");
	thisnick = line.match(/^[a-z]{1,12}/).toString();
	if ((line.match(/^[a-z]{1,12}:\s\@/)) && 
	(line.match(/^[a-z]{1,12}:\s\@[a-z]{1,12}/).toString().substring(thisnick.length + 3) == nick || thisnick == nick)) {
		line = line.replace(/^[a-z]{1,12}\: \@[a-z]{1,12}/, '<span class="nick">' + thisnick + ' <span class="blue">&gt;</span> ' +
		line.match(/^[a-z]{1,12}:\s\@[a-z]{1,12}/).toString().substring(thisnick.length + 3) + '</span>');  
		if (match = line.match(/data:image\S+$/)) {
			line = line.replace(/data:image.+/, '<a onclick="displayfile(\'' + match + '\', \'' + getstamp(5) + '\')">view encrypted image</a>');
		}
	}
	else if (match = line.match(/^[a-z]{1,12}/)) {
		var stamp = getstamp(match[0]);
		line = line.replace(/^[a-z]{1,12}:/, "<span class=\"nick\" onmouseover=\"this.innerHTML = \'" +
		stamp + "\';\" onmouseout=\"this.innerHTML = \'" + match[0] + "\';\">" + match[0] + "</span>");
	}
	return line;
}

function fliptag() {
	if (tag == "msg") { tag = "gsm"; }
	else { tag = "msg"; }
}

function process(line, sentid) {
	if (line) {
		line = $.trim(line);
		if (sentid) {
			fliptag();
			line = tagify(line);
			if (names.length > 1) {
				line = "<div class=\"" + tag + "\" id=\"" + sentid + "\"><div class=\"text\">" + line + "</div></div>";
			}
			else {
				line = "<div class=\"" + tag + "\"><div class=\"text\">" + line + "</div></div>";
			}
			return line;
		}
		else if (match = line.match(/^[a-z]{1,12}:\s\[B-C\](\w|\/|\+|\?|\(|\)|\=|\|)+\[E-C\]$/)) {
			thisnick = $.trim(match[0].match(/^[a-z]{1,12}/));
			if (jQuery.inArray(thisnick, inblocked) >= 0) {
				return;
			}
			match = line.match(/\[B-C\](.*)\|/);
			match = match[0].substring(5, match[0].length - 1);
			var hmac = line.match(/\|\w{64}/);
			hmac = hmac[0].substring(1);
			line = line.replace(/\|\w{64}/, '');
			var loc = jQuery.inArray(thisnick, names);
			fliptag();
			if ((Crypto.HMAC(Crypto.SHA256, match, seckeys[loc]) != hmac) || (jQuery.inArray(hmac, usedhmac) >= 0)) {
				line = tagify(line);
				line = line.replace(/\[B-C\](.*)\[E-C\]/, "<span class=\"diffkey\">Error: message authentication failure.</span>");
				line = "<div class=\"" + tag + "\" id=\"" + pos + "\"><div class=\"text\">" + line + "</div></div>";
				pushline(line);
				$("#" + pos).css("background-image","url(\"img/error.png\")");
			}
			else {
				match = Crypto.AES.decrypt(match, seckeys[loc], {
					mode: new Crypto.mode.CBC(Crypto.pad.iso10126)
				});
				usedhmac.push(hmac);
				line = line.replace(/\[B-C\](.*)\[E-C\]/, match);
				line = tagify(line);
				line = "<div class=\"" + tag + "\" id=\"" + pos + "\"><div class=\"text\">" + line + "</div></div>";
				pushline(line);
				if ($("#" + pos).html().match(/data:image.+\<\/a\>\<\/div\>$/)) {
					$("#" + pos).css("background-image","url(\"img/fileb.png\")");
				}
			}
		}
		else if (match = line.match(/^(\&gt\;|\&lt\;) [a-z]{1,12} (has arrived|has left)$/)) {
			updatekeys(true);
			line = "<span class=\"nick\">" + match[0] + "</span>";
			fliptag();
			line = "<div class=\"" + tag + "\" id=\"" + pos + "\"><div class=\"text\">" + line + "</div></div>";
			pushline(line);
			$("#" + pos).css("background-image","url(\"img/user.png\")");
		}
		else {
			line = "<span class=\"diffkey\">Error: invalid message received.</span>";
			fliptag();
			line = "<div class=\"" + tag + "\" id=\"" + pos + "\"><div class=\"text\">" + line + "</div></div>";
			pushline(line);
			$("#" + pos).css("background-image","url(\"img/error.png\")");
		}
	}
	return "";
}

function pushline(line) {
	$("#chat").html($("#chat").html() + line);
	if (sound) {
		soundPlay("snd/msg.webm");
	}
}

function updatekeys(sync) {
	$.ajax({ url: install,
		type: "POST",
		async: sync,
		data: "nick=" + $("#nickinput").val() + "&name=" + name + "&key=get",
		success: function(data) {
			data = data.split('|');
			data.splice(data.length - 1, 1);
			if (data.length != names.length) {
				oldnames = names;
				oldkeys = keys;
				names = new Array();
				keys = new Array();
				fingerprints = new Array();
				for (var i=0; i <= data.length - 1; i++) {
					names[i] = data[i].replace(/:.+$/, '');
					keys[i] = data[i].replace(/^[a-z]{1,12}:/, '');
					var loc = jQuery.inArray(names[i], oldnames);
					if ((keys[i].length < 680) || ((names[i] == oldnames[loc]) && (keys[i] != oldkeys[loc]))) {
						var nbsp = "";
						for (ni=0; ni != 17; ni++) {
							nbsp += "&nbsp";
						}
						fingerprints[i] = nbsp + " <span class=\"red\">unreliable key or connection</span>";
					}
					else {
						if ((names[i] != oldnames[i]) && (names[i] != nick)) {
							seckeys[i] = dhgen(prikey, keys[i]);
						}
						fingerprints[i] = Crypto.SHA256(keys[i]);
						fingerprints[i] = 
						fingerprints[i].substring(10, 18) + ":" + 
						fingerprints[i].substring(20, 28) + ":" + 
						fingerprints[i].substring(30, 38) + ":" + 
						fingerprints[i].substring(40, 48) + ":" + 
						fingerprints[i].substring(50, 58);
						fingerprints[i] = fingerprints[i].toUpperCase();
					}
				}
				for (fi=0; fi <= names.length - 1; fi++) {
					var nbsp = "";
					for (ni=0; ni + names[fi].length != 13; ni++) {
						nbsp += "&nbsp";
					}
				}
			}
			var users = new Array();
			for (var i=0; i!=names.length; i++) {
				users[i] = '<span class="user" onclick="userinfo(\'' + names[i] + '\')">' + names[i] + '</span>';
			}
			$("#users").html('<span class="users">' + users.length + '</span> ' + users.join(' '));
		}
	});
}

function updatechat() {
	$.ajax({ url: install,
		type: "POST",
		async: true,
		data: "chat=" + name,
		success: function(data) {
			if (data == "NOEXIST") {
				if (pubkey) {
					errordisplay("your chat no longer exists.");
					$("#chat").html("<div class=\"bsg\">" + notice[0] + "</div>");
					clearInterval(interval);
				}
			}
			else if (data == "NOLOGIN") {
				if (pubkey) {
					errordisplay("you have been logged out.");
					clearInterval(interval);
				}
			}
			else if (data != "") {
				pos++;
				if (data.match(/\s/)) {
					process(data, 0);
					if ((document.getElementById("chat").scrollHeight - $("#chat").scrollTop()) < 600) {
						scrolldown();
					}
					if (!focus || ((document.getElementById("chat").scrollHeight - $("#chat").scrollTop()) > 600)) {
						num++;
						document.title = "[" + num + "] Cryptocat";
					}
				}
				else if (data) {
					if ($("#" + data).html().match(/data:image.+\<\/a\>\<\/div\>$/)) {
						$("#" + data).css("background-image","url(\"img/fileb.png\")");
					}
					else {
						$("#" + data).css("background-image","url(\"img/chat.png\")");
					}
					$("#" + data).attr("id", "x");
				}
			}
			if ($("#users").html() == '<span class="users">x</span>&nbsp; connection issues. stand by...') {
				updatekeys(true);
				$("#users").css("background-color", "#97CEEC");
			}
			if (sending[0]) {
				var msg = sending[0].replace(/\$.+$/, '');
				var sentid = sending[0].replace(/^.+\$/, '');
				var time = sentid.substring(8);
				sentid = sentid.substring(0, 8);
				if ($("#" + sentid).css("background-image")) {
					var now = new Date;
					if ((now.getTime() - time) > 20000) {
						queue.push(msg + "$" + sentid);
						sending.splice(0,1);
					}
				}
				else {
					sending.splice(0,1);
				}
			}
			if (queue[0]) {
				var msg = queue[0].replace(/\$.+$/, '');
				var sentid = queue[0].replace(/^.+\$/, '');
				var time = new Date;
				sending.push(queue[0] + time.getTime());
				if ((msg[0] == "@") && (jQuery.inArray(msg.match(/^\@[a-z]{1,12}/).toString().substring(1), names) >= 0)) {
					if (msg.match(/^\@[a-z]{1,12}/).toString().substring(1) == nick) {
						$("#" + sentid).css("background-image","url(\"img/chat.png\")");
						queue.splice(0,1);
						return;
					}
					var loc = jQuery.inArray(msg.match(/^\@[a-z]{1,12}/).toString().substring(1), names);
					var crypt = Crypto.AES.encrypt(queue[0].replace(/\$.+$/, ''), seckeys[loc], {
						mode: new Crypto.mode.CBC(Crypto.pad.iso10126)
					});
					var msg = "(" + msg.match(/^\@[a-z]{1,12}/).toString().substring(1) + ")" + crypt;
					msg += "|" + Crypto.HMAC(Crypto.SHA256, crypt, seckeys[loc]);
				}
				else {
					var msg = "";
					for (var i=0; i != names.length; i++) {
						if (names && (names[i] != nick) && (jQuery.inArray(names[i], outblocked) < 0)) {
							var crypt = Crypto.AES.encrypt(queue[0].replace(/\$.+$/, ''), seckeys[i], {
								mode: new Crypto.mode.CBC(Crypto.pad.iso10126)
							});
							msg += "(" + names[i] + ")" + crypt;
							msg += "|" + Crypto.HMAC(Crypto.SHA256, crypt, seckeys[i]);
						}
					}
				}
				msg = nick + "|" + sentid + ": " + "[B-C]" + msg + "[E-C]";
				msg = "name=" + name + "&talk=send" + "&input=" + msg.replace(/\+/g, "%2B");
				$.ajax({
					type: 'POST',
					url: install,
					data: msg
				});
				queue.splice(0,1);
			}
		},
		error: function(data) {
		}
	});
}

function sendmsg(msg) {
	msg = msg.replace(/\$/g,"&#36;");
	$("#input").val("");
	$("#input").focus();
	if (msg != "") {
		var sentid = gen(8, 1, 0);
		$("#chat").html($("#chat").html() + process(nick + ": " + msg, sentid));
		scrolldown();
		if (names.length > 1) {
			$("#" + sentid).css("background-image","url(\"img/sending.gif\")");
			queue.push(msg + "$" + sentid);
			$("#talk").val(maxinput);
		}
	}
}

$("#chatform").submit( function() {
	sendmsg($.trim($("#input").val()));
	return false;
});

$("#nickform").submit( function() {
	$("#nickinput").val($("#nickinput").val().toLowerCase());
	if (!pubkey) {
		$('#nickentry').fadeOut('fast', function() {
			$('#keygen').fadeIn('fast', function() {
				var down, up, e;
				$('#keytext').html('Type on your keyboard as randomly as possible for a few seconds:' + 
				'<br /><input type="password" id="keytropy" />');
				$("#keytropy").focus();
				$("#keytropy").keydown(function(event) {
					if (Crypto.Fortuna.Ready() == 0) {
						e = String.fromCharCode(event.keyCode);
						var d = new Date();
						down = d.getTime();
					}
				});
				$("#keytropy").keyup(function() {
					if (Crypto.Fortuna.Ready() == 0) {
						var d = new Date();
						up = d.getTime();
						Crypto.Fortuna.AddRandomEvent(e + (up - down));
					}
					else {
						$('#keytext').html("<br />Generating keys");
						pubkey = dhgen(gen(24, 0, 1), "gen");
						$('#keytext').html($('#keytext').html() + ' &#160; &#160; ' + 
						'<span class=\"blue\">OK</span><br />Communicating');
						setTimeout("nickajax()", 250);
					}
				});
			});
		});
	}
	else {
		nickajax();
	}
	return false;
});

$("#nickinput").keyup(function() {
	if ($("#nickinput").val().match(/^[a-z]{1,12}$/)) {
		$("#nick").html($("#nickinput").val());
	}
});

function nickajax() {
	$.ajax({ url: install,
		type: "POST",
		async: true,
		data: "nick=" + $("#nickinput").val() + "&name=" + name + "&key=" + encodeURIComponent(pubkey),
		success: function(data) {
			if ((data != "error") && (data != "inuse") && (data != "full")) {
				nick = $("#nick").html();
				$("#input").focus();
				document.title = "[" + num + "] Cryptocat";
				interval = setInterval("updatechat()", update);
				updatekeys(false);
				$('#keytext').html($('#keytext').html() + " &#160; &#160; &#160; <span class=\"blue\">OK</span>");
				$('#keygen').fadeOut('fast', function() {
					$("#changenick").fadeOut('fast');
					$("#nickentry").fadeOut('fast');
				    $("#front").fadeOut();
				});
				$("#chat").html("<div class=\"bsg\">" + notice[0] + "</div>");
				updatechat();
			}
			else {
				$('#keygen').fadeOut('fast', function() {
					$("#nickentry").fadeIn('fast');
					if (data == "inuse") {
						$("#nickinput").val("nickname in use");
					}
					else if (data == "full") {
						$("#nickinput").val("chat is full");
					}
					else if (data == "error") {
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
	$("#fadebox").html('<input type="button" id="close" value="x" />' +
	'<br /><h3>send encrypted image</h3>');
	if (window.File && window.FileReader) {
		 $("#fadebox").html($("#fadebox").html() + 'Enter recipient: ' +
		'<input type="text" id="recipient" />' +
		'<br />Maximum image size: <span class="blue">' + filesize + 
		'kb</span><br /><br /><span id="filewrap">' + 
		'<input type="button" id="filebutton" value="Select image" />' + 
		'<input type="file" id="fileselect" name="file[]" /></span><br /><br />');
		$("#recipient").keyup(function(){
			if (($("#recipient").val() == nick) || (jQuery.inArray($("#recipient").val(), names) < 0)) {
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
			if (file[0].type.match('image.*')) {
				if (file[0].size > (filesize * 1024)) {
					$("#filewrap").html('<span class="red">Maximum image size is ' + filesize + 'kb.</span>');
				}
				else {
					reader.readAsDataURL(file[0]);
					$("#close").click();
				}
			}
			else {
				$("#filewrap").html('<span class="red">Only image files are supported.</span>');
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

function displayfile(dataurl, time) {
	$("#fadebox").html('<input type="button" id="close" value="x" />' +
	'<br /><center><a href="' + dataurl + '" target="_blank">' +
	'<img class="encrypted" src="' + dataurl + '" alt="" /></a><br />' +
	'<span style="margin-left:-10px">(<span class="blue">' + time + '</span>)</span></center>');
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
	',status=0,titlebar=0,toolbar=0,top='+($(window).height()/3.5)+',left='+($(window).width()/2.5));
	pop.focus();
});

function userinfo(n) {
	$("#fadebox").html('<input type="button" id="close" value="x" />' +
	'<br /><h3>' + n + '</h3>');
	if (n == nick) {
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
	$("#fadebox").html($("#fadebox").html() + '<br />' + fingerprints[jQuery.inArray(n, names)]);
	if (jQuery.inArray(n, inblocked) >= 0) {
		$("#incoming").css("background-color", "#F00");
		$("#incoming").html("no");
	}
	$("#incoming").click(function(){
		if ($("#incoming").html() == "no") {
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
		if ($("#outgoing").html() == "no") {
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
	if ($("#maximize").attr("title") == "contract") {
		$("#main").animate({"margin-top": "2%", "min-width": "600px", "min-height": "420px", width: "600px", height: "420px"}, 500 );
		$("#info").animate({width: "588px"}, 500 );
		$("#users").animate({width: "525px", "padding-right": "3px"}, 500 );
		$("#input").animate({width: "508px"}, 500 );
		$("#talk").animate({width: "67px"}, 500 );
		$("#inchat").animate({height: "343px", "margin-bottom": "10px"}, 500 );
		$("#chat").animate({height: "340px"}, 500, function() {
			scrolldown();
		});
		$("#maximize").attr("src", "img/maximize.png");
		$("#maximize").attr("title", "expand");
		$("#input").focus();
	}
	else {
		$("#main").animate({"margin-top": "1%", "min-width": "900px", width: "85%", height: "96.5%"}, 500 );
		$("#info").animate({width: "99%"}, 500 );
		$("#users").animate({width: "92.3%", "padding-right": "20px"}, 500 );
		$("#input").animate({width: "92.3%"}, 500 );
		$("#talk").animate({width: "5.2%"}, 500 );
		$("#inchat").animate({height: "93%", "margin-bottom": "-30px"}, 500 );
		$("#chat").animate({height: "91%"}, 500, function() {
			scrolldown();
		});
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
	else if ($("#input").css("color") == "rgb(151, 206, 236)") {
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
	focus = true;
	num = 0;
	document.title = "[" + num + "] Cryptocat";
}
window.onblur = function() {
	blur = setTimeout("focus = false", update);
}
document.onblur = window.onblur;
document.focus = window.focus;

function logout() {
	$.ajax({ url: install,
		type: "POST",
		async: false,
		data: "logout=" + name,
	});
}

function errordisplay(e) {
	$("#users").html("<span class=\"users\">x</span>&nbsp " + e);
	$("#users").css("background-color", "#FE1A12");
}

$(document).ajaxError(function(){
	errordisplay("connection issues. stand by...");
});

$('#front').fadeIn(0, function() {
	$('#nickentry').fadeIn('fast', function() {
		$("#nickinput").focus();
		$("#nickinput").select();
	});
});