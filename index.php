<?php
	/* cryptocat */
	$install = 'https://crypto.cat/';
	$domain = "crypto.cat";
	$https = TRUE;
	$data = '/srv/data/';
	$timelimit = 1800;
	$update = 1500;
	$nicks = array('bunny', 'kitty', 'pony', 'puppy', 'squirrel', 'sparrow', 'kiwi', 'fox', 'owl', 'raccoon', 'mongoose', 'koala', 'teddy', 'mouse', 'turtle', 'seal', 'dolphin', 'hedgehog', 'echidna', 'panther', 'lemur', 'duck', 'panda');
	$maxusers = count($nicks);
	$maxinput = 256;
	$usednicks = array();
	$usedsessions = array();
	session_set_cookie_params(0, '/', $domain, $https, TRUE);
	error_reporting(0);
?>
<?php
	date_default_timezone_set("UTC");
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
			if (isset($_SESSION['id']) && $session == $_SESSION['id']) {
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
	if (isset($_GET['c']) && $_GET['c'] == "nyan") { header('Location: http://nyan.cat'); }
	else if (isset($_GET['redirect']) && preg_match('/((mailto\:|(news|(ht|f)tp(s?))\:\/\/){1}\S+)/i', $_GET['redirect'])) {
		print('<html><head><title>cryptocat</title><link rel="stylesheet" href="css/style.css" type="text/css" /></head>
		<body><div class="redirect"><img src="img/cryptocat.png" alt="" />You are leaving cryptocat to visit: <p><a href="'.htmlspecialchars($_GET['redirect']).'">'.htmlspecialchars($_GET['redirect']).'</a></p>Click the link to continue.</div>');
		exit;
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
			if (isset($_SESSION['id']) && $mysession == $_SESSION['id'] && !is_null($_SESSION['id'])) {
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
		if ($_POST['input'] != "" && $nick == $thisnick) {
			$_POST['input'] = date("Hi").trim($_POST['input']);
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
		if (isset($_SESSION['id']) && $mysession == $_SESSION['id'] && !is_null($_SESSION['id'])) {
			print('<span class="chatters">'.$total.'</span> '.htmlspecialchars($nick.' '.implode(' ', $usednicks)));
		}
		exit;
	}
	else if (isset($_POST['nick']) && preg_match('/^([a-z])+$/', $_POST['nick']) && strlen($_POST['nick']) <= 12 && isset($_POST['name']) && preg_match('/^([a-z]|_|[0-9])+$/', $_POST['name'])) {
		session_name($_POST['name']);
		session_start();
		$chat = file($data.$_POST['name']);
		if (file_exists($data.$_POST['name'])) {
			getpeople($chat);
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
		else if (in_array($_POST['nick'], $usednicks)) {
			print('error');
			exit;
		}
		else if ($nick) {
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
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.1//EN" "http://www.w3.org/TR/xhtml11/DTD/xhtml11.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xml:lang="en">
<head>
	<meta http-equiv="Content-Type" content="application/xhtml+xml; charset=UTF-8" />
	<title>cryptocat</title>
	<link rel="stylesheet" href="css/style.css" type="text/css" />
	<link rel="icon" type="image/png" href="img/favicon.gif" />
	<script type="text/javascript" src="js/jquery.js"></script>
	<script type="text/javascript" src="js/color.js"></script>
	<!-- cryptocat uses the crypto-js library - http://code.google.com/p/crypto-js/ -->
	<!-- http://crypto-js.googlecode.com/files/2.4.0-crypto-sha1-hmac-pbkdf2-blockmodes-aes.js -->
	<script type="text/javascript" src="js/crypto.js"></script>
	<script type="text/javascript" src="js/seedrandom.js"></script>
	<script type="text/javascript">function StuffSelect(id) {document.getElementById(id).focus();document.getElementById(id).select();} $(document).ready(function() { $("#name,#nickinput,#key,#input").attr("autocomplete", "off"); });</script>
</head>
<?php
if (isset($_GET['c']) && preg_match('/^([a-z]|_|[0-9])+$/', $_GET['c'])) {
	print('<body onunload="logout();">'."\n");
}
else {
	print('<body onload="document.getElementById(\'name\').focus();">'."\n");
}
?>
<div><a href="https://crypto.cat/fundraiser/"><img style="position: absolute; top: 0; right: 0; border: 0;" src="https://crypto.cat/fundraiser/fundraiser.png" alt="Fundraiser!" /></a></div>
	<?php
		function welcome($name) {
			global $install;
			print('<div id="main">
				<img src="img/cryptocat.png" alt="cryptocat" class="cryptocat" />
				<form action="'.$install.'" method="get" class="create" id="welcome">
					<div>
						<input type="text" class="name" name="c" id="name" onclick="StuffSelect(\'name\');" value="'.$name.'" maxlength="32" />
						<input type="submit" class="create" value="enter" id="create" />
					</div>
					<p id="video">(for a safer experience, check out <a onclick="window.open(this.href,\'_blank\');return false;" href="https://chrome.google.com/webstore/detail/dlafegoljmjdfmhgoeojifolidmllaie">cryptocat verifier</a>.)</p>
				</form>
				<table>
					<tr>
						<td class="img"><img src="img/1.png" alt="" /></td>
						<td id="td1"><strong>cryptocat</strong> lets you set up encrypted, private chats for impromptu secure conversations. check out this <a href="https://crypto.cat/info">video</a> for tips on how to get started!</td>
					</tr>
					<tr>
						<td class="img"><img src="img/2.png" alt="" /></td>
						<td id="td2">messages are encrypted locally using AES-256 and are verified for integrity. conversations are securely wiped after 30 minutes of inactivity.</td>
					</tr>
					<tr>
						<td class="img"><img src="img/3.png" alt="" /></td>
						<td id="td3">cryptocat is fully compatible with <a onclick="window.open(this.href,\'_blank\');return false;" href="https://torproject.org">Tor</a> for anonymous chatting. couple cryptocat with Tor anonymization for maximum confidentiality.</td>
					</tr>
				</table>
				<p class="bottom" id="bottom">
					<a href="#" onclick="translate(\'catalan\')">català</a> | 
					<a href="#" onclick="translate(\'arabic\')">عربي</a> | 
					<a href="https://crypto.cat/about">about</a> | 
					<a onclick="window.open(this.href,\'_blank\');return false;" href="http://creativecommons.org/licenses/by-nc-sa/3.0/">license</a> | 
					<a onclick="window.open(this.href,\'_blank\');return false;" href="https://twitter.com/cryptocatapp">twitter</a> | 
					<a onclick="window.open(this.href,\'_blank\');return false;" href="https://github.com/kaepora/cryptocat/">github</a> |
					cryptocat is currently in beta
				</p>
			</div>
			<script type="text/javascript">var install = "'.$install.'";</script>
			<script type="text/javascript" src="js/welcome.js"></script>');
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
		function chat($name) {
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
						<div>
							<input type="text" name="nickinput" id="nickinput" value="'.$nick.'" maxlength="12" />
							<input type="submit" class="nicksubmit" value="chat" />
						</div>
					</form>
					<p class="small">(letters only, 12 characters max)</p>
				</div>
			</div>
			<a href="'.$install.'" onclick="logout();"><img src="img/cryptocat.png" alt="cryptocat" /></a>
			<img src="img/maximize.png" alt="maximize" id="maximize" title="expand" />
			<img src="img/nosound.png" alt="sound" id="sound" title="enable message notifications" />
			<img src="img/user.png" alt="change nick" id="nickicon" title="change nickname" />
			<input type="text" value="'.$name.'" name="name" id="name" class="invisible" />
			<div class="invisible" id="loader"></div>
			<div id="chat"></div>
			<div id="chatters"></div>
			<div id="info">chatting as <a href="#" id="nick">'.$nick.'</a> on 
			<input readonly="readonly" type="text" id="url" onclick="StuffSelect(\'url\');" value="'.$install.'?c='.$name.'" />
			<span id="strength">key strength: <span class="gray">+++++</span></span></div>
			<input type="text" id="key" value="type your secret passkey in this blue bar for encrypted chat. everyone must use the same key." class="key" maxlength="192" onclick="StuffSelect(\'key\');" onkeyup="keytime();" />
			<form name="chatform" id="chatform" method="post" action="'.$install.'">
				<div>
					<input type="text" name="input" id="input" maxlength="'.$maxinput.'" onkeydown="textcounter(document.chatform.input,document.chatform.talk,'.$maxinput.')" onkeyup="textcounter(document.chatform.input,document.chatform.talk,'.$maxinput.')" />
					<input type="submit" name="talk" id="talk" onmouseover="curcount = this.value; this.value=\'send\';" onmouseout="this.value=curcount;" value="'.$maxinput.'" />
				</div>
			</form>
			</div>
			<script type="text/javascript">var install = "'.$install.'";var update = "'.$update.'";var name = "'.$name.'";var maxinput = "'.$maxinput.'";</script>
			<script type="text/javascript" src="js/cat.js"></script>');
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
				welcome('name your chat');
		}
		else {
				welcome('name your chat');
		}
	?>
</body>
</html>