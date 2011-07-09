<?php
	/* cryptocat 0.2 */
	$install = 'https://crypto.cat/';
	$data = '/srv/data/';
	$timelimit = 1800;
	$update = 2000;
	$nicks = array('bunny', 'kitty', 'pony', 'puppy', 'squirrel', 'sparrow', 'kiwi', 'fox', 'owl', 'raccoon', 'mongoose', 'koala', 'teddy', 'mouse', 'turtle', 'seal', 'dolphin', 'hedgehog', 'echidna', 'panther', 'cub');
	$maxusers = count($nicks);
	$maxinput = 256;
	$usednicks = array();
	$usedips = array();
?>
<?php
	function gen($size) {
		for ($i=0; $i<$size; $i++) {
			$c=mt_rand(1,3);
			if ($c==1) { $gen .= chr(mt_rand(65,90)); }
			else if ($c==2) { $gen .= chr(mt_rand(48,57)); }
			else if ($c==3) { $gen .= chr(mt_rand(97,122)); }
		}
		return $gen;
	}
	function getpeople($chat) {
		global $nick, $myip, $mypos, $usednicks, $usedips;
		preg_match_all('/\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}:\w+\+\d+-/', $chat[1], $people);
		$people = $people[0];
		for ($i = 0; $i < count($people); $i++) {
			preg_match('/.+:/', $people[$i], $ip);
			$ip = substr($ip[0], 0, -1);
			preg_match('/:.+\+/', $people[$i], $existingnick);
			$existingnick = substr($existingnick[0], 1, -1);
			preg_match('/\+.+\-/', $people[$i], $pos);
			$pos = substr($pos[0], 1, -1);
			if ($ip == $_SERVER['REMOTE_ADDR']) {
				$nick = $existingnick;
				$myip = $ip;
				$mypos = $pos;
			}
			else {
				array_push($usedips, $ip);
				array_push($usednicks, $existingnick);
			}
		}
	}	
	if (isset($_GET['redirect'])) {
		header('Location: '.$_GET['redirect']);
	}
	else if (isset($_GET['chat']) && $_SERVER['HTTP_REFERER'] == $install."?c=".$_GET['chat'] && preg_match('/^([a-z]|_|[0-9])+$/', $_GET['chat'])) {
		$chat = file($data.$_GET['chat']);
		getpeople($chat);
		if (!$chat) {
			print('chat no longer exists');
		}
		else if (isset($_GET['pos']) && (($_GET['pos'] < (count($chat) - $mypos)) || ($_GET['pos'] == "chat")) && $_GET['pos'] >= 0) {
			for ($i = $mypos; $i < count($chat); $i++) {
				if (preg_match('/CRYPTOCAT/i', $chat[$i])) {
					print(htmlspecialchars($chat[$i]));
				}
			}
		}
		exit;
	}
	else if (isset($_POST['name']) && preg_match('/^([a-z]|_|[0-9])+$/', $_POST['name']) && isset($_POST['input']) && $_POST['input'] != '' && strlen($_POST['input']) <= $maxinput*2.5 + 68) {
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
		$chat = file($data.$_GET['chatters']);
		getpeople($chat);
		$total = count($usednicks) + 1;
		print('<span class="chatters">'.$total.'</span> '.htmlspecialchars($nick.' '.implode(' ', $usednicks)));
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
	<style type="text/css">
		body {
			background-color: #c7e5f5;
			margin: 0 auto;
			font-family: "Arial", "Helvetica", "Courier New", "Courier";
			font-size: 11px;
			color: #FFF;
			padding: 0 12px 5px 12px;
			background-image: url("img/bg.png");
		}
		div.main {
			border: 10px solid #000;
			background-color: #FFF;
			padding: 10px 10px 50px 10px;
			width: 600px;
			height: 420px;
			color: #000;
			box-shadow: 5px 5px #76BDE5;
			margin: 4.5% auto 0 auto;
		}
		p.bottom {
			margin: 58px 0px 50px -10px;
			width: 610px;
			background-color: #000;
			padding: 3px 5px 0px 5px;
			text-align: center;
			color: #fff;
			font-weight: bold;
		}
		input.name, input.create {
			width: 330px;
			margin: 0 auto;
			background-color: #000;
			border: none;
			display: block;
			padding: 7px;
			color: #fff;
			outline: none;
			text-align: center;
			resize: none;
			font-size: 24px;
			box-shadow: 2px 2px #90CAEA;
		}
		input.create {
			width: 344px;
			margin-top: 10px;
			padding: 0px 7px;
		}
		input.talk {
			background-color: #000;
			padding: 7px 11px 5px 10px;
			border: none;
			margin: -14px 0px 0px 2px;
			float: left;
			padding: 3px;
			width: 67px;
			color: #97CEEC;
			height: 51px;
			font-size: 22px;
			box-shadow: 2px 2px #90CAEA;
		}
		input.create:hover, input.talk:hover {
			background-color: #97CEEC;
			box-shadow: 2px 2px #000;
			color: #FFF;
		}
		input.create:active, input.talk:active {
			box-shadow: 2px 2px #97CEEC;
		}
		div.chat {
			padding: 5px 5px 20px 0px;
			width: 567px;
			height: 295px;
			border: 3px solid #97CEEC;
			margin: 0 auto;
			overflow-x: hidden;
			overflow-y: scroll;
			word-wrap: break-word;
			font-family: 'Courier New', 'Courier';
			line-height: 17px;
			font-size: 12px;
			margin-top: 20px;
		}
		#chatters {
			background-color: rgba(151, 206, 236, 0.65);
			font-size: 10px;
			padding: 3px 3px 3px 0px;
			width: 555px;
			margin: -20px 0px 0px 11px;
			word-spacing: 5px;
		}
		span.chatters {
			padding: 3px 2px;
			background-color: #000;
			color: #FFF;
		}
		div.info {
			font-family: 'Verdana', 'Arial';
			font-size: 10px;
			color: #FFF;
			background-color: #000;
			padding: 2px 10px;
			width: 560px;
			margin: 0 auto;
			margin-top: 10px;
		}
		a {
			text-decoration: none;
			color: #97CEEC;
		}
		a:hover {
			text-decoration: underline;
		}
		a.logout {
			float: right;
			margin: 1px 2px 0 0;
		}
		div.chat a {
			color: #000;
			border-bottom: 1px dashed #000;
		}
		div.chat a:hover {
			border-bottom: 1px solid #000;
			text-decoration: none;
		}
		input.logout:hover {
			text-decoration: underline;
		}
		a.logout:hover, input.create:hover, input.talk:hover {
			cursor: pointer;
		}
		input.input {
			margin: 0px 0px 0px 10px;
			background-color: #000;
			color: #FFF;
			padding: 5px 10px;
			width: 490px;
			border: none;
			float: left;
			height: 28px;
			outline: none;
			resize: none;
			word-wrap: break-word;
			font-family: 'Courier New', 'Courier';
			line-height: 17px;
			font-size: 12px;
		}
		input.input:active {
			border: none;
		}
		input.invisible, div.invisible, img.invisible {
			display: none;
		}
		#url {
			font-size: 10px;
			background-color: #000;
			border: none;
			width: 260px;
			color: #97CEEC;
		}
		input.key {
			background-color: #97CEEC;
			color: #000;
			font-family: 'Verdana', 'Arial';
			font-size: 10px;
			padding: 2px 10px;
			width: 490px;
			margin-left: 10px;
			outline: none;
			resize: none;
			border: none;
		}
		div.msg, div.gsm, div.emsg, div.egsm, div.cmsg, div.cgsm, div.umsg, div.ugsm {
			padding: 10px 10px 10px 5px;
			background-color: #D8EDF8;
			width: 540px;
			word-wrap: break-word;
			background-repeat: no-repeat;
			background-image: url("img/unlock.png");
			background-position: 98%;
		}
		div.gsm {
			background-color: #FFF;
		}
		div.emsg {
			background-image: url("img/lock.png");
		}
		div.egsm {
			background-color: #FFF;
			background-image: url("img/lock.png");
		}
		div.cmsg {
			background-image: url("img/corrupt.png");
		}
		div.cgsm {
			background-image: url("img/corrupt.png");
			background-color: #FFF;
		}
		div.umsg {
			background-image: url("img/user.png");
		}
		div.ugsm {
			background-image: url("img/user.png");
			background-color: #FFF;
		}
		span.nick {
			background-color: #000;
			color: #FFF;
			padding: 2px;
			box-shadow: 2px 2px #90CAEA;
		}
		img.cryptocat {
			margin-bottom: 90px;
		}
		span.diffkey {
			border-bottom: 1px dashed #000;
		}
		div.text {
			max-width: 520px;
			margin: 0px 0px 0px 0px;
			padding: 0px 0px 0px 0px;
			word-wrap: break-word;
		}
		table {
			margin: 0 auto;
			display: block;
			margin-top: 50px;
			width: 550px;
		}
		td.img {
			padding-top: 2px;
			width: 40px;
		}
		td {
			border-bottom: 8px solid #FFF;
		}
		#seed {
			width: 100%;
			height: 100%;
			background-color: rgba(0, 0, 0, 0.6);
			position: absolute;
			top: 0;
			left: 0;
		}
		#seedinfo {
			font-family: Neuton, Georgia;
			font-style: italic;
			font-size: 22px;
			text-align: center;
			
		}
		#seedinfo2 {
			text-align: center;
			font-style: italic;
			font-size: 11px;
			font-family: Neuton, Georgia;
		}
		#mousebox {
			width: 620px;
			height: 480px;
			margin: 4.5% auto 0 auto;
			background-color: #000;
			border: 5px solid #c7e5f5;
			
		}
		#progress {
			font-size: 96px;
			text-align: center;
			color: #444;
			margin-top: 100px;
		}
		span.red {
			color: #DF93D6;
		}
		span.green {
			color: #93D8B9;
		}
	</style>
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
			print('<div class="main">
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
						<td id="td3">cryptocat is fully compatible with <a target="_blank" href="http://torproject.org">Tor</a> for anonymous chatting. couple cryptocat with Tor anonymization for maximum confidentiality.</td>
					</tr>
				</table>
				<p class="bottom" id="bottom">
					<a href="#" id="translate" onclick="translate()">català</a> | 
					<a href="about">about</a> | 
					cryptocat is beta software under active development | 
					<a target="_blank" href="http://twitter.com/cryptocatapp">twitter</a> | 
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
						document.getElementById("td3").innerHTML = \'cryptocat és totalment compatible amb <a target="_blank" href="http://torproject.org">Tor</a> per anònima al xat. utilitzeu cryptocat amb Tor de forma anònima la màxima confidencialitat.\';
						document.getElementById("bottom").innerHTML = \'<a href="#" id="translate" onclick="translate()">english</a> | <a href="about">sobre</a> | cryptocat és el programari beta en el desenvolupament actiu | <a target="_blank" href="http://twitter.com/cryptocatapp">twitter</a> | <a target="_blank" href="https://github.com/kaepora/cryptocat/">github</a>\';
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
		function createchat($name) {
			global $data, $nicks;
			$name = strtolower($name);
			$nick = $nicks[mt_rand(0, count($nicks) - 1)];
			$chat = array(0 => gen(18), 1 => $_SERVER['REMOTE_ADDR'].':'.$nick.'+2-');
			array_push($chat, '> '.$nick.' has entered cryptocat');
			file_put_contents($data.$name, implode("\n", $chat), LOCK_EX);
			return 1;
		}
		function joinchat($name) {
			global $data, $nicks, $maxusers, $nick, $myip, $mypos, $usednicks, $usedips;
			$name = strtolower($name);
			$chat = file($data.$name);
			$pos = count($chat);
			getpeople($chat);
			if (count($usedips) >= $maxusers) {
				welcome('chat is full');
			}
			else {
				if (!isset($nick)) {
					$nick = $nicks[mt_rand(0, count($nicks) - 1)];
					while (in_array($nick, $usednicks)) {
						$nick = $nicks[mt_rand(0, count($nicks) - 1)];
					}
					$chat[1] = trim($chat[1]).$_SERVER['REMOTE_ADDR'].':'.$nick.'+'.$pos.'-'."\n";
					$chat[count($chat)+1] = "\n".'> '.$nick.' has entered cryptocat';
					file_put_contents($data.$name, implode('', $chat), LOCK_EX);
				}
				chat($name, $nick);
			}
		}
		function chat($name, $nick) {
			global $data, $timelimit, $maxinput, $install, $update;
			$name = strtolower($name);
			$chat = file($data.$name);
			print('<div id="seed"><div id="mousebox"><p id="seedinfo">Please move your mouse around in this box for a bit.</p><p id="seedinfo2">(This will make your chat more secure.)</p><div id="progress">0%</div></div></div>
			<div class="main">
			<img src="img/cryptocat.png" alt="cryptocat" />
			<input type="text" value="'.$name.'" name="name" id="name" class="invisible" />
			<div class="invisible" id="loader"></div>
			<div class="chat" id="chat"></div>
			<div id="chatters"></div>');
			print('<div class="info">chatting as <a href="#" id="nick">'.$nick.'</a> on 
			<input readonly type="text" id="url" onclick="StuffSelect(\'url\');" value="'.$install.'?c='.$name.'" />
			<span id="strength"></span>
			<a class="logout" href="'.$install.'?logout='.$name.'">log out</a></div>
			<input type="text" id="key" value="type a key here for encrypted chat. all chatters must use the same key." class="key" maxlength="192" onclick="StuffSelect(\'key\');" onkeyup="keytime();" autocomplete="off" />
			<form name="chatform" id="chatform" method="post" action="'.$install.'">
			<input type="text" class="input" name="input" id="input" maxlength="'.$maxinput.'" 
			onkeydown="textcounter(document.chatform.input,document.chatform.talk,'.$maxinput.')" 
			onkeyup="textcounter(document.chatform.input,document.chatform.talk,'.$maxinput.')" autocomplete="off" />
			<input type="submit" name="talk" class="talk" id="talk" onmouseover="curcount = this.value; this.value=\'send\';" onmouseout="this.value=curcount;" value="'.$maxinput.'" />
			</form></div>');
			print('<script type="text/javascript">
				var seed = 1;
				var ultimate = Math.floor(Math.random() * 10);
				jQuery(document).ready(function(){
					$("#mousebox").mousemove(function(e){
					seed += e.pageX * e.pageY;
					if (seed.toString(10).length >= 7) {
						ultimate += seed.toString(36);
						seed = 1;
						var progress = Math.floor((ultimate.length * 100) / 64);
						if (progress <= 100) {
							$("#progress").html(progress + "%");
						}
						else {
							$("#progress").html("100%");
						}
					}
					if (ultimate.length >= 64) {
						Math.seedrandom(ultimate);
						$("#seed").fadeOut("slow");
					}
				}); 
			})
			</script>');
			print('<script type="text/javascript">
				var salt;
				var key;
				var curcount;
				var t = setTimeout("updatekey()", 1000);
				var changemon = document.getElementById("loader").innerHTML;
				var nick = document.getElementById("nick").innerHTML;
				var focus = true;
				var num = 0;
				var pos = 0;
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
				
				function logout() {
					$.ajax( { url : "index.php",
						type : "GET",
						data : "logout='.$name.'",
					});
				}
				
				updatechat("#loader");
				setInterval("updatechat(\"#loader\")", '.$update.');
			</script>');
		}
	?>
	<?php
		if (isset($_GET['c'])) {
			if (preg_match('/^([a-z]|_|[0-9])+$/', $_GET['c'])) {
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
		else if (isset($_GET['logout'])) {
				$chat = file($data.$_GET['logout']);
				getpeople($chat);
				if ($nick && $myip) {
					$chat[1] = preg_replace('/'.$myip.'\:'.$nick.'\+\d+\-/', '', $chat[1]);
					$chat[count($chat)+1] = "\n".'< '.$nick.' has left cryptocat';
					file_put_contents($data.$_GET['logout'], implode('', $chat), LOCK_EX);
				}
				welcome('type in your chatroom name');
		}
		else {
				welcome('type in your chatroom name');
		}
	?>
</body> 
</html>
