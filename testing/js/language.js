var Language = function() {};
(function(){

var language = {};
var defaultLanguage;

Language.setDefault = function(lang) {
	defaultLanguage = language[lang];
}

Language.set = function(lang) {
	lang = language[lang];
	$('#introHeader').html(lang['loginWindow']['introHeader']);
	$('#introParagraph1').html(lang['loginWindow']['introParagraph1']);
	$('#introParagraph2').html(lang['loginWindow']['introParagraph2']);
	$('#project').html(lang['loginWindow']['project']);
	$('#blog').html(lang['loginWindow']['blog']);
	$('#source').html(lang['loginWindow']['source']);
	$('#customServer').html(lang['loginWindow']['customServer']);
	$('#chatName').val(lang['loginWindow']['conversationName']);
	$('#nickname').val(lang['loginWindow']['nickname']);
	$('#loginSubmit').html(lang['loginWindow']['connect']);
	$('#loginInfo').html(lang['loginWindow']['enterConversation']);
	$('#logout').attr('title', lang['chatWindow']['logout']);
	$('#logout').attr('alt', lang['chatWindow']['logout']);
	$('#audio').attr('title', lang['chatWindow']['audioNotificationsOff']);
	$('#audio').attr('alt', lang['chatWindow']['audioNotificationsOff']);
	$('#notifications').attr('title', lang['chatWindow']['desktopNotificationsOff']);
	$('#notifications').attr('alt', lang['chatWindow']['desktopNotificationsOff']);
	$('#myInfo').attr('title', lang['chatWindow']['myInfo']);
	$('#myInfo').attr('alt', lang['chatWindow']['myInfo']);
	$('#status').attr('title', lang['chatWindow']['statusAvailable']);
	$('#status').attr('alt', lang['chatWindow']['statusAvailable']);
	$('#conversationTag').html(lang['chatWindow']['conversation']);
	return lang;
}

language.en = {
	'language': 'en',
	'loginWindow': {
		'introHeader': '﻿Private Conversations for Everyone.',
		'introParagraph1': 'Cryptocat is an instant messaging platform that lets you easily have private conversations with friends. Messages are encrypted before leaving your screen and are protected from being viewed by any third party, even from us.',
		'introParagraph2': 'Cryptocat is free software built on open standards. Our development process is under continuous examination by a community of volunteers and enthusiasts. <a href="https://project.crypto.cat" target="_blank">Learn more about the Cryptocat Project</a>',
		'project': 'Project',
		'blog': 'Blog',
		'source': 'Source',
		'customServer': 'Custom server...',
		'conversationName': 'conversation name',
		'nickname': 'nickname',
		'connect': 'connect',
		'enterConversation': 'Enter the name of a conversation to join.'
	},
	'loginMessage': {
		'enterConversation': 'Please enter a conversation name.',
		'conversationAlphanumeric': 'Conversation name must be alphanumeric.',
		'enterNickname': 'Please enter a nickname.',
		'nicknameAlphanumeric': 'Nickname must be alphanumeric.',
		'nicknameInUse': 'Nickname in use.',
		'authenticationFailure': 'Authentication failure.',
		'connectionFailed': 'Connection failed.',
		'thankYouUsing': 'Thank you for using Cryptocat.',
		'registering': 'Registering...',
		'connecting': 'Connecting...',
		'typeRandomly': 'Please type on your keyboard as randomly as possible for a few seconds.',
		'generatingKeys': 'Generating encryption keys...'
	},
	'chatWindow': {
		'groupConversation': 'Group conversation. Click on a user for private chat.',
		'otrFingerprint': 'OTR fingerprint (for private conversations):',
		'groupFingerprint': 'Group conversation fingerprint:',
		'statusAvailable': 'Status: Available',
		'statusAway': 'Status: Away',
		'myInfo': 'My Info',
		'desktopNotificationsOn': 'Desktop Notifications On',
		'desktopNotificationsOff': 'Desktop Notifications Off',
		'audioNotificationsOn': 'Audio Notifications On',
		'audioNotificationsOff': 'Audio Notifications Off',
		'logout': 'Logout',
		'displayInfo': 'Display info',
		'sendEncryptedFile': 'Send encrypted file',
		'conversation': 'Conversation'
	}
}

})();