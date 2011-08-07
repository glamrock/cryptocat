<?php
	/* cryptocat */
	$install = 'https://crypto.cat/';
	$domain = "crypto.cat";
	$https = TRUE;
	$data = '/srv/data/';
	$timelimit = 1800;
	$update = 1500;
	$nicks = array('bunny', 'kitty', 'pony', 'puppy', 'squirrel', 'sparrow', 'kiwi', 'fox', 'owl', 'raccoon', 'mongoose', 'koala', 'teddy', 'mouse', 'turtle', 'seal', 'dolphin', 'hedgehog', 'echidna', 'panther', 'lemur', 'duck');
	$maxusers = count($nicks);
	$maxinput = 256;
	$usednicks = array();
	$usedsessions = array();
	session_set_cookie_params(0, '/', $domain, $https, TRUE); 
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
	if ($_GET['c'] == "nyan") { header('Location: http://nyan.cat'); }
	else if (isset($_GET['redirect'])) {
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
	else if (isset($_POST['nick']) && preg_match('/^([a-z])+$/', $_POST['nick']) && strlen($_POST['nick']) <= 12 && isset($_POST['name']) && preg_match('/^([a-z]|_|[0-9])+$/', $_POST['name'])) {
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
				<form action="'.$install.'" method="get" class="create" id="welcome">
					<input type="text" class="name" name="c" id="name" onclick="StuffSelect(\'name\');" value="'.$name.'" maxlength="32" autocomplete="off" />
					<input type="submit" class="create" value="enter" id="create" />
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
				var install = "'.$install.'";
				');
				include('js/welcome.js');
			print('</script>');
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
			array_push($chat, '> '.$setnick.' has arrived');
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
					$chat[1] = trim($chat[1]).$_SESSION['id'].':'.$nick.'+'.$pos.'-'."\n";
					$chat[count($chat)+1] = "\n".'> '.$nick.' has arrived';
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
			print('<div id="main">
			<div id="front">
				<div id="changenick">
					<p>enter your nickname</p>
					<form name="nickform" id="nickform" method="post" action="'.$install.'">
						<input type="text" name="nickinput" id="nickinput" value="'.$nick.'" autocomplete="off" maxlength="12" />
						<input type="submit" class="nicksubmit" value="chat" />
					</form>
					<p class="small">(letters only, 12 characters max)</p>
				</div>
			</div>
			<img src="img/cryptocat.png" alt="cryptocat" />
			<img src="img/maximize.png" alt="maximize" id="maximize" title="expand" />
			<img src="img/nosound.png" alt="sound" id="sound" title="enable message notifications" />
			<img src="img/user.png" alt="change nick" id="nickicon" title="change nickname" />
			<input type="text" value="'.$name.'" name="name" id="name" class="invisible" />
			<div class="invisible" id="loader"></div>
			<div id="chat"></div>
			<div id="chatters"></div>
			<div id="info">chatting as <a href="#" id="nick">'.$nick.'</a> on 
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
			</div>
			<script type="text/javascript">
				var install = "'.$install.'";
				var update = "'.$update.'";
				var name = "'.$name.'";
				var maxinput = "'.$maxinput.'";');
			include('js/cat.js');
			print('</script>');
		}
		
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
					$chat[count($chat)+1] = "\n".'< '.$nick.' has left';
					if ($chat[1] == "\n") {
						for ($i=0; $i<8; $i++) {
							$chat[0] = gen(18)."\n";
							file_put_contents($data.$_POST['logout'], implode('', $chat), LOCK_EX);
						}
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