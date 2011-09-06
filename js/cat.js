Math.seedrandom();
var t, num, interval, maximized, sound, errored, reconnect, mysecret, mypublic, mtag, nickset;
t = num = interval = maximized = sound = errored = reconnect = pos = 0;
mtag = "msg";
var names = new Array();
var keys = new Array();
var nick = $("#nick").html();
var focus = true;
var soundEmbed = null;

function scrolldown() {
	$("#chat").animate({ scrollTop: document.getElementById("chat").scrollHeight-20}, 500 );
}

function showstamp(nick) {
	var time = new Date();
	var h = time.getHours();
	var m = time.getMinutes();
	var spaces = "";
	for (si=0; si < (nick.length - 5); si++) {
		spaces += "&nbsp";
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

function gen(size) {
	var str = "";
	var charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
	for (i=0; i < size; i++) {
        str += charset.charAt(Math.floor(Math.random() * charset.length));
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

function scrubtags(str) {
	return str.replace(/</g,"&lt;").replace(/>/g,"&gt;");
}

function processline(chat, flip) {
	var i = 0;
	var decrypted, corrupt, user;
	decrypted = corrupt = user = 0;
	if (chat) {
		if (match = chat.match(/[a-z]{1,12}:\s\[B-C\](.*)\[E-C\]$/)) {
			match = chat.match(/\[B-C\](.*)\[E-C\]/);
			decrypted = cryptico.decrypt(match[0].substring(5, match[0].length - 5), mysecret);
			if (decrypted.signature != "verified") {
				chat = "<span class=\"nick\">" + thisnick + "</span> <span class=\"diffkey\">corrupt</span>";
				corrupt = 1;
			}
			else if (decrypted.status == "success") {
				chat = chat.replace(/\[B-C\](.*)\[E-C\]/, decrypted.plaintext.replace(/(\r\n|\n\r|\r|\n)/gm, ""));
			}
			else {
				chat = "<span class=\"diffkey\">decryption failure</span>";
				corrupt = 1;
			}
		}
		if ((!flip) || ((decrypted.status == "success") && (decrypted.signature == "verified"))) {
			chat = scrubtags(chat);
			if (match = chat.match(/((mailto\:|(news|(ht|f)tp(s?))\:\/\/){1}\S+)/gi)) {
				for (mc = 0; mc <= match.length - 1; mc++) {
					var sanitize = match[mc].split("");
					for (ii = 0; ii <= sanitize.length-1; ii++) {
						if (!sanitize[ii].match(/\w|\d|\:|\/|\?|\=|\#|\+|\,|\.|\&|\;|\%/)) {
							sanitize[ii] = encodeURIComponent(sanitize[ii]);
						}
					}
					sanitize = sanitize.join("");
					chat = chat.replace(sanitize, "<a target=\"_blank\" href=\"" + install + "?redirect=" + escape(sanitize) + "\">" + match[mc] + "</a>");
				}
			}
			chat = chat.replace(/\&lt\;3/g, "&#9829;");
			if (match = chat.match(/^[a-z]+:\s\/me\s/)) {
				match = match[0];
				thisnick = match.match(/^[a-z]{1,12}/);
				chat = chat.replace(/^[a-z]+:\s\/me\s/, "<span class=\"nick\">* " + thisnick + " ") + " *</span>";
			}
			else if (match = chat.match(/^[a-z]{1,12}/)) {
				chat = chat.replace(/^[a-z]+:/, "<span class=\"nick\" onmouseover=\"this.innerHTML = showstamp(\'" + match[0] + "\');\" onmouseout=\"this.innerHTML = \'" + match[0] + "\';\">" + match[0] + "</span>");
			}
		}
		else if ((match = chat.match(/^(\&gt\;|\&lt\;) [a-z]{1,12} (has arrived|has left)$/))) {
			chat = "<span class=\"nick\">" + match[0] + "</span>";
			user = 1;
			updatekeys();
			updatechatters();
		}
		else if (thisnick = chat.match(/^[a-z]{1,12}/)) {
			chat = "<span class=\"nick\">" + thisnick + "</span> <span class=\"diffkey\">corrupt</span>";
			corrupt = 1;
		}
		else {
			chat = "<span class=\"diffkey\">corrupt</span>"
			corrupt = 1;
		}
		if (user) {
			tag = "u";
		}
		else if (corrupt) {
			tag = "c";
		}
		else {
			tag = "";
		}
		if (mtag == "msg") {
			tag += mtag;
			mtag = "gsm";
		}
		else if (mtag == "gsm") {
			tag += mtag;
			mtag = "msg";
		}
		chat = "<div class=\"" + tag + "\"><div class=\"text\">" + chat + "</div></div>";
	}
	return chat;
}

function updatekeys() {
	$.ajax( { url: "index.php",
		type: "POST",
		async: false,
		data: "nick=" + $("#nickinput").val() + "&name=" + $("#name").val() + "&public=get",
		success: function(data) {
			data = data.split('|');
			for (i=0; i <= data.length - 1; i++) {
				keymatch = data[i].match(/^[a-z]{1,12}:/);
				names[i] = keymatch[0].substring(0, keymatch[0].length - 1);
				keymatch = data[i].match(/:.+/);
				keys[i] = decodeURIComponent(keymatch[0].substring(1));
			}
		}
	});
}

function updatechat(div){
	$(div).load("index.php?chat=" + name + "&pos=" + pos, function() {
		if ($("#loader").html() == "NOEXIST") {
			if (!errored && mypublic) {
				errordisplay("your chat no longer exists.");
			}
		}
		else if ($("#loader").html() == "NOLOGIN") {
			if (!errored && mypublic) {
				errordisplay("you have been logged out.");
			}
		}
		else if (($("#loader").html() != "")) {
			chathtml = $("#chat").html();
			pos++;
			if ((pos) && (nickset)) {
				$('#keygen').fadeOut('slow', function() {
				    $("#front").fadeOut();
				});
				nickset = 0;
			}
			if ((match = $("#loader").html().match(/^[a-z]{1,12}/)) && (match[0] == nick)) {
			}
			else {
				$("#chat").html(chathtml += processline($("#loader").html(), 1));
			}
			scrolldown();
			if (!focus) {
				num++;
				document.title = "[" + num + "] cryptocat";
				if (sound) {
					soundPlay("snd/msg.ogg");
				}
			}
		}
		else if (errored && reconnect) {
			updatechatters();
		}
	});
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
	msg = msg.replace(/\$/g,"&#36;");
	var msgc = nick + ": " + msg;
	$("#input").val("");
	if (msg != "") {
		gsm = "";
		var i = 0;
		for (i=0; i <= keys.length - 1; i++) {
			gsm += "(" + names[i] + ")" + cryptico.encrypt(msg, keys[i], mysecret).cipher;
		}
		msg = nick + ": " + "[B-C]" + gsm.replace(/(\r\n|\n\r|\r|\n)/gm, "") + "[E-C]";
		document.getElementById("chat").innerHTML += processline(msgc, 0);
		scrolldown();
	}
	else {
		msg = "";
	}
	$.ajax( { url: "index.php",
		type: "POST",
		async: true,
		data: "input=" + encodeURIComponent(msg) + "&name=" + $("#name").val() + "&talk=send",
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
	if (!mypublic) {
		$('#nickentry').fadeOut('slow', function() {
			$('#keygen').fadeIn('slow', function() {
				mysecret = cryptico.generateRSAKey(gen(48), 512);
				mypublic = cryptico.publicKeyString(mysecret);
				nickajax();
			});
		});
	}
	else {
		nickajax();
	}
	return false;
});

function nickajax() {
	$.ajax( { url: "index.php",
		type: "POST",
		async: true,
		data: "nick=" + $("#nickinput").val() + "&name=" + $("#name").val() + "&public=" + encodeURIComponent(mypublic),
		success: function(data) {
			if ((data != "error") && (data != "already")) {
				$("#nickinput").animate({
					color: "#97CEEC"
				}, 200 );
				nickset = 1;
				$("#nick").html($("#nickinput").val());
				nick = $("#nick").html();
				document.getElementById("input").focus();
				document.title = "[" + num + "] cryptocat";
				interval = setInterval("updatechat(\"#loader\")", update);
			}
			else {
				$('#keygen').fadeOut('slow', function() {
					$("#nickentry").fadeIn('slow');
					$("#nickinput").animate({
						color: "#97CEEC"
					}, 200 );
					if (data == "already") {
						$("#nickinput").val("already logged in");
					}
					else {
						$("#nickinput").val("bad nickname");
					}
					$("#front").fadeIn();
					StuffSelect("nickinput");
				});
			}
		}
	});
}

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
			width: "525px",
			"margin-left": "1px",
		}, 500 );
		$("#info").animate({
			width: "578px",
			"margin-left": "1px"
		}, 500 );
		$("#input").animate({
			width: "508px",
			"margin-left": "1px"
		}, 500 );
		$("#talk").animate({
			width: "67px"
		}, 500 );
		$("#chat").animate({
			margin: "0 auto",
			"margin-top": "10px",
			"min-height": "310px",
			width: "585px",
			height: "295px"
		}, 500, function() {
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
			"min-height": "505px",
			width: "85%",
			height: "90%"
		}, 500 );
		$("#chatters").animate({
			width: "93.44%",
			"margin-left": "3px"
		}, 500 );
		$("#info").animate({
			width: "98%",
			"margin-left": "3px"
		}, 500 );
		$("#input").animate({
			width: "92%",
			"margin-left": "3px"
		}, 500 );
		$("#talk").animate({
			width: "5.3%"
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
}

$(document).ajaxError(function(){
	if (!errored) {
		errordisplay("you have been disconnected. reconnecting...");
		reconnect = 1;
	}
});

$("#nickentry").fadeIn();
$("#front").fadeIn();
StuffSelect("nickinput");