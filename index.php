<?php
	/* cryptocat */
	/* install directory and domain name */
	$install = 'https://crypto.cat/';
	$domain = "crypto.cat";
	/* https is highly recommended */
	$https = TRUE;
	/* where to store chats */
	$data = '/srv/data/';
	/* time limit in seconds before deleting chat */
	$timelimit = 1800;
	/* set to 0 to disable automatic url linking */
	$fancyurls = 1;
	/* maximum users in a chat. not recommended to set above 8 */
	$maxusers = 8;
	/* default nicknames */
	$nicks = array('bunny', 'kitty', 'pony', 'puppy', 'squirrel', 'sparrow', 'kiwi', 'fox', 'owl', 'raccoon', 'koala', 'echidna', 'panther');
	/* variables below this line are not safe to change */
?>
<?php
	$maxinput = 256;
	$update = 2750;
	error_reporting(0);
	$usednicks = array();
	$usedsessions = array();
	session_set_cookie_params(0, '/', $domain, $https, TRUE);
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
		$usednicks = array();
		$usedsessions = array();
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
	if (isset($_GET['redirect']) && preg_match('/((mailto\:|(news|(ht|f)tp(s?))\:\/\/){1}\S+)/i', $_GET['redirect'])) {
		print('<html><head><title>cryptocat</title><link rel="stylesheet" href="css/style.css" type="text/css" /></head>
		<body><div class="redirect"><img src="img/cryptocat.png" alt="" />You are leaving cryptocat to visit: <p><a href="'.htmlspecialchars($_GET['redirect']).'">'.htmlspecialchars($_GET['redirect']).'</a></p>Click the link to continue.</div></body></html>');
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
		else if (isset($_GET['pos']) && $_GET['pos'] >= 0) {
			$_GET['pos'] += $mypos;
			if (isset($_SESSION['id']) && $mysession == $_SESSION['id'] && !is_null($_SESSION['id'])) {
				if ($_GET['pos'] <= count($chat) - 1) {					
					if (preg_match('/^[a-z]{1,12}:\s\[B-C\].+\[E-C\]$/', $chat[$_GET['pos']])) {
						preg_match('/^[a-z]{1,12}:/', $chat[$_GET['pos']], $curnick);
						$curnick = substr($curnick[0], 0, -1);
						preg_match_all('/\([a-z]{1,12}\)[^\(|^\[]+/', $chat[$_GET['pos']], $match);
						$ki = 0;
						$chat[$_GET['pos']] = preg_replace('/\[B-C\](.*)\[E-C\]/', '[B-C][E-C]', $chat[$_GET['pos']]);
						for ($ki=0; $ki <= count($match[0]); $ki++) {
							if (substr($match[0][$ki], 1, strlen($nick)) == $nick) {
								$match = substr($match[0][$ki], strlen($nick) + 2);
								$chat[$_GET['pos']] = preg_replace('/\[B-C\](.*)\[E-C\]/', '[B-C]'.$match.'[E-C]', $chat[$_GET['pos']]);
								$ki = 9001;
							}
						}
					}
					if ($curnick != $nick) {
						print(htmlspecialchars($chat[$_GET['pos']]));
					}
					else {
						print("*");
					}
				}
			}
			else {
				print('NOLOGIN');
			}
		}
		exit;
	}
	else if (isset($_POST['name']) && preg_match('/^([a-z]|_|[0-9])+$/', $_POST['name']) && isset($_POST['input']) && $_POST['input'] != '' && strlen($_POST['input'])) {
		session_name($_POST['name']);
		session_start();
		$chat = file($data.$_POST['name']);
		getpeople($chat);
		preg_match('/^[a-z]{1,12}:/', $_POST['input'], $thisnick);
		$thisnick = substr($thisnick[0], 0, -1);
		if (preg_match('/^[a-z]{1,12}:\s\[B-C\].+\[E-C\]$/', $_POST['input']) && $nick == $thisnick) {
			$chat = "\n".$_POST['input'];
			file_put_contents($data.$_POST['name'], $chat, FILE_APPEND | LOCK_EX);
		}
		exit;
	}
	else if (isset($_POST['nick']) && preg_match('/^([a-z])+$/', $_POST['nick']) && strlen($_POST['nick']) <= 12 && isset($_POST['name']) && preg_match('/^([a-z]|_|[0-9])+$/', $_POST['name']) && isset($_POST['public'])) {
		session_name($_POST['name']);
		session_start();
		$chat = file($data.$_POST['name']);
		if (file_exists($data.$_POST['name'])) {
			getpeople($chat);
			if (time() - filemtime($data.$_POST['name']) > $timelimit) {
				unlink($data.$_POST['name']);
				createchat($_POST['name'], $_POST['nick'], $_POST['public']);
				joinchat($_POST['name'], $_POST['nick'], $_POST['public']);
				exit;
			}
		}
		if ($_POST['public'] == 'get') {
			print(trim($chat[0]));
			exit;
		}
		if (count($usedsessions) >= $maxusers) {
			print("full");
			exit;
		}
		else if (in_array($_POST['nick'], $usednicks)) {
			print('inuse');
			exit;
		}
		else if (isset($mysession) && $_SESSION['id'] == $mysession && $nick) {
			preg_match('/'.$nick.'\:[^\|]+\|/', $chat[0], $public);
			$chat[count($chat)+1] = "\n".'< '.$nick.' has left';
			$chat[0] = str_replace($public[0], $_POST['nick'].':'.$_POST['public'].'|', $chat[0]);
			$chat[1] = preg_replace('/'.$mysession.'\:'.$nick.'\+\d+\-/', $mysession.':'.$_POST['nick'].'+'.count($chat).'-', $chat[1]);
			$chat[count($chat)+1] = "\n".'> '.$_POST['nick'].' has arrived';
			file_put_contents($data.$_POST['name'], implode('', $chat), LOCK_EX);
		}
		else if (!$nick) {
			if (file_exists($data.$_POST['name'])) {
				joinchat($_POST['name'], $_POST['nick'], $_POST['public']);
				if ($used) {
					print('error');
				}
			}
			else if (createchat($_POST['name'], $_POST['nick'], $_POST['public'])) {
				joinchat($_POST['name'], $_POST['nick'], $_POST['public']);
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
	<script type="text/javascript" src="js/cryptico.js"></script>
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
<div><a href="https://crypto.cat/fundraiser/"><img style="position: absolute; top: 0; left: 0; border: 0;" src="https://crypto.cat/fundraiser/fundraiser.png" alt="Donate!" /></a></div>
	<?php
		function welcome($name) {
			global $install;
			print('<div id="main">
				<img src="img/cryptocat.png" alt="cryptocat" class="cryptocat" />
				<form action="'.$install.'" method="get" class="create" id="welcome">
					<div id="front">
						<div id="note">
						<strong>Important note:</strong> Cryptocat is a new technology that relies on experimental techniques that need years of auditing before they can be declared completely reliable by cryptography academics. If you are trying to avoid surveillance by some intelligence agency or world government, consider decade-proof alternatives such as PGP.
						<br /><br /><a id="understand" href="#">I understand. Let me chat!</a>
						</div>
					</div>
					<div>
						<input type="text" class="name" name="c" id="name" onclick="StuffSelect(\'name\');" value="'.$name.'" maxlength="32" />
						<input type="submit" class="create" value="enter" id="create" />
					</div>
					<p id="video">(for a safer experience, check out <a onclick="window.open(this.href,\'_blank\');return false;" href="https://chrome.google.com/webstore/detail/dlafegoljmjdfmhgoeojifolidmllaie">cryptocat verifier</a>.)</p>
				</form>
				<table>
					<tr>
						<td class="img"><img src="img/1.png" alt="" /></td>
						<td id="td1"><strong>cryptocat</strong> lets you set up encrypted, private chats for impromptu secure conversations.</td>
					</tr>
					<tr>
						<td class="img"><img src="img/2.png" alt="" /></td>
						<td id="td2">messages are encrypted locally and are verified for integrity. conversations are securely wiped after 30 minutes of inactivity.</td>
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
		function createchat($name, $setnick, $public) {
			global $data, $_SESSION;
			session_name($name);
			session_start();
			if (!isset($_SESSION['id'])) {
				$_SESSION['id'] = gen(32);
			}
			$name = strtolower($name);
			$chat = array(0 => $setnick.':'.$public.'|', 1 => $_SESSION['id'].':'.$setnick.'+2-');
			array_push($chat, '> '.$setnick.' has arrived');
			file_put_contents($data.$name, implode("\n", $chat), LOCK_EX);
			return 1;
		}
		function joinchat($name, $setnick, $public) {
			global $data, $nick, $mysession, $mypos, $usednicks, $usedsessions, $_SESSION, $used;
			$used = 0;
			session_name($name);
			session_start();
			$name = strtolower($name);
			$chat = file($data.$name);
			getpeople($chat);
			$pos = count($chat);
			while (!isset($_SESSION['id']) || in_array($_SESSION['id'], $usedsessions)) {
				$_SESSION['id'] = gen(32);
			}
			if (!isset($nick)) {
				if (in_array($setnick, $usednicks)) {
					$used = 1;
					exit;
				}
				else {
					$nick = $setnick;
				}
				$chat[0] = trim($chat[0]).$nick.':'.$public.'|'."\n";
				$chat[1] = trim($chat[1]).$_SESSION['id'].':'.$nick.'+'.$pos.'-'."\n";
				$chat[count($chat)+1] = "\n".'> '.$nick.' has arrived';
				file_put_contents($data.$name, implode('', $chat), LOCK_EX);
			}
		}
		function chat($name) {
			global $data, $nicks, $timelimit, $maxinput, $install, $update, $_SESSION, $mysession, $usedsessions, $usednicks, $fancyurls;
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
					<div id="keygen">
						<img src="img/keygen.gif" alt="" /><br />
						<span id="keytext"></span>
					</div>
					<div id="nickentry">
						<p>Enter nickname</p>
						<form name="nickform" id="nickform" method="post" action="'.$install.'">
							<div>
								<input type="text" name="nickinput" id="nickinput" value="'.$nick.'" maxlength="12" />
								<input type="submit" class="invisible" value="chat" />
							</div>
						</form>
					</div>
				</div>
				<div id="fingerprints"></div>
			</div>
			<a href="'.$install.'" onclick="logout();"><img src="img/cryptocat.png" alt="cryptocat" /></a>
			<img src="img/maximize.png" alt="maximize" id="maximize" title="expand" />
			<img src="img/nosound.png" alt="sound" id="sound" title="enable message notifications" />
			<input type="text" value="'.$name.'" name="name" id="name" class="invisible" />
			<div class="invisible" id="loader"></div>
			<div id="chat"></div>
			<div id="info">chatting as <span id="nick">'.$nick.'</span> on 
			<span id="url" onclick="StuffSelect(\'url\');">'.$install.'?c='.$name.'</span> - <span id="fingerlink">fingerprints</span>
			</div>
			<form name="chatform" id="chatform" method="post" action="'.$install.'">
				<div>
					<div id="chatters"></div>
					<input type="text" name="input" id="input" maxlength="'.$maxinput.'" onkeydown="textcounter(document.chatform.input,document.chatform.talk,'.$maxinput.')" onkeyup="textcounter(document.chatform.input,document.chatform.talk,'.$maxinput.')" />
					<input type="submit" name="talk" id="talk" onmouseover="curcount = this.value; this.value=\'send\';" onmouseout="this.value=curcount;" value="'.$maxinput.'" />
				</div>
			</form>
			</div>
			<script type="text/javascript">var install = "'.$install.'";var update = "'.$update.'";var name = "'.$name.'";var maxinput = "'.$maxinput.'";var fancyurls = '.$fancyurls.';</script>
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
					preg_match('/'.$nick.'\:[^\|]+\|/', $chat[0], $public);
					$chat[0] = str_replace($public[0], '', $chat[0]);
					$chat[1] = preg_replace('/'.$mysession.'\:'.$nick.'\+\d+\-/', '', $chat[1]);
					$chat[count($chat)+1] = "\n".'< '.$nick.' has left';
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