<?php
	/* cryptocat 0.3 */
	$install = 'https://crypto.cat/';
	$domain = "crypto.cat";
	$data = '/srv/data/';
	$timelimit = 1800;
	$update = 1500;
	$nicks = array('bunny', 'kitty', 'pony', 'puppy', 'squirrel', 'sparrow', 'kiwi', 'fox', 'owl', 'raccoon', 'mongoose', 'koala', 'teddy', 'mouse', 'turtle', 'seal', 'dolphin', 'hedgehog', 'echidna', 'panther', 'lemur', 'duck');
	$maxusers = count($nicks);
	$maxinput = 256;
	$usednicks = array();
	$usedsessions = array();
	session_set_cookie_params(0, '/', $domain, TRUE, TRUE); 
?>
<?php
	function gen($size) {
		for ($i=0; $i<$size; $i++) {
			$c=mt_rand(0,51);
			if ($c<26) { $gen .= chr(mt_rand(65,90)); }
			else if ($c<36) { $gen .= chr(mt_rand(48,57)); }
			else { $gen .= chr(mt_rand(97,122)); }
		}
		return $gen;
	}
	function getpeople($chat) {
		global $nick, $mysession, $mypos, $usednicks, $usedsessions, $_SESSION;
		preg_match_all('/.{32}:\w+\+\d+-/', $chat[1], $people);
		$people = $people[0];
		for ($i = 0; $i < count($people); $i++) {
			preg_match('/.{32}:/', $people[$i], $session);
			$session = substr($session[0], 0, -1);
			preg_match('/:.+\+/', $people[$i], $existingnick);
			$existingnick = substr($existingnick[0], 1, -1);
			preg_match('/\+.+\-/', $people[$i], $pos);
			$pos = substr($pos[0], 1, -1);
			if ($session == $_SESSION['id']) {
				$nick = $existingnick;
				$mysession = $session;
				$mypos = $pos;
			}
			else {
				array_push($usedsessions, $session);
				array_push($usednicks, $existingnick);
			}
		}
	}	
	if (isset($_GET['redirect'])) {
		header('Location: '.$_GET['redirect']);
	}
	else if (isset($_GET['chat']) && $_SERVER['HTTP_REFERER'] == $install."?c=".$_GET['chat'] && preg_match('/^([a-z]|_|[0-9])+$/', $_GET['chat'])) {
		session_name($_GET['chat']);
		session_start();
		$chat = file($data.$_GET['chat']);
		getpeople($chat);
		if (!$chat) {
			print('NOEXIST');
		}
		else if (isset($_GET['pos']) && (($_GET['pos'] < (count($chat) - $mypos)) || ($_GET['pos'] == "chat")) && $_GET['pos'] >= 0) {
			if ($mysession == $_SESSION['id'] && !is_null($_SESSION['id'])) {
				for ($i = $mypos; $i < count($chat); $i++) {
					print(htmlspecialchars($chat[$i]));
				}
			}
			else {
				print('NOLOGIN');
			}
		}
		exit;
	}
	else if (isset($_POST['name']) && preg_match('/^([a-z]|_|[0-9])+$/', $_POST['name']) && isset($_POST['input']) && $_POST['input'] != '' && strlen($_POST['input']) <= $maxinput*2.5 + 68) {
		session_name($_POST['name']);
		session_start();
		$chat = file($data.$_POST['name']);
		getpeople($chat);
		preg_match('/^[a-z]+:/', $_POST['input'], $thisnick);
		$thisnick = substr($thisnick[0], 0, -1);
		$_POST['input'] = trim($_POST['input']);
		if ($_POST['input'] != "" && $nick == $thisnick) {
			$chat = "\n".$_POST['input'];
			file_put_contents($data.$_POST['name'], $chat, FILE_APPEND | LOCK_EX);
		}
		exit;
	}
	else if (isset($_GET['chatters']) && $_SERVER['HTTP_REFERER'] == $install."?c=".$_GET['chatters'] && preg_match('/^([a-z]|_|[0-9])+$/', $_GET['chatters'])) {
		session_name($_GET['chatters']);
		session_start();
		$chat = file($data.$_GET['chatters']);
		getpeople($chat);
		$total = count($usednicks) + 1;
		if ($mysession == $_SESSION['id'] && !is_null($_SESSION['id'])) {
			print('<span class="chatters">'.$total.'</span> '.htmlspecialchars($nick.' '.implode(' ', $usednicks)));
		}
		exit;
	}
	else if (isset($_POST['nick']) && preg_match('/^([a-z]|[0-9])+$/', $_POST['nick']) && strlen($_POST['nick']) <= 12 && isset($_POST['name']) && preg_match('/^([a-z]|_|[0-9])+$/', $_POST['name'])) {
		session_name($_POST['name']);
		session_start();
		$chat = file($data.$_POST['name']);
		getpeople($chat);
		if (file_exists($data.$_POST['name'])) {
			if (time() - filemtime($data.$_POST['name']) > $timelimit) {
				unlink($data.$_POST['name']);
				createchat($_POST['name'], $_POST['nick']);
				joinchat($_POST['name'], $_POST['nick']);
				print(trim($chat[0]));
				exit;
			}
		}
		if ($_POST['nick'] == $nick) {
			print(trim($chat[0]));
		}
		else if ($nick && !in_array($_POST['nick'], $usednicks)) {
			$chat[1] = preg_replace('/\:'.$nick.'\+/', ':'.$_POST['nick'].'+', $chat[1]);
			$chat[count($chat)] = "\n".'# '.$nick.' is now known as '.$_POST['nick'];
			file_put_contents($data.$_POST['name'], $chat, LOCK_EX);
			print(trim($chat[0]));
		}
		else if (!$nick) {
			if (file_exists($data.$_POST['name'])) {
				joinchat($_POST['name'], $_POST['nick']);
				if (!$used) {
					print(trim($chat[0]));
				}
				else {
					print('error');
				}
			}
			else if (createchat($_POST['name'], $_POST['nick'])) {
				joinchat($_POST['name'], $_POST['nick']);
				$chat = file($data.$_POST['name']);
				print(trim($chat[0]));
			}
		}
		else {
			print('error');
		}
		exit;
	}
	else if (isset($_POST['nick'])) {
		print('error');
		exit;
	}
?>
<?php print('<?xml version="1.0" encoding="UTF-8"?>'); ?> 
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.1//EN" "http://www.w3.org/TR/xhtml11/DTD/xhtml11.dtd">
<html xmlns="http://www.w3.org/1999/xhtml"
     xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
     xml:lang="en" > 
<head>
	<meta http-equiv="Content-Type" content="application/xhtml+xml" />
	<meta name="keywords" content="cryptocat, encrypted chat, minichat, online chat" />
	<title>cryptocat</title>
	<link rel="stylesheet" href="css/style.css" type="text/css" /> 
	<link rel="icon" type="image/png" href="img/favicon.gif" />
	<script  type="text/javascript" src="js/jquery.js"></script>
	<script  type="text/javascript" src="js/color.js"></script>
	<!-- cryptocat uses the crypto-js library - http://code.google.com/p/crypto-js/ -->
	<!-- http://crypto-js.googlecode.com/files/2.3.0-crypto-sha1-hmac-pbkdf2-blockmodes-aes.js -->
	<script type="text/javascript" src="js/crypto.js"></script>
	<script type="text/javascript" src="js/seedrandom.js"></script>
	<script type="text/javascript">
		function StuffSelect(id) {
			document.getElementById(id).focus();
			document.getElementById(id).select();
		}
	</script>
</head>
<?php
if (isset($_GET['c']) && preg_match('/^([a-z]|_|[0-9])+$/', $_GET['c'])) {
	print('<body onbeforeunload="logout();">'."\n");
}
else {
	print('<body onload="document.getElementById(\'name\').focus();">'."\n");
}
?>
	<?php
		function welcome($name) {
			global $install;
			print('<div id="main">
				<img src="img/cryptocat.png" alt="cryptocat" class="cryptocat" />
				<form action="'.$install.'" method="post" class="create" id="welcome">
					<input type="text" class="name" name="name" id="name" onclick="StuffSelect(\'name\');" value="'.$name.'" maxlength="32" autocomplete="off" />
					<input type="submit" name="create" class="create" value="enter" id="create" onclick="updateaction();" />
					<p id="video">(first time? check out this <a href="info">awesome video!</a>)</p>
				</form>
				<table>
					<tr>
						<td class="img"><img src="img/1.png" alt="" /></td>
						<td id="td1"><strong>cryptocat</strong> lets you set up encrypted, private chats for impromptu secure conversations. check out this <a href="info">video</a> for tips on how to get started!</td>
					</tr>
					<tr>
						<td class="img"><img src="img/2.png" alt="" /></td>
						<td id="td2">your messages are encrypted before leaving your computer using AES-256 and are verified for integrity. all conversations are securely wiped after 30 minutes of inactivity.</td>
					</tr>
					<tr>
						<td class="img"><img src="img/3.png" alt="" /></td>
						<td id="td3">cryptocat is fully compatible with <a target="_blank" href="https://torproject.org">Tor</a> for anonymous chatting. couple cryptocat with Tor anonymization for maximum confidentiality.</td>
					</tr>
				</table>
				<p class="bottom" id="bottom">
					<a href="#" id="translate" onclick="translate()">català</a> | 
					<a href="about">about</a> | 
					cryptocat is beta software under active development | 
					<a target="_blank" href="https://twitter.com/cryptocatapp">twitter</a> | 
					<a target="_blank" href="https://github.com/kaepora/cryptocat/">github</a>
				</p>
			</div>
			<script type="text/javascript">
				var td1 = $("#td1").html();
				var td2 = $("#td2").html()
				var td3 = $("#td3").html()
				var video = $("#video").html()
				var bottom = $("#bottom").html()
				var name = $("#name").val()
				var create = $("#create").val()
				var curlang = "english";
						
				function updateaction() {
					$("#name").val(document.getElementById("name").value.toLowerCase());
					document.getElementById("welcome").action = \''.$install.'\'+\'?c=\'+$("#name").val().toLowerCase();
				}
						
				function translate() {
					if (curlang == "english") {
						$("#td1").html("<strong>cryptocat</strong> li permet establir xats encriptada, privada de improvisada converses segures. Fes una ullada a aquest <a href=\"info\">vídeo</a> per obtenir consells sobre com començar!");
						$("#td2").html("els seus missatges són encriptades abans de sortir del seu ordinador usant un algoritme AES-256 i es verifiquen la integritat. totes les converses estan ben esborrat després de 30 minuts d\'inactivitat.");
						$("#td3").html(\'cryptocat és totalment compatible amb <a target="_blank" href="https://torproject.org">Tor</a> per anònima al xat. utilitzeu cryptocat amb Tor de forma anònima la màxima confidencialitat.\');
						$("#video").html("(per primera vegada? fes un cop d\'ull a aquest <a href=\"info\">vídeo impressionant!</a>)");
						$("#bottom").html(\'<a href="#" id="translate" onclick="translate()">english</a> | <a href="about">sobre</a> | cryptocat és el programari beta en el desenvolupament actiu | <a target="_blank" href="https://twitter.com/cryptocatapp">twitter</a> | <a target="_blank" href="https://github.com/kaepora/cryptocat/">github</a>\');
						$("#name").val("escrigui el seu nom de xat");
						$("#create").val("entrar");
						curlang = "catalan";
					}
					else if (curlang == "catalan") {
						$("#td1").html(td1);
						$("#td2").html(td2);
						$("#td3").html(td3);
						$("#video").html(video);
						$("#bottom").html(bottom);
						$("#name").val(name);
						$("#create").val(create);
						curlang = "english";
					}
				}
			</script>');
		}
		function createchat($name, $setnick) {
			global $data, $_SESSION;
			session_name($name);
			session_start();
			if (!isset($_SESSION['id'])) {
				$_SESSION['id'] = gen(32);
			}
			$name = strtolower($name);
			$chat = array(0 => gen(18), 1 => $_SESSION['id'].':'.$setnick.'+2-');
			array_push($chat, '> '.$setnick.' enters '.$name);
			file_put_contents($data.$name, implode("\n", $chat), LOCK_EX);
			return 1;
		}
		function joinchat($name, $setnick) {
			global $data, $maxusers, $nick, $mysession, $mypos, $usednicks, $usedsessions, $_SESSION, $used;
			$used = 0;
			session_name($name);
			session_start();
			$name = strtolower($name);
			$chat = file($data.$name);
			getpeople($chat);
			$pos = count($chat);
			if (!isset($_SESSION['id'])) {
				$_SESSION['id'] = gen(32);
				while (in_array($_SESSION['id'], $usedsessions)) {
					$_SESSION['id'] = gen(32);
				}
			}
			if (count($usedsessions) >= $maxusers) {
				welcome('chat is full');
			}
			else {
				if (!isset($nick)) {
					if (in_array($setnick, $usednicks)) {
						$used = 1;
						exit;
					}
					else {
						$nick = $setnick;
					}
					if ($chat[0] == "\n") {
						$chat[0] = gen(18)."\n";
					}
					$chat[1] = trim($chat[1]).$_SESSION['id'].':'.$nick.'+'.$pos.'-'."\n";
					$chat[count($chat)+1] = "\n".'> '.$nick.' enters '.$name;
					file_put_contents($data.$name, implode('', $chat), LOCK_EX);
				}
			}
		}
		function chat($name, $nick) {
			global $data, $nicks, $timelimit, $maxinput, $install, $update, $_SESSION, $mysession, $usedsessions, $usednicks;
			$name = strtolower($name);
			$chat = file($data.$name);
			getpeople($chat);
			$nick = $nicks[mt_rand(0, count($nicks) - 1)];
			while (in_array($nick, $usednicks)) {
				$nick = $nicks[mt_rand(0, count($nicks) - 1)];
			}
			print('<div id="changenick">
				<p>enter your nickname</p>
				<form name="nickform" id="nickform" method="post" action="'.$install.'">
					<input type="text" name="nickinput" id="nickinput" value="'.$nick.'" maxlength="12" />
					<input type="submit" class="nicksubmit" value="chat" />
				</form>
				<p class="small">(letters and numbers only, 12 characters max)</p>
			</div>');
			print('<div id="main">
			<img src="img/cryptocat.png" alt="cryptocat" />
			<img src="img/maximize.png" alt="maximize" id="maximize" title="expand" />
			<img src="img/nosound.png" alt="sound" id="sound" title="enable message notifications" />
			<img src="img/user.png" alt="change nick" id="nickicon" title="change nickname" />
			<input type="text" value="'.$name.'" name="name" id="name" class="invisible" />
			<div class="invisible" id="loader"></div>
			<div id="chat"></div>
			<div id="chatters"></div>');
			print('<div id="info">chatting as <a href="#" id="nick">'.$nick.'</a> on 
			<input readonly type="text" id="url" onclick="StuffSelect(\'url\');" value="'.$install.'?c='.$name.'" />
			<span id="strength"></span>
			<a class="logout" onclick="logout();" href="#">log out</a></div>
			<input type="text" id="key" value="type a key here for encrypted chat. all chatters must use the same key." class="key" maxlength="192" onclick="StuffSelect(\'key\');" onkeyup="keytime();" autocomplete="off" />
			<form name="chatform" id="chatform" method="post" action="'.$install.'">
				<input type="text" name="input" id="input" maxlength="'.$maxinput.'" 
				onkeydown="textcounter(document.chatform.input,document.chatform.talk,'.$maxinput.')" 
				onkeyup="textcounter(document.chatform.input,document.chatform.talk,'.$maxinput.')" autocomplete="off" />
				<input type="submit" name="talk" id="talk" onmouseover="curcount = this.value; this.value=\'send\';" onmouseout="this.value=curcount;" value="'.$maxinput.'" />
			</form>
			</div>');
			print('<script type="text/javascript">
				Math.seedrandom();
				var salt;
				var key;
				var curcount;
				var t = 0;
				var nick = $("#nick").html();
				var focus = true;
				var num = 0;
				var interval = 0;
				var maintime = 0;
				var nickset = 0;
				var pos = 0;
				var maximized = 0;
				var sound = 0;
				var soundEmbed = null;
				var errored = 0;
				var gotsalt = 0;
				var install = "'.$install.'"
				var match;
				var defaultsalt = 0;
				var defaultkey = 0;
				var defaultkeytext = $("#key").val();

				window.onfocus = function() {
					clearTimeout(blur);
					focus = true;
					num = 0;
					document.title = "[" + num + "] cryptocat";
				}
				window.onblur = function() {
					blur = setTimeout("focus = false", '.$update.'); 
				}
				document.onblur = window.onblur;
				document.focus = window.focus;

				function soundPlay(which) {
					if (!soundEmbed) {
						soundEmbed = document.createElement("audio");
						soundEmbed.setAttribute("src", which);
						soundEmbed.setAttribute("style", "display: none;");
						soundEmbed.setAttribute("autoplay", true);
					}
					else {
						document.body.removeChild(soundEmbed);
						soundEmbed.removed = true;
						soundEmbed = null;
						soundEmbed = document.createElement("audio");
						soundEmbed.setAttribute("src", which);
						soundEmbed.setAttribute("style", "display: none;");
						soundEmbed.setAttribute("autoplay", true);
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
						$("#strength").html = "";
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
					return (str + \'\').replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, \'$1\' + \'<br />\' + \'$2\');
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
													delete chat[o];
												}
												if (i > o) {
													delete chat[i];
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
										chat[i] = chat[i].replace(/\[B-C\](.*)\[E-C\]/, "<span class=\"diffkey\">encrypted</span>");
										encrypted = 1;
									}
								}
								if ((success) && (hmac != Crypto.HMAC(Crypto.SHA1, ciphertext + success, getkey(ciphertext  + success, 4)))) {
									alert(chat[i]);
									chat[i] = chat[i].replace(/\[B-M\](.*)*\[E-M\]/, "<span class=\"diffkey\">corrupted!</span>");
									corrupted = 1;
									alert(hmac);
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
							else {
								if (match = chat[i].match(/^(\&gt\;|\&lt\;|\#).+$/)) {
									match = match[0];
									chat[i] = chat[i].replace(/^(\&gt\;|\&lt\;|\#).+$/, "<span class=\"nick\">" + match + "</span>");
									user = 1;
								}
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
					$(div).load("index.php?chat='.$name.'&pos=" + pos, function() {
						if ($("#loader").html() == "NOEXIST") {
							if (!errored) {
								errordisplay("your chat no longer exists.");
							}
						}
						else if ($("#loader").html() == "NOLOGIN") {
							if (!errored) {
								errordisplay("you have been logged out.");
							}
						}
						else if (($("#loader").html() != "") || (divold == "#chat")) {
							pos = $("#loader").html().split("\n").length;
							$("#chat").html(processline($("#loader").html(), 1));
							document.getElementById("chat").scrollTop = document.getElementById("chat").scrollHeight;
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
					$("#chatters").load("index.php?chatters='.$name.'", function() {
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
					var orig = $("#input").val();
					var msg = $.trim($("#input").val());
					if (msg != "") {
						var msg = "[B-M]" + msg + "[E-M]";
						msg = msg.replace(/\$/g,"&#36;");
						var encoded = Crypto.AES.encrypt(msg, key);
						var hmac = Crypto.HMAC(Crypto.SHA1, encoded + msg, getkey(encoded + msg, 4));
						encoded = nick + ": " + "[B-C]" + encoded + "[E-C][B-H]" + hmac + "[E-H]";
						document.getElementById("chat").innerHTML += processline(encoded, 0);
						$("#input").val("");
						document.getElementById("chat").scrollTop = document.getElementById("chat").scrollHeight;
					}
					else {
						encoded = "";
					}
					$("#input").val("");
					document.getElementById("chat").scrollTop = document.getElementById("chat").scrollHeight;
					$.ajax( { url: "index.php",
						type: "POST",
						data: "input=" + encodeURIComponent(encoded) + "&name=" + $("#name").val() + "&talk=send",
						success: function(data) {
							document.getElementById("input").focus();
							$("#talk").val("'.$maxinput.'");
						},
						error: function(data) {
							$("#input").val(orig);
						}
					});
					return false;    
				});

				$("#nickform").submit( function() {
					$.ajax( { url: "index.php",
						type: "POST",
						async: false,
						data: "nick=" + $("#nickinput").val() + "&name=" + $("#name").val(),
						success: function(data) {
							if (data != "error") {
								$("#nick").html($("#nickinput").val());
								nick = $("#nick").html();
								$("#changenick").fadeOut();
								gotsalt = data;
								maintime = 0;
								nickset = 1;
								document.getElementById("input").focus();
								updatekey();
								interval = setInterval("updatechat(\"#loader\")", '.$update.');
							}
							else {
								$("#nickinput").val("bad nickname");
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
						document.getElementById(\'input\').focus();
					}
					else {
						$("#sound").attr("src", "img/sound.png");
						$("#sound").attr("title", "disable message notifications");
						sound = 1;
						document.getElementById(\'input\').focus();
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
						$("#chat").animate({
							margin: "0 auto",
							"margin-top": "20px",
							"min-height": "295px",
							width: "585px",
							height: "295px"
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
						$("#maximize").attr("src", "img/maximize.png");
						$("#maximize").attr("title", "expand");
						maximized = 0;
						setTimeout("document.getElementById(\'chat\').scrollTop = document.getElementById(\'chat\').scrollHeight;", 520);
						setTimeout("updatechat(\"#chat\")", 520);
						document.getElementById(\'input\').focus();
					}
					else {
						$("#main").animate({
							"margin-top": "2%",
							"min-width": "900px",
							"min-height": "480px",
							width: "85%",
							height: "90%"
						}, 500 );
						$("#chat").animate({
							margin: "2px",
							"margin-top": "10px",
							"min-height": "360px",
							width: "99%",
							height: "80%"
						}, 500 );
						$("#chatters").animate({
							width: "98%",
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
							"margin-left": "60%"

						}, 500 );
						$("#maximize").attr("src", "img/minimize.png");
						$("#maximize").attr("title", "contract");
						maximized = 1;
						setTimeout("document.getElementById(\'chat\').scrollTop = document.getElementById(\'chat\').scrollHeight;", 520);
						document.getElementById(\'input\').focus();
					}
				});

				$("#nick").click(function(){
					changenick();
				});

				$("#nickicon").click(function(){
					changenick();
				});

				function changenick() {
					$("#changenick").fadeIn();
					StuffSelect("nickinput");
					setTimeout("maintime = 1", 600);
					$("#main").click(function(){
						if (maintime && nickset) {
							$("#changenick").fadeOut();
							document.getElementById(\'input\').focus();
							maintime = 0;
						}
					});
				}			

				function logout() {
					$.ajax( { url : "index.php",
						type: "POST",
						async: false,
						data: "logout='.$name.'",
					});
					window.location = "'.$install.'"
				}
				
				$(document).ajaxError(function(){
					if (!errored) {
						errordisplay("you have been disconnected.");
					}
				});

				changenick();
			</script>');
		}
	?>
	<?php
		if (isset($_GET['c'])) {
			if (preg_match('/^([a-z]|_|[0-9])+$/', $_GET['c'])) {
				if (strlen($_GET['c']) <= 32) {
					chat($_GET['c']);
				}
				else {
					welcome('chat name too large');
				}
			}
			else {
				welcome('letters and numbers only');
			}
		}
		else if (isset($_POST['logout']) && preg_match('/^([a-z]|_|[0-9])+$/', $_POST['logout'])) {
				session_name($_POST['logout']);
				session_start();
				$chat = file($data.$_POST['logout']);
				getpeople($chat);
				if ($nick && $mysession) {
					$chat[1] = preg_replace('/'.$mysession.'\:'.$nick.'\+\d+\-/', '', $chat[1]);
					$chat[count($chat)+1] = "\n".'< '.$nick.' leaves '.$_POST['logout'];
					if ($chat[1] == "\n") {
						$chat[0] = "\n";
					}
					file_put_contents($data.$_POST['logout'], implode('', $chat), LOCK_EX);
					session_unset();
					session_destroy();
				}
				welcome('type your chatroom name');
		}
		else {
				welcome('type your chatroom name');
		}
	?>
</body> 
</html>
