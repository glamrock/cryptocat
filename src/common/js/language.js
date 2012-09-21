var Language = function() {};
(function(){

var language = {};
var defaultLanguage;

Language.setDefault = function(lang) {
	defaultLanguage = language[lang];
}

Language.set = function(lang) {
	lang = language[lang];
	$('html').attr('dir', lang['direction']);
	$('body').css('font-family', lang['font-family']);
	$('#introHeader').html(lang['loginWindow']['introHeader']);
	$('#introParagraph1').html(lang['loginWindow']['introParagraph1']);
	$('#introParagraph2').html(lang['loginWindow']['introParagraph2']);
	$('#project').html(lang['loginWindow']['project']);
	$('#blog').html(lang['loginWindow']['blog']);
	$('#source').html(lang['loginWindow']['source']);
	$('#customServer').html(lang['loginWindow']['customServer']);
	$('#chatName').val(lang['loginWindow']['conversationName']);
	$('#nickname').val(lang['loginWindow']['nickname']);
	$('#loginSubmit').val(lang['loginWindow']['connect']);
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
	'direction': 'ltr',
	'font-family': 'Helvetica, Arial, Verdana',
	'loginWindow': {
		'introHeader': '﻿Private Conversations for Everyone.',
		'introParagraph1': 'Cryptocat is an instant messaging platform that lets you easily have private conversations with friends. Messages are encrypted before leaving your screen and are protected from being viewed by any third party, even from us.',
		'introParagraph2': 'Cryptocat is free software built on open standards. Our development process is under continuous examination by a community of volunteers and enthusiasts. <a href="https://project.crypto.cat" target="_blank">Learn more about the Cryptocat Project</a>.',
		'project': 'Project',
		'blog': 'Blog',
		'source': 'Source',
		'customServer': 'custom server...',
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

language.ca = {
	'language': 'ca',
	'direction': 'ltr',
	'font-family': 'Helvetica, Arial, Verdana',
	'loginWindow': {
		'introHeader': '﻿Converses privades per a tothom',
		'introParagraph1': 'Cryptocat es una plataforma de missatgeria instantània que et permet mantenir converses privades fàcilment amb els amics. Els missatges es xifren abans de sortir de la teva pantalla i són protegits de ser vistos per terceres persones, incloses nosaltres.',
		'introParagraph2': 'Cryptocat és free software construït sobre estàndards oberts. El nostre procés de desenvolupament està en període d\'evaluació continuada per part d\'una comunitat de voluntaris i entusiastes. <a href="https://project.crypto.cat" target="_blank">Descobreix més sobre el Projecte Cryptocat</a>.',
		'project': 'Projecte',
		'blog': 'Bloc',
		'source': 'Font',
		'customServer': 'servidor personalitzat...',
		'conversationName': 'nom de la conversa',
		'nickname': 'nom d\'usuari',
		'connect': 'connecta',
		'enterConversation': 'Introdueix el nom de la conversa.'
	},
	'loginMessage': {
		'enterConversation': 'Si us plau introdueix el nom de la conversa.',
		'conversationAlphanumeric': 'El nom de la conversa ha de ser alfanumèric.',
		'enterNickname': 'Si us plau introdueix un nom d\'usuari',
		'nicknameAlphanumeric': 'El nom d\'usuari ha de ser alfanumèric.',
		'nicknameInUse': 'El nom d\'usuari no està disponible.',
		'authenticationFailure': 'Error d\'identificació.',
		'connectionFailed': 'Error de connexió.',
		'thankYouUsing': 'Gràcies per utilitzar Cryptocat.',
		'registering': 'Registrant...',
		'connecting': 'Connectant...',
		'typeRandomly': 'Si us plau, escriu aleatòriament amb el teclat durant uns segons.',
		'generatingKeys': 'Generant claus de xifrat...'
	},
	'chatWindow': {
		'groupConversation': 'Conversa de grup. Clica a un usuari per a una conversa privada.',
		'otrFingerprint': 'Empremta OTR (per a converses privades):',
		'groupFingerprint': 'Empremta de conversa de grup:',
		'statusAvailable': 'Estatus: Disponible',
		'statusAway': 'Estatus: Absent',
		'myInfo': 'La meva informació',
		'desktopNotificationsOn': 'Notificacions d\'Escriptori Activades',
		'desktopNotificationsOff': 'Notificacions d\'Escriptori Desactivades',
		'audioNotificationsOn': 'Notificacions d\'Àudio Activades',
		'audioNotificationsOff': 'Notificacions d\'Àudio Desactivades',
		'logout': 'Desconnectar-se',
		'displayInfo': 'Mostra informació',
		'sendEncryptedFile': 'Envia fitxer xifrat',
		'conversation': 'Conversa'
	}
}

language.fr = {
	'language': 'fr',
	'direction': 'ltr',
	'font-family': 'Helvetica, Arial, Verdana',
	'loginWindow': {
		'introHeader': '﻿Conversations Privées Pour Tout le Monde.',
		'introParagraph1': 'Cryptocat est une plateforme de messagerie instantanée qui vous permet facilement d\'avoir des conversations privées avec des amis. Les messages sont cryptés avant de quitter votre écran et sont protégés contre leur lecture par un tiers, même de nous.',
		'introParagraph2': 'Cryptocat est un logiciel libre construit sur ​​des standards ouverts. Notre processus de développement est en cours d\'examen continu par une communauté de bénévoles et de passionnés. <a href="https://project.crypto.cat" target="_blank">Apprenez plus sur le projet Cryptocat</a>.',
		'project': 'Projet',
		'blog': 'Blog',
		'source': 'Source',
		'customServer': 'serveur externe...',
		'conversationName': 'nom de la conversation',
		'nickname': 'pseudonyme',
		'connect': 'connexion',
		'enterConversation': 'Entrez le nom d\'une conversation.'
	},
	'loginMessage': {
		'enterConversation': 'Veuillez entrez un nom de conversation.',
		'conversationAlphanumeric': 'La conversation doit être au format alphanumérique.',
		'enterNickname': 'Veuillez entrer un pseudonyme.',
		'nicknameAlphanumeric': 'Le pseudonyme doit être au format alphanumérique.',
		'nicknameInUse': 'Ce pseudonyme est déjà utilisé.',
		'authenticationFailure': 'Erreur d\'authentification.',
		'connectionFailed': 'Connexion a échouée.',
		'thankYouUsing': 'Merci d\'avoir utilisé Cryptocat.',
		'registering': 'Enregistrement...',
		'connecting': 'Connexion...',
		'typeRandomly': 'Veuillez taper sur votre clavier d\'une manière aléatoire pendant quelques secondes.',
		'generatingKeys': 'Génération de clés de cryptage...'
	},
	'chatWindow': {
		'groupConversation': 'Conversation de groupe. Cliquez sur un utilisateur pour commencer une conversation privée.',
		'otrFingerprint': 'Signature OTR (pour les conversations privées):',
		'groupFingerprint': 'Signature de la conversation de groupe:',
		'statusAvailable': 'Statut: Disponible',
		'statusAway': 'Statut: Non Disponible',
		'myInfo': 'Mes Informations',
		'desktopNotificationsOn': 'Notifications Visibles',
		'desktopNotificationsOff': 'Pas de Notifications Visibles',
		'audioNotificationsOn': 'Notifications Audio',
		'audioNotificationsOff': 'Pas de Notifications Audio',
		'logout': 'Déconnexion',
		'displayInfo': 'Afficher Info',
		'sendEncryptedFile': 'Envoyer un fichier crypté',
		'conversation': 'Conversation'
	}
}

language.ar = {
	'language': 'ar',
	'direction': 'rtl',
	'font-family': 'Tahoma, DejaVu, Helvetica, Arial, Verdana',
	'loginWindow': {
		'introHeader': '﻿محادثات خصوصية وآمنة لجميع الأشخاص.',
		'introParagraph1': 'كريبتوكات هو برنامج للتراسل اللحظي، يتيح لك القيام بالمحادثات الآمنة والخصوصية مع أصدقائك وذلك من خلال تعمية (تشفير) الرسائل قبل مغادرتها لشاشة حاسوبك فتبقى محميّة من التعرض للإختراق من قبل الآخرين أو حتى نحن.',
		'introParagraph2': 'كريبتوكات هو برنامج مجاني مبني على معايير مفتوحة. عملية تطويره لا تزال تحت البحث والدراسة المستمرة من قبل مجموعة من المتطوعين والمتحمسين. اعرف المزيد عن مشروع كريبتوكات.',
		'project': 'مشروع',
		'blog': 'مدونة',
		'source': 'مصدر',
		'customServer': 'خادم مخصص...',
		'conversationName': 'اسم المحادثة',
		'nickname': 'الاسم المستعار',
		'connect': 'اتصل',
		'enterConversation': 'ادخل اسم محادثة للأنضمام.'
	},
	'loginMessage': {
		'enterConversation': 'الرجاء ادخال اسم محادثة.',
		'conversationAlphanumeric': 'اسم المحادثة يجب ان يكون من رموز الابجدية.',
		'enterNickname': 'الرجاء ادخال اسم مستعار.',
		'nicknameAlphanumeric': 'الاسم المتسعار يجب ان يكون من رموز الابجدية.',
		'nicknameInUse': 'الاسم المتسعار مستخدم.',
		'authenticationFailure': 'فشل التحقيق.',
		'connectionFailed': 'الإتصال قد فشل.',
		'thankYouUsing': 'شكرا لكم لاستخدام كريبتوكات.',
		'registering': 'جاري التسجيل...',
		'connecting': 'جاري الاتصال...',
		'typeRandomly': 'الرجاء الطباعة على لوحة مفاتيحك بكل ما يمكن من عشوائية لبضعة ثوان.',
		'generatingKeys': 'جاري توليد مفاتيح التشفير...'
	},
	'chatWindow': {
		'groupConversation': 'محادثة جماعية. اضغط على مستخدم لمحادثة خاصة.',
		'otrFingerprint': 'بصمة OTR (للمحادثات الخاصة):',
		'groupFingerprint': 'بصمة المحادثة الجماعية:',
		'statusAvailable': 'الحالة: متواجد',
		'statusAway': 'الحالة: غير متواجد',
		'myInfo': 'معلوماتي',
		'desktopNotificationsOn': 'اخطارات سطح المكتب مفعلة',
		'desktopNotificationsOff': 'اخطارات سطح المكتب غير مفعلة',
		'audioNotificationsOn': 'اخطارات صوتية مفعلة',
		'audioNotificationsOff': 'اخطارات صوتية غير مفعلة',
		'logout': 'تسجيل الخروج',
		'displayInfo': 'عرض المعلومات',
		'sendEncryptedFile': 'ارسل ملف مشفر',
		'conversation': 'محادثة'
	}
}


})();