Math.seedrandom();
var salt, key, curcount, match, t, num, interval, nickset, pos, maximized, sound, errored, gotsalt, defaultsalt, defaultkey;
t = num = interval = nickset = pos = maximized = sound = errored = gotsalt = defaultsalt = defaultkey = 0;
var nick = $("#nick").html();
var defaultkeytext = $("#key").val();
var focus = true;
var soundEmbed = null;

function scrolldown() {
	$("#chat").animate({ scrollTop: document.getElementById("chat").scrollHeight-20}, 500 );
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

function getkey(id, n) {
	gk = Crypto.SHA1(id);
	for (gki = 0; gki != n; gki++) {
		gk = Crypto.SHA1(gk);
		gk += Crypto.SHA1(gk);
	}
	return gk.substring(10, 74);
}

function textcounter(field,cntfield,maxlimit) {
	if (field.value.length > maxlimit) {
		field.value = field.value.substring(0, maxlimit);
	}
	else {
		cntfield.value = maxlimit - field.value.length;
	}
}

function keytime() {
	document.getElementById("key").type = "password";
	clearTimeout(t);
	t = setTimeout("updatekey()", 500);
}

function updatekey() {
	if (!defaultkey) {
		defaultsalt = getkey(gotsalt + $("#url").val(), 5);
		defaultkey = Crypto.PBKDF2(getkey($("#url").val(), 4), defaultsalt, 64, { iterations: 1000 });
	}
	if (($("#key").val() == "") || ($("#key").val() == defaultkeytext)) {
		salt = defaultsalt;
		key = defaultkey;
		$("#strength").html("");
	}
	else {
		salt = getkey(gotsalt + $("#key").val(), 5);
		key = Crypto.PBKDF2(getkey($("#key").val(), 4), salt, 64, { iterations: 1000 });
		var strength = 0;
		if ($("#key").val().length >= 10) {
			strength = 10;
		}
		if ($("#key").val().length >= 16) {
			strength++;
		}
		if ($("#key").val().match(/[a-z]/)) {
			strength++;
		}
		if ($("#key").val().match(/[A-Z]/)) {
			strength++;
		}
		if ($("#key").val().match(/[0-9]/)) {
			strength++;
		}
		if ($("#key").val().match(/[^\d\w\s]/)) {
			strength++;
		}
		if (strength < 12) {
			$("#strength").html("key strength: <span class=\"red\">weak</span>");
		}
		if (strength == 12) {
			$("#strength").html("key strength: okay");
		}
		if (strength > 12) {
			$("#strength").html("key strength: <span class=\"green\">good</span>");
		}
	}
	updatechat("#chat");
}

function nl2br(str) {
	return (str + '').replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1' + "<br />" + '$2');
}

function scrubtags(str) {
	return str.replace(/</g,"&lt;").replace(/>/g,"&gt;");
}

function processline(chat, flip) {
	chat = chat.split("\n");
	for (i=0; i <= chat.length-1; i++) {
		var encrypted = 0;
		var success = 0;
		var corrupted = 0;
		var user = 0;
	
		if (chat[i]) {
			if (match = chat[i].match(/\[B-H\](.*)\[E-H\]$/)) {
				for (o=0; o <= chat.length-1; o++) {
					if (chat[o]) {
						if (omatch = chat[o].match(/\[B-H\](.*)\[E-H\]$/)) {
							if ((match[0] == omatch[0]) && (o != i)) {
								if (o > i) {
									chat[o] = chat[o].replace(/\[B-H\](.*)\[E-H\]$/, "[B-H]CORRUPT[E-H]");
								}
								if (i > o) {
									chat[i] = chat[i].replace(/\[B-H\](.*)\[E-H\]$/, "[B-H]CORRUPT[E-H]");
								}
							}
						}
					}
				}
			}
			if (match = chat[i].match(/\[B-H\](.*)\[E-H\]$/)) {
				var hmac = match[0].substring(5, match[0].length-5);
				chat[i] = chat[i].replace(/\[B-H\](.*)\[E-H\]$/, "");
			}
			if (match = chat[i].match(/\[B-C\](.*)\[E-C\]/)) {
				match = match[0].substring(5, match[0].length-5);
				ciphertext = match;
				try {
					match = Crypto.AES.decrypt(match, defaultkey);
					chat[i] = chat[i].replace(/\[B-C\](.*)\[E-C\]/, match);
					if (match = chat[i].match(/\[B-M\](.*)\[E-M\]/)) {
						success = match[0];
					}
				}
				catch (INVALID_CHARACTER_ERR) {
				}
				if (!success) {
					try {
						match = Crypto.AES.decrypt(match, key);
						chat[i] = chat[i].replace(/\[B-C\](.*)\[E-C\]/, match);
						if (key != defaultkey) {
							encrypted = 1;
						}
						if (match = chat[i].match(/\[B-M](.*)\[E-M]/)) {
							success = match[0];
						}
					}
					catch (INVALID_CHARACTER_ERR) {
						thisnick = chat[i].match(/^[a-z]+:/);
						chat[i] = "<span class=\"nick\">" + thisnick + "</span> <span class=\"diffkey\">encrypted</span>";
						encrypted = 1;
					}
				}
				if (((success) && (hmac != Crypto.HMAC(Crypto.SHA1, ciphertext + success, getkey(ciphertext  + success, 4)))) || (!hmac)) {
					thisnick = chat[i].match(/^[a-z]+:/);
					chat[i] = "<span class=\"nick\">" + thisnick + "</span> <span class=\"diffkey\">corrupted</span>";
					corrupted = 1;
				}
				else if (success) {
					chat[i] = chat[i].replace(/\[B-M\](.*)\[E-M\]/, success.substring(5, success.length - 5));
					chat[i] = scrubtags(chat[i]);
				}
				if (match = chat[i].match(/((mailto\:|(news|(ht|f)tp(s?))\:\/\/){1}\S+)/gi)) {
					for (mc = 0; mc <= match.length - 1; mc++) {
						var sanitize = match[mc].split("");
						for (ii = 0; ii <= sanitize.length-1; ii++) {
							if (!sanitize[ii].match(/\w|\d|\:|\/|\?|\=|\#|\+|\,|\.|\&|\;|\%/)) {
								sanitize[ii] = encodeURIComponent(sanitize[ii]);
							}
						}
						sanitize = sanitize.join("");
						chat[i] = chat[i].replace(sanitize, "<a target=\"_blank\" href=\"" + install + "?redirect=" + escape(sanitize) + "\">" + match[mc] + "</a>");
					}
				}
				chat[i] = chat[i].replace(/\&lt\;3/g, "&#9829;");
				if (match = chat[i].match(/^[a-z]+:\s\/me\s/)) {
					match = match[0];
					thisnick = chat[i].match(/^[a-z]+:/);
					thisnick = thisnick[0].substring(0, thisnick[0].length - 1);
					chat[i] = chat[i].replace(/^[a-z]+:\s\/me\s/, "<span class=\"nick\">* " + thisnick + " ") + " :3 *</span>";
				}
				else if (match = chat[i].match(/^[a-z]+:/)) {
					match = match[0];
					chat[i] = chat[i].replace(/^[a-z]+:/, "<span class=\"nick\">" + match + "</span>");
				}
			}
			else if (match = chat[i].match(/^(\&gt\;|\&lt\;) [a-z]{1,12} (has arrived|has left)$/)) {
				chat[i] = chat[i].replace(/^(\&gt\;|\&lt\;) [a-z]{1,12} (has arrived|has left)$/, "<span class=\"nick\">" + match[0] + "</span>");
				user = 1;
			}
			else if (match = chat[i].match(/^# [a-z]{1,12} is now known as [a-z]{1,12}$/)) {
				chat[i] = chat[i].replace(/^# [a-z]{1,12} is now known as [a-z]{1,12}$/, "<span class=\"nick\">" + match[0] + "</span>");
				user = 1;
			}
			else if (thisnick = chat[i].match(/^[a-z]+:/)) {
				chat[i] = "<span class=\"nick\">" + thisnick + "</span> <span class=\"diffkey\">corrupted</span>";
				corrupted = 1;
			}
			else {
				chat[i] = "<span class=\"diffkey\">very suspicious corruption detected! your chat may be compromised!</span>"
				corrupted = 1;
			}
			chat[i] = nl2br(chat[i]);
			if (user) {
				tag = "u";
			}
			else if (corrupted) {
				tag = "c";
			}
			else if (encrypted) {
				tag = "e";
			}
			else {
				tag = "";
			}
			if ((!flip) && ($("#chat").html().split("\n").length % 2)) {
				tag += "msg";
			}
			else {
				if (i % 2) {
					tag += "msg";
				}
				else {
					tag += "gsm";
				}
			}
			chat[i] = "<div class=\"" + tag + "\"><div class=\"text\">" + chat[i] + "</div></div>";
		}
	}
	chat = chat.join("\n");
	return chat;
}

function errordisplay(error) {
	$("#chatters").animate({
		backgroundColor: "#DF93D6",
		"font-weight": "bold"
	}, 500 );
	$("#chat").animate({
		borderTopColor: "#DF93D6",
		borderRightColor: "#DF93D6",
		borderBottomColor: "#DF93D6",
		borderLeftColor: "#DF93D6"
	}, 500 );
	$("#chatters").html("<span class=\"chatters\">x</span>&nbsp " + error);
	errored++;
}

function updatechat(div){
	var divold = 0;
	if (div == "#chat") {
		posold = pos;
		pos = "chat";
		divold = "#chat";
		div = "#loader";
	}
	$(div).load("index.php?chat=" + name + "&pos=" + pos, function() {
		if ($("#loader").html() == "NOEXIST") {
			if (!errored && nickset) {
				errordisplay("your chat no longer exists.");
			}
		}
		else if ($("#loader").html() == "NOLOGIN") {
			if (!errored && nickset) {
				errordisplay("you have been logged out.");
			}
		}
		else if (($("#loader").html() != "") || (divold == "#chat")) {
			pos = $("#loader").html().split("\n").length;
			$("#chat").html(processline($("#loader").html(), 1));
			scrolldown();
			if (!focus) {
				num++;
				document.title = "[" + num + "] cryptocat";
				if (sound) {
					soundPlay("snd/msg.ogg");
				}
			}
			updatechatters();
		}
		else if (errored) {
			updatechatters();
		}
	});
	if (divold == "#chat") {
		pos = posold;
	}
}

function updatechatters() {
	error = $("#chatters").html();
	$("#chatters").load("index.php?chatters=" + name, function() {
		if ($("#chatters").html() != error) {
			$("#chatters").animate({
				backgroundColor: "#97CEEC",
				"font-weight": "normal"
			}, 500 );
			$("#chat").animate({
				borderTopColor: "#97CEEC",
				borderRightColor: "#97CEEC",
				borderBottomColor: "#97CEEC",
				borderLeftColor: "#97CEEC"
			}, 500 );
			errored = 0;
		}
	});
}

$("#chatform").submit( function() {
	var msg = $.trim($("#input").val());
	$("#input").val("");
	if (msg != "") {
		var msg = "[B-M]" + msg + "[E-M]";
		msg = msg.replace(/\$/g,"&#36;");
		var encoded = Crypto.AES.encrypt(msg, key);
		var hmac = Crypto.HMAC(Crypto.SHA1, encoded + msg, getkey(encoded + msg, 4));
		encoded = nick + ": " + "[B-C]" + encoded + "[E-C][B-H]" + hmac + "[E-H]";
		document.getElementById("chat").innerHTML += processline(encoded, 0);
		scrolldown();
	}
	else {
		encoded = "";
	}
	$.ajax( { url: "index.php",
		type: "POST",
		data: "input=" + encodeURIComponent(encoded) + "&name=" + $("#name").val() + "&talk=send",
		success: function(data) {
			document.getElementById("input").focus();
			$("#talk").val(maxinput);
		},
		error: function(data) {
		}
	});
	return false;    
});

$("#nickform").submit( function() {
	$("#nickinput").val(document.getElementById("nickinput").value.toLowerCase());
	$("#nickinput").animate({
		color: "#000"
	}, 200 );
	$.ajax( { url: "index.php",
		type: "POST",
		data: "nick=" + $("#nickinput").val() + "&name=" + $("#name").val(),
		success: function(data) {
			if (data != "error") {
				$("#nickinput").animate({
					color: "#97CEEC"
				}, 200 );
				$("#nick").html($("#nickinput").val());
				nick = $("#nick").html();
				$("#front").fadeOut();
				gotsalt = data;
				nickset = 1;
				document.getElementById("input").focus();
				updatekey();
				document.title = "[" + num + "] cryptocat";
				interval = setInterval("updatechat(\"#loader\")", update);
			}
			else {
				$("#nickinput").animate({
					color: "#97CEEC"
				}, 200 );
				$("#nickinput").val("bad nickname");
				$("#front").fadeIn();
				StuffSelect("nickinput");
			}
		}
	});
	return false;
});

$("#sound").click(function(){
	if (sound) {
		$("#sound").attr("src", "img/nosound.png");
		$("#sound").attr("title", "enable message notifications");
		sound = 0;
		document.getElementById("input").focus();
	}
	else {
		$("#sound").attr("src", "img/sound.png");
		$("#sound").attr("title", "disable message notifications");
		sound = 1;
		document.getElementById("input").focus();
	}
});

$("#maximize").click(function(){
	if (maximized) {
		$("#main").animate({
			"margin-top": "4.5%",
			"min-width": "600px",
			"min-height": "420px",
			width: "600px",
			height: "420px"
		}, 500 );
		$("#chatters").animate({
			width: "575px",
			"margin-left": "2px",
		}, 500 );
		$("#info").animate({
			width: "578px",
			"margin-left": "1px"
		}, 500 );
		$("#key").animate({
			width: "508px",
			"margin-left": "1px"
		}, 500 );
		$("#input").animate({
			width: "508px",
			"margin-left": "1px"
		}, 500 );
		$("#talk").animate({
			width: "67px"
		}, 500 );
		$("#strength").animate({
			"margin-left": "5px"
		}, 500 );
		$("#chat").animate({
			margin: "0 auto",
			"margin-top": "20px",
			"min-height": "295px",
			width: "585px",
			height: "295px"
		}, 500, function() {
		    updatechat("#chat");
		});
		$("#maximize").attr("src", "img/maximize.png");
		$("#maximize").attr("title", "expand");
		maximized = 0;
		document.getElementById("input").focus();
	}
	else {
		$("#main").animate({
			"margin-top": "2%",
			"min-width": "900px",
			"min-height": "480px",
			width: "85%",
			height: "90%"
		}, 500 );
		$("#chatters").animate({
			width: "98.2%",
			"margin-left": "5px",
			"margin-top": "-22px"
		}, 500 );
		$("#info").animate({
			width: "98%",
			"margin-left": "3px"
		}, 500 );
		$("#key").animate({
			width: "92%",
			"margin-left": "3px"
		}, 500 );
		$("#input").animate({
			width: "92%",
			"margin-left": "3px"
		}, 500 );
		$("#talk").animate({
			width: "5.3%"
		}, 500 );
		$("#strength").animate({
			"margin-left": "36%"
		}, 500 );
		$("#chat").animate({
			margin: "2px",
			"margin-top": "10px",
			"min-height": "360px",
			width: "99%",
			height: "80%"
		}, 500, function() {
			scrolldown();
		});
		$("#maximize").attr("src", "img/minimize.png");
		$("#maximize").attr("title", "contract");
		maximized = 1;
		document.getElementById("input").focus();
	}
});

function changenick() {
	$("#front").fadeIn();
	StuffSelect("nickinput");
}

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
	$.ajax( { url : "index.php",
		type: "POST",
		async: false,
		data: "logout=" + name,
	});
	window.location = install
}

$("#nickicon,#nick").click(function(){
	changenick();
});

$(document).ajaxError(function(){
	if (!errored) {
		errordisplay("you have been disconnected. reconnecting...");
	}
});

changenick();