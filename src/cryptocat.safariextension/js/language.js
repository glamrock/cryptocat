var Language = function() {};
(function(){

// Handle aliases
function handleAliases(locale) {
	if (locale === ('zh-hk' || 'zh-tw')) {
		return 'zh-hk';
	}
	else if (locale === ('zh-cn' || 'zh-sg')) {
		return 'zh-cn';
	}
	else if (locale.match('-')) {
		return locale.match(/[a-z]+/)[0];
	}
	return locale;
}

// Get locale file, call other functions
Language.set = function(locale) {
	locale = handleAliases(locale.toLowerCase());
	$.ajax({
		url : 'locale/' + locale + '.txt',
		dataType: 'text',
		accepts: 'text/html',
		contentType: 'text/html',
		complete: function(data) {
			language = data.responseText.split('\n');
			if (language.length < 5) {
				// Something's wrong, reset to English and exit
				Language.set('en');
				return false;
			}
			for (var i in language) {
				language[i] = $.trim(language[i]);
			}
			Language.buildObject(locale, language);
		}
	});
}

// Build and deliver language object
Language.buildObject = function(locale, language) {
	var i = 0;
	languageObject = {
		'language': locale,
		'direction': language[i++],
		'font-family': language[i++],
		'loginWindow': {
			'introHeader': language[i++],
			'introParagraph1': language[i++],
			'introParagraph2': language[i++],
			'project': language[i++],
			'blog': language[i++],
			'source': language[i++],
			'customServer': language[i++],
			'reset': language[i++],
			'conversationName': language[i++],
			'nickname': language[i++],
			'connect': language[i++],
			'enterConversation': language[i++]
		},
		'loginMessage': {
			'enterConversation': language[i++],
			'conversationAlphanumeric': language[i++],
			'enterNickname': language[i++],
			'nicknameAlphanumeric': language[i++],
			'nicknameInUse': language[i++],
			'authenticationFailure': language[i++],
			'connectionFailed': language[i++],
			'thankYouUsing': language[i++],
			'registering': language[i++],
			'connecting': language[i++],
			'connected': language[i++],
			'typeRandomly': language[i++],
			'generatingKeys': language[i++]
		},
		'chatWindow': {
			'groupConversation': language[i++],
			'otrFingerprint': language[i++],
			'groupFingerprint': language[i++],
			'resetKeys': language[i++],
			'resetKeysWarn': language[i++],
			'continue': language[i++],
			'statusAvailable': language[i++],
			'statusAway': language[i++],
			'myInfo': language[i++],
			'desktopNotificationsOn': language[i++],
			'desktopNotificationsOff': language[i++],
			'audioNotificationsOn': language[i++],
			'audioNotificationsOff': language[i++],
			'rememberNickname': language[i++],
			'doNotRememberNickname': language[i++],
			'logout': language[i++],
			'displayInfo': language[i++],
			'sendEncryptedFile': language[i++],
			'viewImage': language[i++],
			'downloadFile': language[i++],
			'conversation': language[i++]
		}
	}
	Language.refresh(languageObject);
}

// Deliver new strings and refresh login page
Language.refresh = function(languageObject) {
	Cryptocat.language = languageObject;
	$('html').attr('dir', languageObject['direction']);
	$('body').css('font-family', languageObject['font-family']);
	$('#introHeader').text(languageObject['loginWindow']['introHeader']);
	$('#introParagraph1').text(languageObject['loginWindow']['introParagraph1']);
	$('#introParagraph2').html(languageObject['loginWindow']['introParagraph2']);
	$('#project').text(languageObject['loginWindow']['project']);
	$('#blog').text(languageObject['loginWindow']['blog']);
	$('#source').text(languageObject['loginWindow']['source']);
	$('#customServer').text(languageObject['loginWindow']['customServer']);
	$('#conversationName').val(languageObject['loginWindow']['conversationName']);
	$('#nickname').val(languageObject['loginWindow']['nickname']);
	$('#loginSubmit').val(languageObject['loginWindow']['connect']);
	$('#loginInfo').text(languageObject['loginWindow']['enterConversation']);
	$('#logout').attr('title', languageObject['chatWindow']['logout']);
	$('#logout').attr('alt', languageObject['chatWindow']['logout']);
	$('#audio').attr('title', languageObject['chatWindow']['audioNotificationsOff']);
	$('#audio').attr('alt', languageObject['chatWindow']['audioNotificationsOff']);
	$('#notifications').attr('title', languageObject['chatWindow']['desktopNotificationsOff']);
	$('#notifications').attr('alt', languageObject['chatWindow']['desktopNotificationsOff']);
	$('#myInfo').attr('title', languageObject['chatWindow']['myInfo']);
	$('#myInfo').attr('alt', languageObject['chatWindow']['myInfo']);
	$('#status').attr('title', languageObject['chatWindow']['statusAvailable']);
	$('#status').attr('alt', languageObject['chatWindow']['statusAvailable']);
	$('#conversationTag').text(languageObject['chatWindow']['conversation']);
	$('[title]').qtip({
		position: {
			my: 'top left',
			at: 'bottom left'
		}
	});
	$('#conversationName').select();
}

})();
