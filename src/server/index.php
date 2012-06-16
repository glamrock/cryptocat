<?php
	/* Cryptocat, encrypted IM for the accessible web */
	/* Distributed under the GNU AFFERO GENERAL PUBLIC LICENSE Version 3, 19 November 2007 */
	/* Copyright (C) 2011, 2012  Nadim Kobeissi <nadim@nadim.cc>

	This program is free software: you can redistribute it and/or modify
	it under the terms of the GNU Affero General Public License as
	published by the Free Software Foundation, either version 3 of the
	License, or (at your option) any later version.

	This program is distributed in the hope that it will be useful,
	but WITHOUT ANY WARRANTY; without even the implied warranty of
	MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
	GNU Affero General Public License for more details.

	You should have received a copy of the GNU Affero General Public License
	along with this program. If not, see <http://www.gnu.org/licenses/>.

	The full license text is included in `LICENSE.txt`. */
	/* Important notes are included in the README.md file. */
	
	/* Vital configuration settings: */
	/* MIND THE TRAILING SLASHES! */
	
	/* Install directory and domain name. */
	$install = 'https://crypto.cat/';
	$domain = 'crypto.cat';
	/* HTTPS is highly recommended! Using Cryptocat without HTTPS */
	/* in a production environment is a recipe for disaster. */
	/* You are severely warned against deploying Cryptocat */
	/* without HTTPS, unless the deployment is occurring as */
	/* a Tor Hidden Service. */
	$https = TRUE;
	/* Chat storage directory. Needs to be writable by web server. */
	$data = '/srv/data/';
	/* Maximum users in a chat. Untested above 10. */
	$maxusers = 10;
	/* Maximum characters per line (soft limit.) */
	$maxinput = 256;
	/* Maximum encrypted file size in kilobytes (soft limit.) */
	/* Seems not to work above 700kb. */
	$filesize = 600;
	/* Time limit in seconds before overwriting chat. */
	$timelimit = 3600;
	/* Set to 0 to disable automatic URL linking. */
	$genurl = 1;
	/* Default nicknames: */
	$nicks = array('bunny', 'kitty', 'pony', 'puppy', 'squirrel', 'sparrow', 'turtle', 
	'kiwi', 'fox', 'owl', 'raccoon', 'koala', 'echidna', 'panther', 'sprite', 'ducky');
	/* Timeout rate. You probably shouldn't touch this. */
	$timeout = 80;
	
	/* Do _not_ touch anything below this line. */
?>
<?php
	if ($https && $_SERVER['HTTPS'] != 'on') {
		$redirect= 'https://'.$_SERVER['HTTP_HOST'].$_SERVER['REQUEST_URI'];
		header('Location:'.$redirect);
	}
	ignore_user_abort(false);
	ini_set('session.entropy_file', '/dev/urandom');
	ini_set('session.entropy_length', '1024');
	session_set_cookie_params(0, '/', $domain, $https, TRUE);
	error_reporting(0);
	$inforegex = '/(\>|\<)\s[a-z]{1,12}\shas\s(arrived|left)/';
	
	function getpeople($chat) {
		preg_match_all('/[a-z]{1,12}:/', $chat[0], $people);
		for ($i=0; $i < count($people[0]); $i++) {
			$people[0][$i] = substr($people[0][$i], 0, -1);
		}
		return $people[0];
	}
	
	function msgcheck($msg) {
		$msgarray = array();
		$msgregex = '/^[a-z]{1,12}\|\w{8}:\s\[:3\]((\w|\/|\+|\?|\(|\)|\=)*\|(\d|a|b|c|d|e|f){128})*\[:3\]$/';
		$msgbeg   = '/^[a-z]{1,12}\|\w{8}:\s\[:3\](\w|\/|\+|\?|\(|\)|\=)*$/';
		$msgmid   = '/^(\w|\/|\+|\?|\(|\)|\=)*$/';
		$msgend   = '/^(\w|\/|\+|\?|\(|\)|\=)*\|(\d|a|b|c|d|e|f){128}\[:3\]$/';
		if (strlen($msg) > 4096) {
			for ($i=0; (($i) < strlen($msg)); $i+=4096) {
				array_push($msgarray, substr($msg, $i, 4096));
			}
			for ($i=0; $i != (count($msgarray)); $i++) {
				if ($msgarray[$i]) {
					if ($i == 0) {
						if (!preg_match($msgbeg, $msgarray[$i])) {
							return 0;
						}
					}
					else if ($i != (count($msgarray)-1)) {
						if (!preg_match($msgmid, $msgarray[$i])) {
							return 0;
						}
					}
					else {
						if (!preg_match($msgend, $msgarray[$i])) {
							return 0;
						}
					}
				}
			}
			return 1;
		}
		else if (preg_match($msgregex, $msg)) {
				return 1;
		}
		return 0;
	}
	
	if (preg_match('/^[a-z]{1,12}$/', $_POST['nick']) && 
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
		if ($_POST['key'] == 'get') {
			if ($_SESSION['check'] == 'OK') {
				print(trim($chat[0]));
			}
			exit;
		}
		if (count(getpeople($chat)) >= $maxusers) {
			print('full');
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
			enterchat($_POST['name'], $_POST['nick'], $_POST['key']);
			if (!file_exists($data.$_POST['name'])) {
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
	else if ((intval($_POST['pos']) >= 0) && preg_match('/^\w+$/', $_POST['chat'])) {
		$_POST['chat'] = strtolower($_POST['chat']);
		session_name('s'.$_POST['chat']);
		session_start();
		if ($_SESSION['check'] == "OK") {
			$chat = file($data.$_POST['chat']);
			if (!$chat) {
				print('NOEXIST');
				exit;
			}
			else {
				$pos = $_SESSION['pos'] + intval($_POST['pos']);
				$sleepcounter = 0;
				while ($pos >= count($chat)) {
					if (function_exists('shmop_open') && ($sleepcounter % ($timeout / 4)) == 0) {
						$people = getpeople($chat);
						$shm_id = shmop_open(ftok($data.$_POST['chat'], 'c'), "c", 0600, 256);
						if (!shmop_read($shm_id, 0, shmop_size($shm_id))) {
							$last = array();
						}
						else {
							$last = unserialize(shmop_read($shm_id, 0, shmop_size($shm_id)));
							for ($p=0; $p != count($people); $p++) {
								if (isset($last[$people[$p]]) && ((time() - $timeout) > $last[$people[$p]])) {
									unset($last[$people[$p]]);
									logout($_POST['chat'], $people[$p], 1);
								}
							}
						}
						$last[$_SESSION['nick']] = time();
						shmop_write($shm_id, serialize($last), 0);
					}
					ob_implicit_flush(true);
					ob_end_flush();
					print(' ');
					if (connection_aborted()) {
						exit;
					}
					usleep(1000000);
					$sleepcounter += 1;
					$chat = file($data.$_POST['chat']);
				}
				if ($pos < count($chat)) {
					if (msgcheck($chat[$pos]) || preg_match($inforegex, $chat[$pos])) {
						preg_match_all('/\([a-z]{1,12}\)[^\(^\[]+/', $chat[$pos], $match);
						preg_match('/^[a-z]{1,12}\|/', $chat[$pos], $nick);
						$nick = substr($nick[0], 0, -1);
						if ($nick != $_SESSION['nick']) {
							$chat[$pos] = preg_replace('/^[a-z]{1,12}\|\w{8}/', $nick, $chat[$pos]);
							print(htmlspecialchars($chat[$pos]));
						}
						else if (preg_match('/\|\w{8}/', $chat[$pos], $sentid)) {
							print(substr($sentid[0], 1));
						}
					}
				}
			}
		}
		else {
			print('NOLOGIN');
		}
		exit;
	}
	else if (isset($_POST['name']) && preg_match('/^\w+$/', $_POST['name']) && (strlen($_POST['input']) > 6)) {
		$_POST['name'] = strtolower($_POST['name']);
		session_name('s'.$_POST['name']);
		session_start();
		$chat = file($data.$_POST['name']);
		preg_match('/^[a-z]{1,12}\|/', $_POST['input'], $thisnick);
		if ((msgcheck($_POST['input'])) && $_SESSION['nick'] == substr($thisnick[0], 0, -1)) {
			if (file_exists($data.$_POST['name'])) {
				file_put_contents($data.$_POST['name'], $_POST['input']."\n", FILE_APPEND | LOCK_EX);
			}
		}
		exit;
	}
?>
<!DOCTYPE html>
<head>
	<?php
		if (isset($_GET['c']) && preg_match('/^\w+$/', $_GET['c'])) {
			print('<meta name="robots" content="noindex, nofollow" />'."\n");
		}
	?>
	<meta charset="UTF-8" />
	<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0;" />
	<meta name="apple-mobile-web-app-capable" content="yes" />
	<meta name="apple-mobile-web-app-status-bar-style" content="black" />
	<meta name="description" content="Cryptocat lets you instantly set up secure conversations. It's an open source encrypted, private alternative to other services such as Facebook chat." />
	<meta name="keywords" content="encrypted chat, private chat, secure chat, cryptocat" />
	<title>Cryptocat</title>
	<?php
		$mobile = 0;
		$agent = $_SERVER['HTTP_USER_AGENT'];
		$strmobile = array('iPhone', 'iPod', 'BlackBerry', 'Windows Phone', 
		'Fennec', 'Opera Mini', 'Opera Mobi', 'MeeGo');
		for ($i=0; $i != count($strmobile); $i++) {
			if (strstr($agent, $strmobile[$i]) || (strstr($agent, 'Android') && strstr($agent, 'Mobile'))) {
				$mobile = 1;
			}
		}
		if ($mobile) {
			print('<link rel="stylesheet" href="css/mobile.css" type="text/css" />'."\n");
		}
		else {
			print('<link rel="stylesheet" href="css/style.css" type="text/css" />'."\n");
		}
		if (isset($_GET['redirect']) && preg_match('/((mailto\:|(news|(ht|f)tp(s?))\:\/\/){1}\S+)/i', $_GET['redirect'])) {
			print('</head>
			<body><div class="redirect"><img src="img/cryptocat.png" alt="" />
			You are leaving Cryptocat to visit: <p>
			<a href="'.htmlspecialchars($_GET['redirect']).'">'.htmlspecialchars($_GET['redirect']).'</a>
			</p>Click the link to continue.</div></body></html>');
			exit;
		}
		if (isset($_GET['close'])) {
			print('</head>
			<body><script type="text/javascript">window.open("", "_self", "");window.close();</script></body></html>');
			exit;
		}
	?>
	<link rel="icon" type="image/gif" href="img/favicon.gif" />
	<link rel="apple-touch-startup-image" type="image/png" href="img/isplash.png" />
	<link rel="apple-touch-icon" type="image/png" href="img/ios.png"/>
	<script type="text/javascript" src="js/jquery.js"></script>
	<script type="text/javascript" src="js/notification.js"></script>
	<script type="text/javascript" src="js/build.js"></script>
</head>
<?php
if (isset($_GET['c']) && preg_match('/^\w+$/', $_GET['c'])) {
	print('<body>'."\n");
}
else {
	print('<body onload="document.getElementById(\'c\').focus();">'."\n");
}
?>
	<?php
		function welcome($name) {
			global $install;
			print('<div id="main">
				<a href="https://project.crypto.cat"><img src="img/cryptocat.png" alt="cryptocat" class="cryptocat" /></a>
				<form action="'.$install.'" method="get" class="create" id="welcome">
					<div id="front" class="invisible">
						<div id="note">
							<div id="notetext">
								Cryptocat provides strong encryption, but does not replace a strong security culture alone. 
								Consider installing the <a href="https://chrome.google.com/webstore/detail/gonbigodpnfghidmnphnadhepmbabhij" target="_blank">Cryptocat app for Google Chrome</a> for extra security, and always think responsibly if you are in serious situations.
							</div>
							<input id="understand" type="button" value="I understand" />
						</div>
					</div>
					<div>
						<input type="text" class="name" name="c" id="c" value="'.$name.'" maxlength="32" autocomplete="off" />
						<div class="create">
							<input type="submit" class="create" value="enter" id="create" />
							<input type="button" class="create" value="?" id="random" />
						</div>
						<div style="text-align:center" id="intro">New to Cryptocat? Check out this <a href="#" id="video">cool video!</a></div>
					</div>
				</form>
				<table>
					<tr>
						<td class="img"><img src="img/1.png" alt="" /></td>
						<td id="td1"><strong>Cryptocat</strong> lets you instantly set up secure conversations. It\'s an open source encrypted, private alternative to other services such as Facebook chat.</td>
					</tr>
					<tr>
						<td class="img"><img src="img/2.png" alt="" /></td>
						<td id="td2">Messages are encrypted inside your own browser using AES-256. Encrypted data is securely wiped after one hour of inactivity.</td>
					</tr>
					<tr>
						<td class="img"><img src="img/3.png" alt="" /></td>
						<td id="td3">Cryptocat also runs as a <a target="_blank" href="https://torproject.org">Tor</a> hidden service (<a href="http://xdtfje3c46d2dnjd.onion">http://xdtfje3c46d2dnjd.onion</a>) and works on your iPhone, Android and BlackBerry.</td>
					</tr>
				</table>
				<div class="bottom">
					<span id="lang">
						<a href="#" id="en">en</a> 
						<a href="#" id="ca">ca</a> 
						<a href="#" id="de">de</a> 
						<a href="#" id="eu">eu</a> 
						<a href="#" id="fr">fr</a> 
						<a href="#" id="it">it</a> 
						<a href="#" id="pt">pt</a> 
						<a href="#" id="ru">ru</a> 
						<a href="#" id="sv">sv</a> 
						<a href="#" id="uk">uk</a> 
					</span>
					<div class="links">
						<a href="https://project.crypto.cat">the Cryptocat Project</a>
					</div>
				</div>
			</div>
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
					$_SESSION['check'] = 'OK';
					$chat[0] = trim($chat[0]).$nick.':'.$key."|\n";
					$chat[count($chat)] = '> '.$nick." has arrived\n";
					file_put_contents($data.$name, implode('', $chat), LOCK_EX);
					$_SESSION['pos'] = count(file($data.$name)) - 1;
				}
			}
		}
		function chat($name) {
			global $data, $nicks, $timelimit, $maxinput, $install, $_SESSION, $genurl, $filesize;
			$name = strtolower($name);
			$chat = file($data.$name);
			$nick = $nicks[mt_rand(0, count($nicks) - 1)];
			while (in_array($nick, getpeople($chat))) {
				$nick = $nicks[mt_rand(0, count($nicks) - 1)];
			}
			print('<div id="main">
			<div id="front">
				<div id="changenick">
					<div id="keygen" class="invisible">
						<img src="img/keygen.gif" alt="" /><br />
						<span id="keytext"></span>
					</div>
					<div id="nickentry" class="invisible">
						<p>Enter nickname</p>
						<form name="nickform" id="nickform" method="post" action="'.$install.'">
							<div>
								<input type="text" name="nickinput" id="nickinput" value="'.$nick.'" maxlength="12" autocomplete="off" />
								<input type="submit" class="nicksubmit" value="chat" />
							</div>
						</form>
					</div>
				</div>
				<div id="fadebox" class="invisible"></div>
			</div>
			<a href="'.$install.'"><img src="img/cryptocat.png" class="chat" alt="cryptocat" /></a>
			<img src="img/maximize.png" alt="maximize" id="maximize" title="Expand" />
			<img src="img/invite.png" alt="invite" id="invite" title="Invite friend" />
			<img src="img/nonotifications.png" alt="notifications" id="notifications" title="Desktop notifications off" />
			<img src="img/nosound.png" alt="sound" id="sound" title="Message sounds off" />
			<img src="img/filer.png" alt="file" id="file" title="Send encrypted file" />
			<div id="inchat"><div id="chat"></div></div>
			<div id="info">chatting as <span id="nick">'.$nick.'</span> on 
			<strong class="blue">'.$install.'?c=</strong><strong id="name">'.$name.'</strong>
			</div>
			<form name="chatform" id="chatform" method="post" action="'.$install.'">
				<div>
					<div id="users"></div>
					<input type="text" name="input" id="input" maxlength="'.$maxinput.'" autocomplete="off" />
					<input type="submit" name="talk" id="talk" value="'.$maxinput.'" />
				</div>
			</form>
			</div>
			<script type="text/javascript">var install="'.$install.'";var maxinput='.$maxinput.';var genurl='.$genurl.';var filesize='.$filesize.';</script>
			<script type="text/javascript" src="js/cat.js"></script>');
		}
		function logout($name, $nick, $ghost) {
			global $data, $chat, $_SESSION, $public;
			$name = strtolower($name);
			session_name('s'.$name);
			session_start();
			if ($_SESSION['check'] == "OK") {
				$chat = file($data.$name);
				preg_match('/'.$nick.'\:[^\|]+\|/', $chat[0], $public);
				$chat[0] = str_replace($public[0], '', $chat[0]);
				$chat[count($chat)+1] = '< '.$nick." has left\n";
				if (!$ghost) {
					session_unset();
					session_destroy();
				}
				if (file_exists($data.$name)) {
					file_put_contents($data.$name, implode('', $chat), LOCK_EX);
					if (function_exists('shmop_delete')) {
						shmop_delete(shmop_open(ftok($data.$name, 'c'), "c", 0600, 256));
					}
				}
			}
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
				session_name('s'.$_POST['logout']);
				session_start();
				logout($_POST['logout'], $_SESSION['nick'], 0);
				welcome('name your chat');
		}
		else {
				welcome('name your chat');
		}
	?>

</body>
</html>