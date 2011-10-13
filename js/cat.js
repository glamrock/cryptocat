var seed = Math.seedrandom();
var t, num, interval, sound, errored, reconnect, mysecret, mypublic, nickset, error, tag, sentid, flood;
t = num = interval = sound = errored = reconnect = pos = tag = flood = 0;
var fingerprints = new Array();
var names = new Array();
var keys = new Array();
var queue = new Array();
var nick = $("#nick").html();
var name = $("#name").html();
var soundEmbed = null;
var focus = true;
var worker = new Worker("js/rsagen.js");

function idSelect(id) {
	document.getElementById(id).focus();
	document.getElementById(id).select();
}

function scrolldown() {
	$("#chat").animate({ scrollTop: document.getElementById("chat").scrollHeight + 20}, 820);
}

function getstamp(nick) {
	var time = new Date();
	var h = time.getHours();
	var m = time.getMinutes();
	var spaces = "";
	for (si=0; si < (nick.length - 5); si++) {
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

function gen(size, extra) {
	var seed = Math.seedrandom();
	var str = "";
	var charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
	if (extra) {
		charset += "~`#$%^&*()-_=+{}[];:<,>./";
	}
	while (str.length < size) {
		if (Math.floor(Math.random()*2) == 1) {
			reseed = Math.seedrandom();
			seed = Math.seedrandom(seed + reseed);
			seed = reseed;
		}
		for (var i=0; i != 8; i++) {
        	str += charset.charAt(Math.floor(Math.random() * charset.length));
		}
	}
 	return str;
}

function textcounter(field,cntfield,maxlimit) {
	if (field.value.length > maxlimit) {
		field.value = field.value.substring(0, maxlimit);
	}
	else {
		cntfield.value = maxlimit - field.value.length;
	}
}

function tagify(chat) {
	chat = chat.replace(/</g,"&lt;").replace(/>/g,"&gt;");
	if ((match = chat.match(/((mailto\:|(news|(ht|f)tp(s?))\:\/\/){1}\S+)/gi)) && genurl) {
		for (mc = 0; mc <= match.length - 1; mc++) {
			var sanitize = match[mc].split("");
			for (ii = 0; ii <= sanitize.length-1; ii++) {
				if (!sanitize[ii].match(/\w|\d|\:|\/|\?|\=|\#|\+|\,|\.|\&|\;|\%/)) {
					sanitize[ii] = encodeURIComponent(sanitize[ii]);
				}
			}
			sanitize = sanitize.join("");
			chat = chat.replace(sanitize, "<a target=\"_blank\" href=\"" + "?redirect=" + escape(sanitize) + "\">" + match[mc] + "</a>");
		}
	}
	chat = chat.replace(/\&lt\;3/g, "<span class=\"monospace\">&#9829;</span>");
	if (match = chat.match(/^[a-z]+:\s\/me\s/)) {
		match = match[0];
		thisnick = match.match(/^[a-z]{1,12}/);
		chat = chat.replace(/^[a-z]+:\s\/me\s/, "<span class=\"nick\">* " + thisnick + " ") + " *</span>";
	}
	else if (match = chat.match(/^[a-z]{1,12}/)) {
		var stamp = getstamp(match[0]);
		chat = chat.replace(/^[a-z]+:/, "<span class=\"nick\" onmouseover=\"this.innerHTML = \'" + stamp + "\';\" onmouseout=\"this.innerHTML = \'" + match[0] + "\';\">" + match[0] + "</span>");
	}
	return chat;
}

function fliptag() {
	if (tag == "msg") {
		tag = "gsm";
	}
	else {
		tag = "msg";
	}
}

function processline(line, flip) {
	if (line) {
		line = $.trim(line);
		if (!flip) {
			fliptag();
			line = tagify(line);
			if (names.length > 1) {
				sentid = gen(8, 0);
				line = "<div class=\"" + tag + "\" id=\"" + sentid + "\"><div class=\"text\">" + line + "</div></div>";
			}
			else {
				line = "<div class=\"" + tag + "\"><div class=\"text\">" + line + "</div></div>";
			}
			return line;
		}
		else if (match = line.match(/^[a-z]{1,12}:\s\[B-C\](\w|\/|\+|\?|\(|\)|\=)+\[E-C\]$/)) {
			thisnick = $.trim(match[0].match(/^[a-z]{1,12}/));
			match = line.match(/\[B-C\](.*)\[E-C\]/);
			worker.postMessage("!" + match[0].substring(5, match[0].length - 5));
			worker.onmessage = function(e) {
				if (e.data.match(/^\:msg\:/)) {
					var cipher = e.data.substring(5);
					worker.postMessage("@");
					worker.onmessage = function(e) {
						var signkey = e.data;
						var loc = jQuery.inArray(thisnick, names);
						if ((cipher != "corrupt") && (signkey == keys[loc])) {
							line = line.replace(/\[B-C\](.*)\[E-C\]/, unescape(cipher));
							line = tagify(line);
							fliptag();
							line = "<div class=\"" + tag + "\" id=\"" + pos + "\"><div class=\"text\">" + line + "</div></div>";
							$("#chat").html($("#chat").html() + line);
						}
					}
				}
			}
		}
		else if ((match = line.match(/^(\&gt\;|\&lt\;) [a-z]{1,12} (has arrived|has left)$/))) {
			line = "<span class=\"nick\">" + match[0] + "</span>";
			updatekeys();
			fliptag();
			line = "<div class=\"" + tag + "\" id=\"" + pos + "\"><div class=\"text\">" + line + "</div></div>";
			$("#chat").html($("#chat").html() + line);
			$("#" + pos).css("background-image","url(\"img/user.png\")");
		}
		else {
			line = "<span class=\"diffkey\">corrupt</span>";
			fliptag();
			line = "<div class=\"" + tag + "\" id=\"" + pos + "\"><div class=\"text\">" + line + "</div></div>";
			$("#chat").html($("#chat").html() + line);
			$("#" + pos).css("background-image","url(\"img/corrupt.png\")");
		}
	}
	return "";
}

function updatekeys() {
	$.ajax({ url: install,
		type: "POST",
		async: false,
		data: "nick=" + $("#nickinput").val() + "&name=" + name + "&public=get",
		success: function(data) {
			data = data.split('|');
			oldnames = names;
			oldkeys = keys;
			names = new Array();
			keys = new Array();
			fingerprints = new Array();
			for (i=0; i <= data.length - 2; i++) {
				keymatch = data[i].match(/^[a-z]{1,12}:/);
				names[i] = keymatch[0].substring(0, keymatch[0].length - 1);
				keymatch = data[i].match(/:.+/);
				keys[i] = keymatch[0].substring(1);
				$("#chatters").html('<span class="chatters">' + names.length + '</span> ' + names.join(' '));
				var loc = jQuery.inArray(names[i], oldnames);
				if (((keys[i].length != 256) && (keys[i].length != 172)) || ((names[i] == oldnames[loc]) && (keys[i] != oldkeys[loc]))) {
					var nbsp = "";
					for (ni=0; ni != 17; ni++) {
						nbsp += "&nbsp";
					}
					fingerprints[i] = nbsp + " <span class=\"red\">unreliable connection/keys</span>";
					$("#fingerlink").click();
				}
				else {
					fingerprints[i] = SHA256(keys[i]);
					fingerprints[i] = fingerprints[i].substring(0, 8).toUpperCase() + ":" + fingerprints[i].substring(16, 24).toUpperCase() + ":" + fingerprints[i].substring(32, 40).toUpperCase() + ":" + fingerprints[i].substring(48, 56).toUpperCase() + ":" + fingerprints[i].substring(56, 64).toUpperCase();
				}
			}
		}
	});
	var fingerhtml = "Verify friends using their fingerprint. <br />(be certain of their identity - over the phone is fine.)<br /><br />";
	for (fi=0; fi <= names.length - 1; fi++) {
		var nbsp = "";
		for (ni=0; ni + names[fi].length != 13; ni++) {
			nbsp += "&nbsp";
		}
		fingerhtml += "<span class=\"blue\">" + names[fi] + "</span> " + nbsp + " " + fingerprints[fi] + "<br />";
	}
	fingerhtml += "<br /><input type=\"button\" onclick=\"fingerclose();\" id=\"close\" value=\"close\" />"; 
	$("#fingerprints").html(fingerhtml);
}

function updatechat() {
	$.ajax({ url: install,
		type: "POST",
		async: true,
		data: "chat=" + name + "&pos=" + pos,
		success: function(data) {
			if (data == "NOEXIST") {
				if (!errored && mypublic) {
					errordisplay("your chat no longer exists.");
				}
			}
			else if (data == "NOLOGIN") {
				if (!errored && mypublic) {
					errordisplay("you have been logged out.");
				}
			}
			else if (data != "") {
				pos++;
				if ((pos) && (nickset)) {
					$('#keygen').fadeOut('slow', function() {
						$("#changenick").fadeOut('fast');
						$("#nickentry").fadeOut('fast');
					    $("#front").fadeOut();
					});
					nickset = 0;
				}
				if (data.match(/\s/)) {
					processline(data, 1);
					scrolldown();
					if (!focus) {
						num++;
						document.title = "[" + num + "] cryptocat";
					}
					if (sound) {
						soundPlay("snd/msg.ogg");
					}
				}
				else {
					$("#" + data).css("background-image","url(\"img/chat.png\")");
					$("#" + data).attr("id", "x");
				}
			}
			if (queue[0]) {
				$.ajax({ url: install,
					type: "POST",
					async: true,
					data: "input=" + encodeURIComponent(queue[0]) + "&name=" + name + "&talk=send",
				});
				queue.splice(0,1);
			}
		},
		error: function(data) {
		}
	});
	if (($("#chatters").html() != error) && (reconnect)) {
		errored = 0;
		reconnect = 0;
	}
	else if (reconnect) {
		updatekeys();
	}
}

$("#chatform").submit( function() {
	if (flood) {
		$('#flood').fadeIn('fast', function() {
			setTimeout("$('#flood').fadeOut(1000)", 500);
		});
	}
	else {
		var msg = $.trim($("#input").val());
		msg = msg.replace(/\$/g,"&#36;");
		var msgc = nick + ": " + msg;
		$("#input").val("");
		if (msg != "") {
			document.getElementById("chat").innerHTML += processline(msgc, 0);
			scrolldown();
			if (names.length > 1) {
				flood = 1;
				setTimeout("flood = 0", 1200);
				$("#" + sentid).css("background-image","url(\"img/sending.gif\")");
				worker.postMessage("|" + names + ":" + keys + "*" + nick);
				worker.onmessage = function(e) {
					worker.postMessage("?" + escape(msg));
					worker.onmessage = function(e) {
						msg = nick + "|" + sentid + ": " + "[B-C]" + e.data + "[E-C]";
						queue.push(msg);
						$("#talk").val(maxinput);
						document.getElementById("input").focus();
					}
				}
			}
		}
	}
	return false;    
});

$("#nickform").submit( function() {
	$("#nickinput").val(document.getElementById("nickinput").value.toLowerCase());
	if (!mypublic) {
		$('#nickentry').fadeOut('slow', function() {
			$('#keygen').fadeIn('slow', function() {
				$('#keytext').html($('#keytext').html() + " &#160; <span class=\"blue\">OK</span><br />Generating keys");
				setTimeout(worker.postMessage(gen(128, 1)), Math.random()*3);
				worker.onmessage = function(e) {
					mypublic = e.data;
					$('#keytext').html($('#keytext').html() + " &#160; &#160; <span class=\"blue\">OK</span><br />Communicating");
					nickajax();
				}
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
		data: "nick=" + $("#nickinput").val() + "&name=" + name + "&public=" + encodeURIComponent(mypublic),
		success: function(data) {
			$('#keytext').html($('#keytext').html() + " &#160; &#160; &#160; <span class=\"blue\">OK</span>");
			if ((data != "error") && (data != "inuse") && (data != "full")) {
				nickset = 1;
				updatechat();
				nick = $("#nick").html();
				document.getElementById("input").focus();
				document.title = "[" + num + "] cryptocat";
				interval = setInterval("updatechat()", update);
			}
			else {
				$('#keygen').fadeOut('slow', function() {
					$("#nickentry").fadeIn('slow');
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
					idSelect("nickinput");
				});
			}
		}
	});
}

$("#sound").click(function(){
	if (sound) {
		$("#sound").attr("src", "img/nosound.png");
		$("#sound").attr("title", "message sounds off");
		sound = 0;
		document.getElementById("input").focus();
	}
	else {
		$("#sound").attr("src", "img/sound.png");
		$("#sound").attr("title", "message sounds on");
		sound = 1;
		document.getElementById("input").focus();
	}
});

$("#fingerlink").click(function(){
	$('#front').fadeIn('fast');
	$('#fingerprints').fadeIn('slow', function() {
	});
});

function fingerclose() {
	$('#fingerprints').fadeOut('slow', function() {
		$('#front').fadeOut('fast');
	});
}

$("#maximize").click(function(){
	if ($("#maximize").attr("title") == "contract") {
		$("#main").animate({
			"margin-top": "4.5%",
			"min-width": "600px",
			"min-height": "420px",
			width: "600px",
			height: "420px"
		}, 500 );
		$("#info").animate({
			width: "588px",
		}, 500 );
		$("#chatters").animate({
			width: "525px",
			"padding-right": "3px"
		}, 500 );
		$("#input").animate({
			width: "508px",
		}, 500 );
		$("#talk").animate({
			width: "67px"
		}, 500 );
		$("#inchat").animate({
			width: "597px",
			height: "333px",
			"margin-bottom": "10px"
		}, 500 );
		$("#chat").animate({
			width: "608px",
			height: "330px"
		}, 500, function() {
			document.getElementById("chat").innerHTML = document.getElementById("chat").innerHTML;
			scrolldown();
		});
		$("#maximize").attr("src", "img/maximize.png");
		$("#maximize").attr("title", "expand");
		document.getElementById("input").focus();
	}
	else {
		$("#main").animate({
			"margin-top": "2%",
			"min-width": "900px",
			width: "80%",
			height: "90%"
		}, 500 );
		$("#info").animate({
			width: "99%"
		}, 500 );
		$("#chatters").animate({
			width: "92.3%",
			"padding-right": "20px"
		}, 500 );
		$("#input").animate({
			width: "92.3%"
		}, 500 );
		$("#talk").animate({
			width: "5%"
		}, 500 );
		$("#inchat").animate({
			width: "100%",
			height: "90%",
			"margin-bottom": "-30px"
		}, 500 );
		$("#chat").animate({
			width: "102%",
			height: "88%"
		}, 500, function() {
			document.getElementById("chat").innerHTML = document.getElementById("chat").innerHTML;
			scrolldown();
		});
		$("#maximize").attr("src", "img/minimize.png");
		$("#maximize").attr("title", "contract");
		document.getElementById("input").focus();
	}
});

$("#input").keyup(function(){
	textcounter(document.chatform.input,document.chatform.talk,256);
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
	document.title = "[" + num + "] cryptocat";
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
	$("#chatters").html("<span class=\"chatters\">x</span>&nbsp " + e);
	error = $("#chatters").html();
	errored = 1;
}

$(document).ajaxError(function(){
	if (!errored) {
		errordisplay("you have been disconnected. reconnecting...");
		reconnect = 1;
	}
});

$("#nickentry").fadeIn(); $("#front").fadeIn(); idSelect("nickinput");