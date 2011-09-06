Math.seedrandom();
var t, num, interval, maximized, sound, errored, reconnect, mysecret, mypublic, mtag;
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

function showstamp(timestamp, nick) {
	var time = new Date();
	var h = time.getHours();
	var m = time.getMinutes();
	var u = time.getUTCHours();
	var spaces = "";
	for (si=0; si < (nick.length - 5); si++) {
		spaces += "&nbsp";
	}
	if (!timestamp) {
		if (String(m).length == 1) {
			m = "0" + String(m);
		}
		return spaces + h + ":" + m;
	}
	var offset = u - h;
	timestamp += '';
	u = parseInt(timestamp.substring(0, 2));
	h = u - offset;
	return spaces + h + ":" + timestamp.substring(2);
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
	chat = chat.split("\n");
	var i = 0;
	for (i=0; i <= chat.length-1; i++) {
		var decrypted, corrupt, user;
		decrypted = corrupt = user = 0;
		if ((chat[i])) {
			chat[i] = chat[i];
			if ((!flip) && (match = chat[i].match(/^[a-z]{1,12}/))) {
				chat[i] = chat[i].replace(/^[a-z]+:/, "<span class=\"nick\" onmouseover=\"this.innerHTML = showstamp(" + 0 + ",\'" + match[0] + "\');\" onmouseout=\"this.innerHTML = \'" + match[0] + "\';\">" + match[0] + "</span>");
			}
			else if (match = chat[i].match(/[a-z]{1,12}:\s\[B-C\](.*)\[E-C\]$/)) {
				thisnick = match[0].match(/^[a-z]{1,12}/);
				if (flip) {
					var timestamp = chat[i].substring(0, 4);
					chat[i] = chat[i].substring(4, chat[i].length);
				}
				match = chat[i].match(/\[B-C\](.*)\[E-C\]/);
				decrypted = cryptico.decrypt(match[0].substring(5, match[0].length - 5), mysecret);
				if (decrypted.signature != "verified") {
					chat[i] = "<span class=\"nick\">" + thisnick + "</span> <span class=\"diffkey\">corrupt</span>";
					corrupt = 1;
				}
				else if (decrypted.status == "success") {
					chat[i] = chat[i].replace(/\[B-C\](.*)\[E-C\]/, decrypted.plaintext.replace(/(\r\n|\n\r|\r|\n)/gm, ""));
					chat[i] = scrubtags(chat[i]);
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
						chat[i] = chat[i].replace(/^[a-z]+:\s\/me\s/, "<span class=\"nick\">* " + thisnick[0] + " ") + " *</span>";
					}
					else if (match = chat[i].match(/^[a-z]{1,12}/)) {
						chat[i] = chat[i].replace(/^[a-z]+:/, "<span class=\"nick\" onmouseover=\"this.innerHTML = showstamp(" + 0 + ",\'" + match[0] + "\');\" onmouseout=\"this.innerHTML = \'" + match[0] + "\';\">" + match[0] + "</span>");
					}
				}
				else {
					chat[i] = "<span class=\"diffkey\">decryption failure</span>";
					corrupt = 1;
				}
			}
			else if ((match = chat[i].match(/^(\&gt\;|\&lt\;) [a-z]{1,12} (has arrived|has left)$/))) {
				chat[i] = "<span class=\"nick\">" + match[0] + "</span>";
				user = 1;
				updatekeys();
			}
			else if (thisnick = chat[i].match(/^[a-z]{1,12}/)) {
				chat[i] = "<span class=\"nick\">" + thisnick + "</span> <span class=\"diffkey\">corrupt</span>";
				corrupt = 1;
			}
			else {
				chat[i] = "<span class=\"diffkey\">corrupt</span>"
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
			chat[i] = "<div class=\"" + tag + "\"><div class=\"text\">" + chat[i] + "</div></div>";
		}
	}
	chat = chat.join("\n");
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
			split = $("#loader").html().split("\n");
			pos += split.length;
			for (li = 0; li < split.length; li++) {
				if ((splitmatch = split[li].match(/^[0-9]{4}[a-z]{1,12}/)) && (splitmatch[0].substring(4) == nick)) {
					split.splice(li, 1);
				}
			}
			$("#loader").html(split.join("\n"));
			$("#chat").html(chathtml += processline($("#loader").html(), 1));
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
				mysecret = cryptico.generateRSAKey(gen(48), 768);
				mypublic = cryptico.publicKeyString(mysecret);
				$('#keygen').fadeOut('slow', function() {
				    $("#front").fadeOut();
					nickajax();
				});
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
				$("#nick").html($("#nickinput").val());
				nick = $("#nick").html();
				if (mypublic) {
					$("#front").fadeOut('slow');
				}
				document.getElementById("input").focus();
				document.title = "[" + num + "] cryptocat";
				interval = setInterval("updatechat(\"#loader\")", update);
			}
			else {
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