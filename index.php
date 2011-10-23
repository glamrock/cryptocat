<?php
	/* cryptocat */
	/* install directory and domain name */
	$install = 'https://crypto.cat/';
	$domain = "crypto.cat";
	/* https is highly recommended */
	$https = TRUE;
	/* where to store data */
	$data = '/srv/data/';
	/* time limit in seconds before deleting chat */
	$timelimit = 1800;
	/* set to 0 to disable automatic url linking */
	$genurl = 1;
	/* maximum users in a chat. untested above 8 */
	$maxusers = 8;
	/* default nicknames */
	$nicks = array('bunny', 'kitty', 'pony', 'puppy', 'squirrel', 'sparrow', 'kiwi', 'fox', 'owl', 'raccoon', 'koala', 'echidna', 'panther', 'sprite');
?>
<?php
	$maxinput = 256;
	$update = 1300;
	ini_set("session.entropy_file", "/dev/urandom");
	ini_set("session.entropy_length", "1024");
	error_reporting(0);
	session_set_cookie_params(0, '/', $domain, $https, TRUE);
	function getpeople($chat) {
		preg_match_all('/[a-z]{1,12}:/', $chat[0], $people);
		for ($i=0; $i < count($people[0]); $i++) {
			$people[0][$i] = substr($people[0][$i], 0, -1);
		}
		return $people[0];
	}
	if (isset($_GET['redirect']) && preg_match('/((mailto\:|(news|(ht|f)tp(s?))\:\/\/){1}\S+)/i', $_GET['redirect'])) {
		print('<html><head><title>cryptocat</title>
		<link rel="stylesheet" href="css/style.css" type="text/css" /></head>
		<body><div class="redirect"><img src="img/cryptocat.png" alt="" />
		You are leaving cryptocat to visit: <p>
		<a href="'.htmlspecialchars($_GET['redirect']).'">'.htmlspecialchars($_GET['redirect']).'</a>
		</p>Click the link to continue.</div></body></html>');
		exit;
	}
	else if (preg_match('/^[a-z]{1,12}$/', $_POST['nick']) && 
	strlen($_POST['nick']) <= 12 && 
	preg_match('/^\w+$/', $_POST['name']) && 
	preg_match('/^(\w|\/|\+|\?|\(|\)|\=)+$/', $_POST['key'])) {
		$_POST['name'] = strtolower($_POST['name']);
		session_name('s'.$_POST['name']);
		session_start();
		if (file_exists($data.$_POST['name'])) {
			$chat = file($data.$_POST['name']);
			if (time() - filemtime($data.$_POST['name']) > $timelimit) {
				unlink($data.$_POST['name']);
				enterchat($_POST['name'], $_POST['nick'], $_POST['key']);
				exit;
			}
		}
		if ($_POST['key'] == "get") {
			print(trim($chat[0]));
			exit;
		}
		if (count(getpeople($chat)) >= $maxusers) {
			print("full");
			exit;
		}
		else if (in_array($_POST['nick'], getpeople($chat))) {
			print('inuse');
			exit;
		}
		else if (isset($_SESSION['nick'])) {
			session_unset();
			session_destroy();
		}
		if (!isset($_SESSION['nick'])) {
			if (file_exists($data.$_POST['name'])) {
				enterchat($_POST['name'], $_POST['nick'], $_POST['key']);
			}
			else {
				enterchat($_POST['name'], $_POST['nick'], $_POST['key']);
				$chat = file($data.$_POST['name']);
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
	else if (isset($_POST['chat']) && preg_match('/^\w+$/', $_POST['chat'])) {
		$_POST['chat'] = strtolower($_POST['chat']);
		session_name('s'.$_POST['chat']);
		session_start();
		if ($_SESSION['check'] == "OK") {
			$chat = file($data.$_POST['chat']);
			if (!$chat) {
				print('NOEXIST');
			}
			else if (isset($_POST['pos']) && $_POST['pos'] >= 0) {
				$_POST['pos'] = $_POST['pos'] + ($_SESSION['pos'] - 1);
				if ($_POST['pos'] <= count($chat) - 1) {
					if (preg_match('/^[a-z]{1,12}\|\w{8}:\s\[B-C\](\w|\/|\+|\?|\(|\)|\=|\|)+\[E-C\]$/', $chat[$_POST['pos']])) {
						preg_match_all('/\([a-z]{1,12}\)[^\(^\[]+/', $chat[$_POST['pos']], $match);
						preg_match('/^[a-z]{1,12}\|/', $chat[$_POST['pos']], $nick);
						$nick = substr($nick[0], 0, -1);
						$ki = 0;
						for ($ki=0; $ki <= count($match[0]); $ki++) {
							if (substr($match[0][$ki], 1, strlen($_SESSION['nick'])) == $_SESSION['nick']) {
								$match = substr($match[0][$ki], strlen($_SESSION['nick']) + 2);
								$chat[$_POST['pos']] = preg_replace('/\[B-C\](.*)\[E-C\]/', '[B-C]'.$match.'[E-C]', $chat[$_POST['pos']]);
								$ki = count($match[0]) + 10;
							}
						}
					}
					if ($_SESSION['lastpos'] < $_POST['pos']) {
						if (!isset($nick) || ($nick != $_SESSION['nick'])) {
							$chat[$_POST['pos']] = preg_replace('/^[a-z]{1,12}\|\w{8}/', $nick, $chat[$_POST['pos']]);
							print(htmlspecialchars($chat[$_POST['pos']]));
						}
						else {
							preg_match('/\|\w{8}/', $chat[$_POST['pos']], $sentid);
							print(substr($sentid[0], 1));
						}
						$_SESSION['lastpos'] = $_POST['pos'];
					}
				}
			}
			else {
				print('NOLOGIN');
			}
		}
		exit;
	}
	else if (isset($_POST['name']) && preg_match('/^\w+$/', $_POST['name']) && isset($_POST['input']) && $_POST['input'] != '') {
		$_POST['name'] = strtolower($_POST['name']);
		session_name('s'.$_POST['name']);
		session_start();
		$chat = file($data.$_POST['name']);
		preg_match('/^[a-z]{1,12}\|/', $_POST['input'], $thisnick);
		$thisnick = substr($thisnick[0], 0, -1);
		if (preg_match('/^[a-z]{1,12}\|\w{8}:\s\[B-C\](\w|\/|\+|\?|\(|\)|\=|\|)+\[E-C\]$/', $_POST['input']) && $_SESSION['nick'] == $thisnick) {
			$chat = $_POST['input']."\n";
			file_put_contents($data.$_POST['name'], $chat, FILE_APPEND | LOCK_EX);
		}
		exit;
	}
?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.1//EN" "http://www.w3.org/TR/xhtml11/DTD/xhtml11.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xml:lang="en">
<head>
	<meta http-equiv="content-type" content="application/xhtml+xml; charset=UTF-8" />
	<meta name="viewport" content="width=device-width, user-scalable=no" />
	<meta name="description" content="Cryptocat lets you instantly set up secure conversations. It's an open source encrypted, private alternative to invasive services such as Facebook chat." />
	<meta name="keywords" content="encrypted chat, private chat, secure chat, cryptocat" />
	<title>cryptocat</title>
	<?php
		if (strstr($_SERVER['HTTP_USER_AGENT'], "iPod") || 
		strstr($_SERVER['HTTP_USER_AGENT'], "iPhone") || 
		strstr($_SERVER['HTTP_USER_AGENT'], "BlackBerry") || 
		strstr($_SERVER['HTTP_USER_AGENT'], "Android")) {
			print('<link rel="stylesheet" href="css/mobile.css" type="text/css" />'."\n");
		}
		else {
			print('<link rel="stylesheet" href="css/style.css" type="text/css" />'."\n");
		}
	?>
	<link rel="icon" type="image/png" href="img/favicon.gif" />
	<script type="text/javascript" src="js/jquery.js"></script>
	<script type="text/javascript" src="js/crypto.js"></script>
	<script type="text/javascript">$(document).ready(function() { $("#c,#nickinput,#key,#input").attr("autocomplete", "off"); });</script>
</head>
<?php
if (isset($_GET['c']) && preg_match('/^\w+$/', $_GET['c'])) {
	print('<body onunload="logout();">'."\n");
}
else {
	print('<body onload="document.getElementById(\'c\').focus();">'."\n");
}
?>
<div class="donate"><a href="https://crypto.cat/fundraiser/"><img style="position: absolute; top: 0; left: 0; border: 0;" src="https://crypto.cat/fundraiser/fundraiser.png" alt="Donate!" /></a></div>
	<?php
		function welcome($name) {
			global $install;
			print('<div id="main">
				<img src="img/cryptocat.png" alt="cryptocat" class="cryptocat" />
				<form action="'.$install.'" method="get" class="create" id="welcome">
					<div id="front">
						<div id="note">
						<span id="notetext">Cryptocat provides strongly encrypted, secure communications. However, it is not a replacement to GPG. Think responsibly if you are in extreme, life-threatening situations.</span>
						<br /><input id="understand" type="button" value="I understand." />
						</div>
					</div>
					<div>
						<input type="text" class="name" name="c" id="c" onclick="idSelect(\'c\');" value="'.$name.'" maxlength="32" />
						<input type="submit" class="create" value="enter" id="create" />
					</div>
					<p id="notice">(for a safer experience, check out <a onclick="window.open(this.href,\'_blank\');return false;" href="https://chrome.google.com/webstore/detail/dlafegoljmjdfmhgoeojifolidmllaie">cryptocat verifier</a>.)</p>
				</form>
				<table>
					<tr>
						<td class="img"><img src="img/1.png" alt="" /></td>
						<td id="td1"><strong>Cryptocat</strong> lets you instantly set up secure conversations. It\'s an open source encrypted, private alternative to invasive services such as Facebook chat.</td>
					</tr>
					<tr>
						<td class="img"><img src="img/2.png" alt="" /></td>
						<td id="td2">Messages are encrypted locally and are verified for integrity. Conversations are securely wiped after 30 minutes of inactivity.</td>
					</tr>
					<tr>
						<td class="img"><img src="img/3.png" alt="" /></td>
						<td id="td3">Cryptocat is fully compatible with <a onclick="window.open(this.href,\'_blank\');return false;" href="https://torproject.org">Tor</a> for anonymous chatting. Couple Cryptocat with Tor for maximum confidentiality.</td>
					</tr>
				</table>
				<p class="bottom" id="bottom">
					<a href="#" onclick="translate(\'catalan\')">català</a> | 
					<a href="https://crypto.cat/about">about</a> | 
					<a onclick="window.open(this.href,\'_blank\');return false;" href="https://chrome.google.com/webstore/detail/gonbigodpnfghidmnphnadhepmbabhij">chrome app</a> | 
					<a onclick="window.open(this.href,\'_blank\');return false;" href="https://twitter.com/cryptocatapp">twitter</a> | 
					<a onclick="window.open(this.href,\'_blank\');return false;" href="https://github.com/kaepora/cryptocat/">github</a>
				</p>
			</div>
			<script type="text/javascript">var install = "'.$install.'";</script>
			<script type="text/javascript" src="js/welcome.js"></script>');
		}
		function enterchat($name, $nick, $key) {
			global $data, $_SESSION;
			$name = strtolower($name);
			session_name('s'.$name);
			session_start();
			if (file_exists($data.$name)) {
				$chat = file($data.$name);
			}
			if (!isset($_SESSION['nick'])) {
				if (!is_null(getpeople($chat)) && in_array($nick, getpeople($chat))) {
					print("error");
					exit;
				}
				else {
					$_SESSION['nick'] = $nick;
					$_SESSION['check'] = "OK";
					$chat[0] = trim($chat[0]).$nick.':'.$key."|\n";
					$chat[count($chat)] = "> ".$nick." has arrived\n";
					file_put_contents($data.$name, implode('', $chat), LOCK_EX);
					$_SESSION['pos'] = count(file($data.$name));
				}
			}
		}
		function chat($name) {
			global $data, $nicks, $timelimit, $maxinput, $install, $update, $_SESSION, $genurl;
			$name = strtolower($name);
			$chat = file($data.$name);
			$nick = $nicks[mt_rand(0, count($nicks) - 1)];
			while (in_array($nick, getpeople($chat))) {
				$nick = $nicks[mt_rand(0, count($nicks) - 1)];
			}
			print('<div id="main">
			<div id="front">
				<div id="changenick">
					<div id="keygen">
						<img src="img/keygen.gif" alt="" /><br />
						<span id="keytext">Gathering entropy</span>
					</div>
					<div id="nickentry">
						<p>Enter nickname</p>
						<form name="nickform" id="nickform" method="post" action="'.$install.'">
							<div>
								<input type="text" name="nickinput" id="nickinput" value="'.$nick.'" maxlength="12" />
								<input type="submit" class="nicksubmit" value="chat" />
							</div>
						</form>
					</div>
				</div>
				<div id="fingerprints"></div>
			</div>
			<a href="'.$install.'" onclick="logout();"><img src="img/cryptocat.png" class="chat" alt="cryptocat" /></a>
			<img src="img/maximize.png" alt="maximize" id="maximize" title="expand" />
			<img src="img/nosound.png" alt="sound" id="sound" title="message sounds off" />
			<div id="inchat"><div id="chat"></div></div>
			<div id="info">chatting as <span id="nick">'.$nick.'</span> on 
			<strong class="blue">'.$install.'?c=</strong><strong id="name">'.$name.'</strong> - <span id="fingerlink">fingerprints</span>
			<strong id="flood">wait</strong>
			</div>
			<form name="chatform" id="chatform" method="post" action="'.$install.'">
				<div>
					<div id="chatters"></div>
					<input type="text" name="input" id="input" maxlength="'.$maxinput.'" />
					<input type="submit" name="talk" id="talk" value="'.$maxinput.'" />
				</div>
			</form>
			</div>
			<script type="text/javascript">var install="'.$install.'";var update="'.$update.'";var maxinput="'.$maxinput.'";var genurl='.$genurl.';</script>
			<script type="text/javascript" src="js/cat.js"></script>');
		}
		if (isset($_GET['c'])) {
			if (preg_match('/^\w+$/', $_GET['c'])) {
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
		else if (isset($_POST['logout']) && preg_match('/^\w+$/', $_POST['logout'])) {
				$_POST['logout'] = strtolower($_POST['logout']);
				session_name('s'.$_POST['logout']);
				session_start();
				$chat = file($data.$_POST['logout']);
				if ($_SESSION['nick'] && $_SESSION['check'] == "OK") {
					preg_match('/'.$_SESSION['nick'].'\:[^\|]+\|/', $chat[0], $public);
					$chat[0] = str_replace($public[0], '', $chat[0]);
					$chat[count($chat)+1] = "< ".$_SESSION['nick']." has left\n";
					session_unset();
					session_destroy();
					file_put_contents($data.$_POST['logout'], implode('', $chat), LOCK_EX);
				}
				welcome('name your chat');
		}
		else {
				welcome('name your chat');
		}
	?>
</body>
</html>