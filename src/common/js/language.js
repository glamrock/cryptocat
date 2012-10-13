var Language = function() {};
(function(){

// Handle aliases
function handleAliases(locale) {
	switch (locale) {
		case 'de-de':
			return 'de';
			break;
		case ('es-es' || 'es-mx' || 'es-ar'):
			return 'es';
			break;
		case 'pt-pt':
			return 'pt';
			break;
		case 'sv-se':
			return 'sv';
			break;
		case 'zh-tw':
			return 'zh-hk';
			break;
		case 'zh-sg':
			return 'zh-cn';
			break;
		default:
			return locale;
	}
}

// Get locale file
Language.set = function(locale) {
	locale = handleAliases(locale);
	$.ajax({
		url : '../locale/' + locale + '.txt',
		dataType: 'text',
		success: function(data) {
			language = data.split('\n');
			for (var i in language) {
				language[i] = $.trim(language[i]);
			}
			Language.buildObject(locale, language);
		},
		error: function() {
			Language.set('en-us');
		}
	});
}

// Build and deliver language object
Language.buildObject = function(locale, language) {
	languageObject = {
		'language': locale,
		'direction': language[0],
		'font-family': language[1],
		'loginWindow': {
			'introHeader': language[2],
			'introParagraph1': language[3],
			'introParagraph2': language[4],
			'project': language[5],
			'blog': language[6],
			'source': language[7],
			'customServer': language[8],
			'reset': language[9],
			'conversationName': language[10],
			'nickname': language[11],
			'connect': language[12],
			'enterConversation': language[13]
		},
		'loginMessage': {
			'enterConversation': language[14],
			'conversationAlphanumeric': language[15],
			'enterNickname': language[16],
			'nicknameAlphanumeric': language[17],
			'nicknameInUse': language[18],
			'authenticationFailure': language[19],
			'connectionFailed': language[20],
			'thankYouUsing': language[21],
			'registering': language[22],
			'connecting': language[23],
			'connected': language[24],
			'typeRandomly': language[25],
			'generatingKeys': language[26]
		},
		'chatWindow': {
			'groupConversation': language[27],
			'otrFingerprint': language[28],
			'groupFingerprint': language[29],
			'resetKeys': language[30],
			'resetKeysWarn': language[31],
			'continue': language[32],
			'statusAvailable': language[33],
			'statusAway': language[34],
			'myInfo': language[35],
			'desktopNotificationsOn': language[36],
			'desktopNotificationsOff': language[37],
			'audioNotificationsOn': language[38],
			'audioNotificationsOff': language[39],
			'rememberNickname': language[40],
			'doNotRememberNickname': language[41],
			'logout': language[42],
			'displayInfo': language[43],
			'sendEncryptedFile': language[44],
			'viewImage': language[45],
			'downloadFile': language[46],
			'conversation': language[47]
		}
	}
	Language.refresh(languageObject);
}

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
	$('#conversationName').select();
}

})();