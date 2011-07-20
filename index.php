<?php
	/* cryptocat 0.3 */
	$install = 'https://crypto.cat/';
	$domain = "crypto.cat";
	$data = '/srv/data/';
	$timelimit = 1800;
	$update = 1500;
	$nicks = array('bunny', 'kitty', 'pony', 'puppy', 'squirrel', 'sparrow', 'kiwi', 'fox', 'owl', 'raccoon', 'mongoose', 'koala', 'teddy', 'mouse', 'turtle', 'seal', 'dolphin', 'hedgehog', 'echidna', 'panther', 'cub');
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
			print('chat no longer exists');
		}
		else if (isset($_GET['pos']) && (($_GET['pos'] < (count($chat) - $mypos)) || ($_GET['pos'] == "chat")) && $_GET['pos'] >= 0) {
			if ($mysession == $_SESSION['id'] && !is_null($_SESSION['id'])) {
				for ($i = $mypos; $i < count($chat); $i++) {
					if (preg_match('/CRYPTOCAT/i', $chat[$i])) {
						print(htmlspecialchars($chat[$i]));
					}
				}
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
		print('<script>alert('.$nick.' '.$thisnick.');</script>');
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
	<link rel="icon" type="image/png" href="img/favicon.gif" />
	<script  type="text/javascript" src="js/jquery.js"></script>
	<!-- cryptocat uses the crypto-js library, included below, and available in its entirety at http://code.google.com/p/crypto-js/ -->
	<!-- exact file being used: http://crypto-js.googlecode.com/files/2.2.0-crypto-sha1-hmac-pbkdf2-ofb-aes.js -->
	<script type="text/javascript" src="js/crypto.js"></script>
	<script type="text/javascript" src="js/seedrandom.js"></script>
	<script type="text/javascript">
		function StuffSelect(id) {
			document.getElementById(id).focus();
			document.getElementById(id).select();
		}
	</script>
	<link rel="stylesheet" href="css/style.css" type="text/css" /> 
</head>
<?php
if (isset($_GET['c']) && preg_match('/^([a-z]|_|[0-9])+$/', $_GET['c'])) {
	print('<body onload="document.getElementById(\'input\').focus();" onbeforeunload="logout();">');
}
else {
	print('<body onload="document.getElementById(\'name\').focus();">');
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
				</form>
				<table>
					<tr>
						<td class="img"><img src="img/1.png" alt="" /></td>
						<td id="td1"><strong>cryptocat</strong> lets you set up encrypted, private chats for impromptu secure conversations. Check out this <a href="info">video</a> for tips on how to get started!</td>
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
				var td1 = document.getElementById("td1").innerHTML;
				var td2 = document.getElementById("td2").innerHTML;
				var td3 = document.getElementById("td3").innerHTML;
				var bottom = document.getElementById("bottom").innerHTML;
				var name = document.getElementById("name").value;
				var create = document.getElementById("create").value;
				var curlang = "english";
						
				function updateaction() {
					document.getElementById("name").value = document.getElementById("name").value.toLowerCase();
					document.getElementById("welcome").action = \''.$install.'\'+\'?c=\'+document.getElementById("name").value.toLowerCase();
				}
						
				function translate() {
					if (curlang == "english") {
						document.getElementById("td1").innerHTML = "<strong>cryptocat</strong> li permet establir xats encriptada, privada de improvisada converses segures. Fes una ullada a aquest <a href=\"info\">vídeo</a> per obtenir consells sobre com començar!";
						document.getElementById("td2").innerHTML = "els seus missatges són encriptades abans de sortir del seu ordinador usant un algoritme AES-256 i es verifiquen la integritat. totes les converses estan ben esborrat després de 30 minuts d\'inactivitat.";
						document.getElementById("td3").innerHTML = \'cryptocat és totalment compatible amb <a target="_blank" href="https://torproject.org">Tor</a> per anònima al xat. utilitzeu cryptocat amb Tor de forma anònima la màxima confidencialitat.\';
						document.getElementById("bottom").innerHTML = \'<a href="#" id="translate" onclick="translate()">english</a> | <a href="about">sobre</a> | cryptocat és el programari beta en el desenvolupament actiu | <a target="_blank" href="https://twitter.com/cryptocatapp">twitter</a> | <a target="_blank" href="https://github.com/kaepora/cryptocat/">github</a>\';
						document.getElementById("name").value = "escrigui el seu nom de xat";
						document.getElementById("create").value = "entrar";
						curlang = "catalan";
					}
					else if (curlang == "catalan") {
						document.getElementById("td1").innerHTML = td1;
						document.getElementById("td2").innerHTML = td2;
						document.getElementById("td3").innerHTML = td3;
						document.getElementById("bottom").innerHTML = bottom;
						document.getElementById("name").value = name;
						document.getElementById("create").value = create;
						curlang = "english";
					}
				}
			</script>');
		}
		function is_bot(){
			$botlist = array("Teoma", "alexa", "froogle", "Gigabot", "inktomi",
			"looksmart", "URL_Spider_SQL", "Firefly", "NationalDirectory",
			"Ask Jeeves", "TECNOSEEK", "InfoSeek", "WebFindBot", "girafabot",
			"crawler", "www.galaxy.com", "Google", "Scooter", "Slurp",
			"msnbot", "appie", "FAST", "WebBug", "Spade", "ZyBorg", "rabaz",
			"Baiduspider", "Feedfetcher-Google", "TechnoratiSnoop", "Rankivabot",
			"Mediapartners-Google", "Sogou web spider", "WebAlta Crawler","TweetmemeBot",
			"Butterfly","Twitturls","Me.dium","Twiceler","Scribd", "Facebook", "Twitter", 
			"facebook", "twitter", "LinkedIn", "bot", "Bot", "BOT", "StatusNet",
			"Summify", "LongURL", "Java");
			foreach($botlist as $bot){
				if(strpos($_SERVER['HTTP_USER_AGENT'],$bot)!==false)
				return true;
			}
		 
			return false;
		}
		function createchat($name) {
			global $data, $nicks, $_SESSION;
			session_name($name);
			session_start();
			if (!isset($_SESSION['id'])) {
				$_SESSION['id'] = gen(32);
			}
			$name = strtolower($name);
			$nick = $nicks[mt_rand(0, count($nicks) - 1)];
			$chat = array(0 => gen(18), 1 => $_SESSION['id'].':'.$nick.'+2-');
			array_push($chat, '> '.$nick.' has entered cryptocat');
			file_put_contents($data.$name, implode("\n", $chat), LOCK_EX);
			return 1;
		}
		function joinchat($name) {
			global $data, $nicks, $maxusers, $nick, $mysession, $mypos, $usednicks, $usedsessions, $_SESSION;
			session_name($name);
			session_start();
			if (!isset($_SESSION['id'])) {
				$_SESSION['id'] = gen(32);
			}
			$name = strtolower($name);
			$chat = file($data.$name);
			$pos = count($chat);
			getpeople($chat);
			if (count($usedsessions) >= $maxusers) {
				welcome('chat is full');
			}
			else {
				if (!isset($nick)) {
					$nick = $nicks[mt_rand(0, count($nicks) - 1)];
					while (in_array($nick, $usednicks)) {
						$nick = $nicks[mt_rand(0, count($nicks) - 1)];
					}
					$chat[1] = trim($chat[1]).$_SESSION['id'].':'.$nick.'+'.$pos.'-'."\n";
					$chat[count($chat)+1] = "\n".'> '.$nick.' has entered cryptocat';
					file_put_contents($data.$name, implode('', $chat), LOCK_EX);
				}
				chat($name, $nick);
			}
		}
		function chat($name, $nick) {
			global $data, $timelimit, $maxinput, $install, $update, $_SESSION, $mysession, $usedsessions;
			$name = strtolower($name);
			$chat = file($data.$name);
			print('<div id="main">
			<img src="img/cryptocat.png" alt="cryptocat" />
			<img src="img/maximize.png" alt="maximize" id="maximize" />
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
			</form></div>');
			print('<script type="text/javascript">
				Math.seedrandom();
				var salt;
				var key;
				var curcount;
				var t = setTimeout("updatekey()", 1000);
				var changemon = document.getElementById("loader").innerHTML;
				var nick = document.getElementById("nick").innerHTML;
				var focus = true;
				var num = 0;
				var pos = 0;
				var maximized = 0;
				var install = "'.$install.'"
				var match;
				var defaultsalt = getkey("'.trim($chat[0]).'" + document.getElementById("url").value, 5);
				var defaultkey = Crypto.PBKDF2(getkey(document.getElementById("url").value, 4), defaultsalt, 64, { iterations: 1000 });
				var defaultkeytext = document.getElementById("key").value;
				window.onblur = function() { focus = false; }
				window.onfocus = function() { focus = true; }
				document.onblur = window.onblur;
				document.focus = window.focus;
				
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
					if ((document.getElementById("key").value == "") || (document.getElementById("key").value == defaultkeytext)) {
						salt = defaultsalt;
						key = defaultkey;
						document.getElementById("strength").innerHTML = "";
					}
					else {
						salt = getkey("'.trim($chat[0]).'" + document.getElementById("key").value, 5);
						key = Crypto.PBKDF2(getkey(document.getElementById("key").value, 4), salt, 64, { iterations: 1000 });
						var strength = 0;
						if (document.getElementById("key").value.length >= 10) {
							strength = 10;
						}
						if (document.getElementById("key").value.length >= 16) {
							strength++;
						}
						if (document.getElementById("key").value.match(/[a-z]/)) {
							strength++;
						}
						if (document.getElementById("key").value.match(/[A-Z]/)) {
							strength++;
						}
						if (document.getElementById("key").value.match(/[0-9]/)) {
							strength++;
						}
						if (document.getElementById("key").value.match(/[^\d\w\s]/)) {
							strength++;
						}
						if (strength < 12) {
							document.getElementById("strength").innerHTML = "key strength: <span class=\"red\">weak</span>";
						}
						if (strength == 12) {
							document.getElementById("strength").innerHTML = "key strength: okay";
						}
						if (strength > 12) {
							document.getElementById("strength").innerHTML = "key strength: <span class=\"green\">good</span>";
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
						var already = 0;
						var encrypted = 0;
						var success = 0;
						var corrupted = 0;
						var user = 0;
						
						if (chat[i]) {
							if (match = chat[i].match(/\\[BEGIN\-HMAC\-:3\](.+?)\[END-HMAC-:3\]$/)) {
								for (o=0; o <= chat.length-1; o++) {
									if (chat[o]) {
										if (omatch = chat[o].match(/\\[BEGIN\-HMAC\-:3\](.+?)\[END-HMAC-:3\]$/)) {
											if ((match[0] == omatch[0]) && (o != i)) {
													delete chat[o];
											}
										}
									}
								}
							}
							
							if (match = chat[i].match(/\\[BEGIN\-HMAC\-:3\](.+?)\[END-HMAC-:3\]$/)) {
								var hmac = match[0].substring(15, match[0].length-13);
								chat[i] = chat[i].replace(/\[BEGIN-HMAC-:3](.+?)\[END-HMAC-:3]$/, "");
							}
							if (match = chat[i].match(/\[BEGIN-CRYPTOCAT-:3](.+?)\[END-CRYPTOCAT-:3]/)) {
								match = match[0].substring(20, match[0].length-18);
								ciphertext = match;
								try {
									match = Crypto.AES.decrypt(match, defaultkey);
									chat[i] = chat[i].replace(/\[BEGIN-CRYPTOCAT-:3](.+?)\[END-CRYPTOCAT-:3]/, match);
									if (match = chat[i].match(/\[MSG](.*)\[\/MSG]/)) {
										success = match[0];
									}
								}
								catch (INVALID_CHARACTER_ERR) {
								}
								if (!success) {
									try {
										match = Crypto.AES.decrypt(match, key);
										chat[i] = chat[i].replace(/\[BEGIN-CRYPTOCAT-:3](.+?)\[END-CRYPTOCAT-:3]/, match);
										if (key != defaultkey) {
											encrypted = 1;
										}
										if (match = chat[i].match(/\[MSG](.*)\[\/MSG]/)) {
											success = match[0];
										}
									}
									catch (INVALID_CHARACTER_ERR) {
										chat[i] = chat[i].replace(/\[BEGIN-CRYPTOCAT-:3](.+?)\[END-CRYPTOCAT-:3]/, "<span class=\"diffkey\">encrypted</span>");
										encrypted = 1;
									}
								}
								if ((success) && (hmac != Crypto.HMAC(Crypto.SHA1, ciphertext + success, getkey(ciphertext  + success, 4)))) {
									chat[i] = chat[i].replace(/\[MSG](.+?)\[\/MSG]/, "<span class=\"diffkey\">corrupted!</span>");
									corrupted = 1;
								}
								else if (success) {
									chat[i] = chat[i].replace(/\[MSG](.*)\[\/MSG]/, success.substring(5, success.length - 6));
									chat[i] = scrubtags(chat[i]);
								}
								if (match = chat[i].match(/((mailto\:|(news|(ht|f)tp(s?))\:\/\/){1}\S+)/gi)) {
									for (mc = 0; mc <= match.length - 1; mc++) {
										var sanitize = match[mc].split("");
										for (ii = 0; ii <= sanitize.length-1; ii++) {
											if (!sanitize[ii].match(/\w|\d|\:|\/|\?|\=|\#|\+|\,|\.|\&|\;/)) {
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
									if (!already) {
										match = match[0];
										chat[i] = chat[i].replace(/^[a-z]+:/, "<span class=\"nick\">" + match + "</span>");
									}
								}
							}
							else {
								if (match = chat[i].match(/^(\&gt\;|\&lt\;).+cryptocat$/)) {
									match = match[0];
									chat[i] = chat[i].replace(/^(\&gt\;|\&lt\;).+cryptocat$/, "<span class=\"nick\">" + match + "</span>");
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
							if ((!flip) && (document.getElementById("chat").innerHTML.split("\n").length % 2)) {
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
				
				function updatechat(div){
					var divold = 0;
					if (focus) {
						num = 0;
						document.title = "[" + num + "] cryptocat";
					}
					if (div == "#chat") {
						posold = pos;
						pos = "chat";
						divold = "#chat";
						div = "#loader";
					}
					$(div).load("index.php?chat='.$name.'&pos=" + pos, function() {
						if (((document.getElementById("loader").innerHTML != changemon) && (document.getElementById("loader").innerHTML != "")) || (divold == "#chat")) {
							pos = document.getElementById("loader").innerHTML.split("\n").length;
							document.getElementById("chat").innerHTML = processline(document.getElementById("loader").innerHTML, 1);
							document.getElementById("chat").scrollTop = document.getElementById("chat").scrollHeight;
							if (focus == false) {
								num++;
								document.title = "[" + num + "] cryptocat";
							}
							changemon = document.getElementById("loader").innerHTML;
							$("#chatters").load("index.php?chatters='.$name.'", function() {
							});
						}
					});
					if (divold == "#chat") {
						pos = posold;
					}
				}
				
				$("#chatform").submit( function() {
					var orig = document.getElementById("input").value;
					var msg = $.trim(document.getElementById("input").value);
					if (msg != "") {
						var msg = "[MSG]" + msg + "[/MSG]";
						var encoded = Crypto.AES.encrypt(msg, key);
						var hmac = Crypto.HMAC(Crypto.SHA1, encoded + msg, getkey(encoded + msg, 4));
						encoded = nick + ": " + "[BEGIN-CRYPTOCAT-:3]" + encoded + "[END-CRYPTOCAT-:3][BEGIN-HMAC-:3]" + hmac + "[END-HMAC-:3]";
						document.getElementById("chat").innerHTML += processline(encoded, 0);
						document.getElementById("input").value = "";
						document.getElementById("chat").scrollTop = document.getElementById("chat").scrollHeight;
					}
					else {
						encoded = "";
					}
					document.getElementById("input").value = "";
					document.getElementById("chat").scrollTop = document.getElementById("chat").scrollHeight;
					$.ajax( { url : "index.php",
						type : "POST",
						data : "input=" + encodeURIComponent(encoded) + "&name=" + $("#name").val() + "&talk=send",
						success : function(data) {
							document.getElementById("input").focus();
							document.getElementById("talk").value = "'.$maxinput.'";
							updatechat("#loader");
						},
						error : function(data) {
							document.getElementById("input").value = orig;
						}
					});
					return false;    
				});

				$("#maximize").click(function(){
					if (maximized) {
						$("#main").animate({
							"margin-top": "4.5%",
							width: "600px",
							height: "420px"
						}, 500 );
						$("#chat").animate({
							"margin-top": "20px",
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
						document.getElementById("maximize").src = "img/maximize.png";
						maximized = 0;
						setTimeout("document.getElementById(\'chat\').scrollTop = document.getElementById(\'chat\').scrollHeight;", 520);
					}
					else {
						$("#main").animate({
							"margin-top": "2%",
							width: "75%",
							height: "82%"
						}, 500 );
						$("#chat").animate({
							margin: "2px",
							"margin-top": "10px",
							width: "99%",
							height: "82%"
						}, 500 );
						$("#chatters").animate({
							width: "98.3%",
							"margin-left": "5px",
							"margin-top": "-22px"
						}, 500 );
						$("#info").animate({
							width: "96%",
							"margin-left": "3px"
						}, 500 );
						$("#key").animate({
							width: "90%",
							"margin-left": "3px"
						}, 500 );
						$("#input").animate({
							width: "90%",
							"margin-left": "3px"
						}, 500 );
						$("#talk").animate({
							width: "6%"
						}, 500 );
						document.getElementById("maximize").src = "img/minimize.png";
						maximized = 1;
						setTimeout("document.getElementById(\'chat\').scrollTop = document.getElementById(\'chat\').scrollHeight;", 520);
					}
				});

				
				function logout() {
					$.ajax( { url : "index.php",
						type : "POST",
						data : "logout='.$name.'",
					});
					window.location = "'.$install.'"
				}
				
				updatechat("#loader");
				setInterval("updatechat(\"#loader\")", '.$update.');
			</script>');
		}
	?>
	<?php
		if (isset($_GET['c'])) {
			if (preg_match('/^([a-z]|_|[0-9])+$/', $_GET['c']) && !is_bot()) {
				if (strlen($_GET['c']) <= 32) {
					if (file_exists($data.$name)) {
						if (time() - filemtime($data.$_GET['c']) > $timelimit) {
							unlink($data.$_GET['c']);
							createchat($_GET['c']);
						}
						joinchat($_GET['c']);
					}
					else {
						$create = createchat($_GET['c']);
						if ($create) {
							joinchat($_GET['c']);
						}
					}
				}
				else {
					welcome('chat name too large');
				}
			}
			else {
				welcome('letters and numbers only');
			}
		}
		else if (isset($_POST['logout'])) {
				session_name($_POST['logout']);
				session_start();
				$chat = file($data.$_POST['logout']);
				getpeople($chat);
				if ($nick && $mysession) {
					$chat[1] = preg_replace('/'.$mysession.'\:'.$nick.'\+\d+\-/', '', $chat[1]);
					$chat[count($chat)+1] = "\n".'< '.$nick.' has left cryptocat';
					file_put_contents($data.$_POST['logout'], implode('', $chat), LOCK_EX);
					session_unset();
					session_destroy();
				}
				welcome('type in your chatroom name');
		}
		else {
				welcome('type in your chatroom name');
		}
	?>
</body> 
</html>
