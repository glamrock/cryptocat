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
	$('#conversationName').val(lang['loginWindow']['conversationName']);
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
		'logout': 'Disconnect',
		'displayInfo': 'Display info',
		'sendEncryptedFile': 'Send encrypted file',
		'conversation': 'Conversation'
	}
}

language.lol = {
	'language': 'lol',
	'direction': 'ltr',
	'font-family': 'Helvetica, Arial, Verdana',
	'loginWindow': {
		'introHeader': '﻿Private Conversashuns 4 Evrwun.',
		'introParagraph1': 'Cryptocat iz an instant mesagin platform dat lets u easily has private conversashuns wif frenz. Mesagez r encryptd before leavin ur screen an r protectd frum bean viewd by any third party, even frum us.',
		'introParagraph2': 'Cryptocat iz free software built on open standardz. R development proces iz undr continuous examinashun by community ov volunteers an enthusiasts. <a href="https://project.crypto.cat" target="_blank">Lern moar bout teh Cryptocat Project</a>.',
		'project': 'Project',
		'blog': 'Blog',
		'source': 'Source',
		'customServer': 'custom servr...',
		'conversationName': 'conversashun naym',
		'nickname': 'nickname',
		'connect': 'connect',
		'enterConversation': 'Entr teh naym ov conversashun 2 join.'
	},
	'loginMessage': {
		'enterConversation': 'Plz entr conversashun naym.',
		'conversationAlphanumeric': 'Conversashun naym must be alfanumeric.',
		'enterNickname': 'Plz entr a nickname.',
		'nicknameAlphanumeric': 'Nickname must be alfanumeric.',
		'nicknameInUse': 'Nickname in use.',
		'authenticationFailure': 'Authenticashun failure.',
		'connectionFailed': 'Connecshun Faild.',
		'thankYouUsing': 'Thank mew 4 usin Cryptocat.',
		'registering': 'Registerin...',
		'connecting': 'Connectin...',
		'typeRandomly': 'Plz type on ur keybord as randomly as posible 4 few secondz.',
		'generatingKeys': 'Generatin encrypshun keys...'
	},
	'chatWindow': {
		'groupConversation': 'Group conversashun. Click on usr 4 private chat.',
		'otrFingerprint': 'OTR fingerprint (4 private conversashuns):',
		'groupFingerprint': 'Group conversashun fingerprint:',
		'statusAvailable': 'Status: Available',
		'statusAway': 'Status: Away',
		'myInfo': 'My Info',
		'desktopNotificationsOn': 'Desktop Notificashuns On',
		'desktopNotificationsOff': 'Desktop Notificashuns Off',
		'audioNotificationsOn': 'Audio Notificashuns On',
		'audioNotificationsOff': 'Audio Notificashuns Off',
		'logout': 'Disconnect',
		'displayInfo': 'Display info',
		'sendEncryptedFile': 'Send encryptd file',
		'conversation': 'Conversashun'
	}
}


language.ca = {
	'language': 'ca',
	'direction': 'ltr',
	'font-family': 'Helvetica, Arial, Verdana',
	'loginWindow': {
		'introHeader': '﻿Converses privades per a tothom.',
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

language.it = {
	'language': 'it',
	'direction': 'ltr',
	'font-family': 'Helvetica, Arial, Verdana',
	'loginWindow': {
		'introHeader': '﻿Conversazioni Private per Tutti.',
		'introParagraph1': 'Cryptocat è una piattaforma di messaggistica istantanea che ti permette facilmente di avere conversazioni private con amici. I messaggi sono cifrati prima di lasciare il tuo schermo e protetti dall\'essere visti da terzi, compresi noi.',
		'introParagraph2': 'Cryptocat è un software free sviluppato su standard aperti. Il nostro processo di sviluppo è sotto continuo esame da una comunità di volontari e appassionati. <a href="https://project.crypto.cat" target="_blank">Impara di più sul Cryptocat Project</a>.',
		'project': 'Progetto',
		'blog': 'Blog',
		'source': 'Codice',
		'customServer': 'server personalizzato...',
		'conversationName': 'nome conversazione',
		'nickname': 'nickname',
		'connect': 'connetti',
		'enterConversation': 'Inserisci il nome di una conversazione'
	},
	'loginMessage': {
		'enterConversation': 'Inserisci un nome conversazione.',
		'conversationAlphanumeric': 'Il nome della conversazione deve essere alfanumerico',
		'enterNickname': 'Si prega di inserire un nickname.',
		'nicknameAlphanumeric': 'Il nickname deve essere alfanumerico.',
		'nicknameInUse': 'Nickname già in uso.',
		'authenticationFailure': 'Autenticazione fallita.',
		'connectionFailed': 'Connessione fallita.',
		'thankYouUsing': 'Grazie per aver scelto Cryptocat.',
		'registering': 'Registrazione...',
		'connecting': 'Connessione...',
		'typeRandomly': 'Si prega di scrivere sulla propria tastiera il più casualmente possibile per pochi secondi.',
		'generatingKeys': 'Generazione chiavi di cifratura...'
	},
	'chatWindow': {
		'groupConversation': 'Conversazione di gruppo. Clicca su un utente per una chat privata.',
		'otrFingerprint': 'OTR fingerprint (per conversazioni private):',
		'groupFingerprint': 'Fingerprint di gruppo di conversazione:',
		'statusAvailable': 'Stato: Disponibile',
		'statusAway': 'Stato: Non al computer',
		'myInfo': 'Mie Info',
		'desktopNotificationsOn': 'Notifiche Desktop Attive',
		'desktopNotificationsOff': 'Notifiche Desktop Disattivate',
		'audioNotificationsOn': 'Notifiche Audio Attive',
		'audioNotificationsOff': 'Notifiche Audio Disattivate',
		'logout': 'Scollegati',
		'displayInfo': 'Mostra Info',
		'sendEncryptedFile': 'Invio file cifrato',
		'conversation': 'Conversazione'
	}
}

language.da = {
	'language': 'da',
	'direction': 'ltr',
	'font-family': 'Helvetica, Arial, Verdana',
	'loginWindow': {
		'introHeader': '﻿Privat Samtale for Alle.',
		'introParagraph1': 'Cryptocat er en chat platform der giver dig nem adgang til private samtaler. Besked er krypteret før den forlader din skærm og beskyttet så ingen tredie part kan se dem, selv ikke os.',
		'introParagraph2': 'Cryptocat er free software bygget på open standard. Udviklingsprocessen er under konstant eksaminering af et community af frivillige og entusiaster. <a href="https://project.crypto.cat" target="_blank">Lær mere om Cryptocat projektet.</a>.',
		'project': 'Projekt',
		'blog': 'Blog',
		'source': 'Kildekode',
		'customServer': 'brugerdefineret server...',
		'conversationName': 'samtale navn',
		'nickname': 'brugernavn',
		'connect': 'forbind',
		'enterConversation': 'Indtast navnet på en samtale'
	},
	'loginMessage': {
		'enterConversation': 'Indtast et samtale navn',
		'conversationAlphanumeric': 'Samtale navn skal være alfanumerisk.',
		'enterNickname': 'Indtast bruger navn.',
		'nicknameAlphanumeric': 'Bruger navn skal være alfanumerisk.',
		'nicknameInUse': 'Bruger navn i brug.',
		'authenticationFailure': 'Gofkendelse fejlede.',
		'connectionFailed': 'Forbindelse fejlede.',
		'thankYouUsing': 'Tak fordi du brugte Cryptocat.',
		'registering': 'Registrering...',
		'connecting': 'Forbinder...',
		'typeRandomly': 'Tast så forskelligt taster som muligt i nogle sekunder.',
		'generatingKeys': 'Genererer krypterings nøgle...'
	},
	'chatWindow': {
		'groupConversation': 'Gruppe samtale. Klik på bruger navn for privat samtale.',
		'otrFingerprint': 'OTR signatur (for privat samtale):',
		'groupFingerprint': 'Gruppe samtale signatur:',
		'statusAvailable': 'Status: Ledig',
		'statusAway': 'Status: Ikke tilstede',
		'myInfo': 'Min Info',
		'desktopNotificationsOn': 'Desktop Besked On',
		'desktopNotificationsOff': 'Desktop besked Off',
		'audioNotificationsOn': 'Lyd Besked On',
		'audioNotificationsOff': 'Lyd Besked Off',
		'logout': 'Log ud',
		'displayInfo': 'Vis Info',
		'sendEncryptedFile': 'Send krypteret fil',
		'conversation': 'Samtale'
	}
}

language.es = {
	'language': 'es',
	'direction': 'ltr',
	'font-family': 'Helvetica, Arial, Verdana',
	'loginWindow': {
		'introHeader': '﻿Conversaciones privadas para todos.',
		'introParagraph1': 'Cryptocat es una plataforma de mensajería instantánea que te permite tener conversaciones privadas facilmente con tus amigos. Los mensajes son encriptados antes de dejar tu computador y son protegidos de ser vistos por alguna persona ajena, incluidos nosotros.',
		'introParagraph2': 'Cryptocat es un software libre construido sobre estándares abiertos. Nuestro proceso de desarrollo esta en un continuo período de evaluación por una comunidad de voluntarios y entusiastas. <a href="https://project.crypto.cat" target="_blank">Descubre mas sobre el Proyecto Cryptocat</a>.',
		'project': 'Proyecto',
		'blog': 'Blog',
		'source': 'Fuente',
		'customServer': 'servidor personalizado...',
		'conversationName': 'nombre de la conversación',
		'nickname': 'nombre de usuario',
		'connect': 'conectar',
		'enterConversation': 'Introduce el nombre de una conversación.'
	},
	'loginMessage': {
		'enterConversation': 'Por favor, introduce un nombre de conversación.',
		'conversationAlphanumeric': 'El nombre de la conversación tiene que ser alfanumérico.',
		'enterNickname': 'Por favor, introduce un nombre de usuario.',
		'nicknameAlphanumeric': 'El nombre de usuario tiene que ser alfanumérico.',
		'nicknameInUse': 'El nombre de usuario esta en uso.',
		'authenticationFailure': 'Error de autenticación.',
		'connectionFailed': 'Conexión Fallida.',
		'thankYouUsing': 'Gracias por usar Cryptocat.',
		'registering': 'Registrando...',
		'connecting': 'Conectando...',
		'typeRandomly': 'Por favor, escribe aleatoriamente en tu teclado durante unos segundos.',
		'generatingKeys': 'Generando claves de encriptación...'
	},
	'chatWindow': {
		'groupConversation': 'Conversación de grupo. Pincha en un usuario para una conversación privada.',
		'otrFingerprint': 'Huella OTR (para conversaciones privadas):',
		'groupFingerprint': 'Huella para conversaciones en grupo:',
		'statusAvailable': 'Estado: Disponible',
		'statusAway': 'Estado: Ausente',
		'myInfo': 'Mi información',
		'desktopNotificationsOn': 'Notificaciones de Escritorio activadas',
		'desktopNotificationsOff': 'Notificaciones de Escritorio desactivadas',
		'audioNotificationsOn': 'Notificaciones de audio activadas',
		'audioNotificationsOff': 'Notificaciones de audio desactivadas',
		'logout': 'Desconectarse',
		'displayInfo': 'Mostrar información',
		'sendEncryptedFile': 'Enviar archivo encriptado',
		'conversation': 'Conversación'
	}
}

language.fa = {
	'language': 'fa',
	'direction': 'rtl',
	'font-family': 'Tahoma, DejaVu, Helvetica, Arial, Verdana',
	'loginWindow': {
		'introHeader': '﻿گفتگوی خصوصی برای تمامی افراد.',
		'introParagraph1': 'کریپتوکت یک پیام‌سان فوری است که شما می‌توانید به راحتی با دوستان خود گفتگوی خصوصی داشته باشید. تمامی پیام‌ها قبل از ترک صفحه‌ی نمایش شما، کدگذاری می‌شوند و قابل مشاهده و خواندن توسط دیگر افراد، از جمله ما نخواهند بود.',
		'introParagraph2': 'کریپتوکت یک نرم‌افزار آزاد بر مبانی استانداردهای باز است. فرآیند توسعه‌ی به صورت مستمر توسط افراد داوطلب و علاقه‌مند مورد آزمایش و بررسی قرار می‌گیرد.'
		+ 'در مورد پروژه‌ی کریپتوکت بیشتر بدانید.',
		'project': 'پروژه',
		'blog': 'وبلاگ',
		'source': 'منبع',
		'customServer': 'سرور سفارشی...',
		'conversationName': 'نام گفتگو',
		'nickname': 'نام مستعار',
		'connect': 'اتصال',
		'enterConversation': 'نام مورد نظر خود برای پیوستن به گفتگو را وارد کنید.'
	},
	'loginMessage': {
		'enterConversation': 'لطفا نام گفتگو را وارد کنید.',
		'conversationAlphanumeric': 'نام گفتگو باید شامل حرف و عدد باشد.',
		'enterNickname': 'لطفا نام مستعار را وارد کنید.',
		'nicknameAlphanumeric': 'نام مستعار باید شامل حرف و عدد باشد.',
		'nicknameInUse': 'این نام مستعار قبلا استفاده شده است.',
		'authenticationFailure': 'تایید رد شده است.',
		'connectionFailed': 'اتصال با مشکل مواجه شده است.',
		'thankYouUsing': 'از شما بابت استفاده از کریپتوکت متشکریم.',
		'registering': 'در حال ثبت‌نام...',
		'connecting': 'در حال اتصال...',
		'typeRandomly': 'لطفا به کمک صفحه کلید، به صورت تصادفی به مدت چند ثانیه تایپ کنید.',
		'generatingKeys': 'در حال ایجاد کلیدهای کدگذاری شده...'
	},
	'chatWindow': {
		'groupConversation': 'گفتگوی گروهی. برای گفتگوی خصوصی، لطفا بر روی نام کاربری کلیک کنید.',
		'otrFingerprint': 'اثر انگشت محرمانه (برای گفتگوهای خصوصی):',
		'groupFingerprint': 'اثر انگشت گفتگوی گروهی:',
		'statusAvailable': 'وضعیت: در دسترس',
		'statusAway': 'وضعیت: در دسترس نیست',
		'myInfo': 'اطلاعات من',
		'desktopNotificationsOn': 'پیغام‌رسان رومیزی فعال',
		'desktopNotificationsOff': 'پیغام‌رسان رومیزی غیرفعال',
		'audioNotificationsOn': 'پیغام‌رسان صوتی فعال',
		'audioNotificationsOff': 'پیغام‌رسان صوتی غیرفعال',
		'logout': 'خروج',
		'displayInfo': 'نمایش اطلاعات',
		'sendEncryptedFile': 'ارسال فایل کدگذاری شده',
		'conversation': 'گفتگو'
	}
}

language.eu = {
	'language': 'eu',
	'direction': 'ltr',
	'font-family': 'Helvetica, Arial, Verdana',
	'loginWindow': {
		'introHeader': '﻿Elkarrizketa pribatuak edonorentzat.',
		'introParagraph1': 'Cryptocat berehalako mezularitza plataforma da, zeinak era errazean lagunekin elkarrizketa pribatuak izatea ahalbidetzen duen. Mezuak zifratu egiten dira ordenagailua utzi baino lehen eta kanpoko inork, gu barne, ikusi ezin ditzan babesten dira.',
		'introParagraph2': 'Cryptocat software librea da, estandar irekien gainean eraikia. Gure garapen prozesua boluntario eta zalez osaturiko komunitate baten ikuskapen jarraitupean dago. <a href="https://project.crypto.cat" target="_blank">Cryptocat proiektuari buruz argibide gehiago</a>.',
		'project': 'Proiektua',
		'blog': 'Blog',
		'source': 'Iturburua',
		'customServer': 'zerbitzari pertsonalizatua...',
		'conversationName': 'elkarrizketa-izena',
		'nickname': 'goitizena',
		'connect': 'konektatu',
		'enterConversation': 'Sartu elkarrizketa baten izena bertara sartzeko.'
	},
	'loginMessage': {
		'enterConversation': 'Sartu elkarrizketa-izena.',
		'conversationAlphanumeric': 'Elkarrizketa-izena letraz eta zenbakiz bakarrik egon daiteke osatuta.',
		'enterNickname': 'Sartu goitizena.',
		'nicknameAlphanumeric': 'Goitizena letraz eta zenbakiz bakarrik egon daiteke osatuta.',
		'nicknameInUse': 'Erabiltzen ari den goitizena.',
		'authenticationFailure': 'Ezin izan da saioa hasi.',
		'connectionFailed': 'Konexioak huts egin du.',
		'thankYouUsing': 'Eskerrik asko Cryptocat erabiltzeagatik.',
		'registering': 'Erregistratzen...',
		'connecting': 'Konektatzen...',
		'typeRandomly': 'Segundu batzuetan, tekleatu ahalik eta era ausazkoenean.',
		'generatingKeys': 'Zifraketa-kodeak sortzen...'
	},
	'chatWindow': {
		'groupConversation': 'Talde-elkarrizketa. Egin klik erabiltzaile baten gainean elkarrizketa pribatua izateko.',
		'otrFingerprint': 'OTR hatz-aztarna (elkarrizketa pribatuetarako):',
		'groupFingerprint': 'Talde elkarrizketaren hatz-aztarna:',
		'statusAvailable': 'Egoera: eskuragarri',
		'statusAway': 'Egoera: kanpoan',
		'myInfo': 'Nire Informazioa',
		'desktopNotificationsOn': 'Mahaigaineko jakinarazpenak gaituta',
		'desktopNotificationsOff': 'Mahaigaineko jakinarazpenak desgaituta',
		'audioNotificationsOn': 'Soinu jakinarazpenak gaituta',
		'audioNotificationsOff': 'Soinu jakinarazpenak desgaituta',
		'logout': 'Saioa itxi',
		'displayInfo': 'Erakutsi informazioa',
		'sendEncryptedFile': 'Bidali fitxategi zifratua',
		'conversation': 'Elkarrizketa'
	}
}

language.cs = {
	'language': 'cs',
	'direction': 'ltr',
	'font-family': 'Helvetica, Arial, Verdana',
	'loginWindow': {
		'introHeader': '﻿Soukromý pokec pro všechny.',
		'introParagraph1': 'Cryptocat je instantní komunikační platforma, která umožňuje soukromé rozhovory s přáteli. Zprávy jsou šifrovány před odesláním z Vaší obrazovky a jsou chráněny před prohlížením jakoukoli třetí stranou, včetně nás.',
		'introParagraph2': 'Cryptocat je gratis software postavený na standardech open software. Náš vývojový proces je pod konstantním dohledem společenstva dobrovolníků a nadšenců. <a href="https://project.crypto.cat" target="_blank">Přečtěte si více o projektu Cryptocat</a>.',
		'project': 'Projekt',
		'blog': 'Blog',
		'source': 'Zdroj',
		'customServer': 'vlastní server...',
		'conversationName': 'jméno pokecu',
		'nickname': 'přezdívka',
		'connect': 'připojit',
		'enterConversation': 'Zadejte jméno pokecu ke kterému se chcete připojit.'
	},
	'loginMessage': {
		'enterConversation': 'Zadejte jméno pokecu.',
		'conversationAlphanumeric': 'Jméno pokecu musí být alfanumerické.',
		'enterNickname': 'Zadejte přezdívku.',
		'nicknameAlphanumeric': 'Přezdívka musí být alfanumerická.',
		'nicknameInUse': 'Přezdívka je již užita.',
		'authenticationFailure': 'Ověření selhalo.',
		'connectionFailed': 'Připojení selhalo.',
		'thankYouUsing': 'Děkujeme, že používáte Cryptocat.',
		'registering': 'Registruji...',
		'connecting': 'Připojuji...',
		'typeRandomly': 'Ťukejte na klávesnici mnoho náhodných znaků po dobu několika sekund.',
		'generatingKeys': 'Generuji šifrovací klíče...'
	},
	'chatWindow': {
		'groupConversation': 'Skupinový pokec. Klikněte na uživatele pro soukromý pokec.',
		'otrFingerprint': 'OTR fingerprint (pro soukromý pokec):',
		'groupFingerprint': 'Fingerprint skupinového pokecu:',
		'statusAvailable': 'Status: k dispozici',
		'statusAway': 'Status: pryčn',
		'myInfo': 'Moje info',
		'desktopNotificationsOn': 'Desktopová oznámení zapnuta',
		'desktopNotificationsOff': 'Desktopová oznámení vypnuta',
		'audioNotificationsOn': 'Zvuková oznámení zapnuta',
		'audioNotificationsOff': 'Zvuková oznámení vypnuta',
		'logout': 'Odhlásit',
		'displayInfo': 'ukázat data',
		'sendEncryptedFile': 'poslat šifrovaný soubor',
		'conversation': 'Pokec'
	}
}

language.de = {
	'language': 'de',
	'direction': 'ltr',
	'font-family': 'Helvetica, Arial, Verdana',
	'loginWindow': {
		'introHeader': '﻿Privates Chatten für alle.',
		'introParagraph1': 'Cryptocat ist eine Instant-Messaging Plattform, die dir erlaubt, private Konversationen mit Freunden zu führen. Die Nachrichten werden noch vor dem Absenden verschlüsselt und sind somit vor Fremden geschützt und nicht mal wir können sie lesen.',
		'introParagraph2': 'Cryptocat ist Freie Software, die auf offenen Standards basiert. Unser Entwicklungsprozess wird ständig von einer Gemeinschaft freiwilliger Interessenten überprüft. <a href="https://project.crypto.cat" target="_blank">Finde mehr über das Cryptocat Projekt heraus</a>.',
		'project': 'Projekt',
		'blog': 'Blog',
		'source': 'Quelltext',
		'customServer': 'benutzerdefinierter server...',
		'conversationName': 'name der konversation',
		'nickname': 'nickname',
		'connect': 'verbinden',
		'enterConversation': 'Tippe den Namen einer Konversation ein, um ihr beizutreten.'
	},
	'loginMessage': {
		'enterConversation': 'Bitte einen Namen für die Konversation eingeben.',
		'conversationAlphanumeric': 'Konversationsname muss alphanumerisch sein.',
		'enterNickname': 'Bitte einen Nicknamen eingeben.',
		'nicknameAlphanumeric': 'Nickname muss alphanumerisch sein.',
		'nicknameInUse': 'Nickname wird bereits verwendet.',
		'authenticationFailure': 'Authentifikationsfehler.',
		'connectionFailed': 'Verbindung fehlgeschlagen.',
		'thankYouUsing': 'Danke, dass Sie Cryptocat verwenden.',
		'registering': 'Registriere...',
		'connecting': 'Verbinde...',
		'typeRandomly': 'Schreibe bitte, einige Sekunden lang, möglichst wirres Zeug auf deiner Tastatur.',
		'generatingKeys': 'Generiere Schlüssel...'
	},
	'chatWindow': {
		'groupConversation': 'Gruppenchat. Klicke auf einen Nutzer, um privat zu chatten.',
		'otrFingerprint': 'OTR Fingerabdruck (für private Konversationen):',
		'groupFingerprint': 'Fingerabdruck des Gruppenchats',
		'statusAvailable': 'Status: Verfügbar',
		'statusAway': 'Status: Abwesend',
		'myInfo': 'Meine Infos',
		'desktopNotificationsOn': 'Desktop Benachrichtigungen: Ein',
		'desktopNotificationsOff': 'Desktop Benachrichtigungen: Aus',
		'audioNotificationsOn': 'Audio Benachrichtigungen: Ein',
		'audioNotificationsOff': 'Audio Benachrichtigungen: Aus',
		'logout': 'Ausloggen',
		'displayInfo': 'Zeige Info',
		'sendEncryptedFile': 'Datei verschlüsselt senden',
		'conversation': 'Konversation'
	}
}

language.el = {
	'language': 'el',
	'direction': 'ltr',
	'font-family': 'Helvetica, Arial, Verdana',
	'loginWindow': {
		'introHeader': '﻿Ιδιωτικές Συνομιλίες για Όλους.',
		'introParagraph1': 'Cryptocat είναι μια πλατφόρμα άμεσων μηνυμάτων που σας επιτρέπει με εύκολο τρόπο να συνομιλείτε ιδιωτικά με φίλους. Τα μηνύματα κρυπτογραφούνται πριν εγκαταλείψουν την οθόνη σας και η θέασή τους προστατεύεται από τρίτους, ακόμα κι από εμάς.',
		'introParagraph2': 'Cryptocat είναι ελεύθερο λογισμικό βασισμένο σε ανοιχτά πρότυπα. Η διαδικασία ανάπτυξης που ακολουθούμε εξετάζεται συνεχώς από μια κοινότητα εθελοντών και θιασωτών. <a href="https://project.crypto.cat" target="_blank">Μάθετε περισσότερα για το Cryptocat Project</a>.',
		'project': 'Πρότζεκτ',
		'blog': 'Blog',
		'source': 'Πηγή',
		'customServer': 'Προσωπικός διακομιστής...',
		'conversationName': 'όνομα συνομιλίας',
		'nickname': 'ψευδώνυμο',
		'connect': 'σύνδεση',
		'enterConversation': 'Εισάγετε το όνομα μιας συνομιλίας για να συνδεθείτε.'
	},
	'loginMessage': {
		'enterConversation': 'Παρακαλώ εισάγετε όνομα για τη συνομιλία.',
		'conversationAlphanumeric': 'Το όνομα της συζήτησης πρέπει να αποτελείται απο αλφαριθμητικούς χαρακτήρες.',
		'enterNickname': 'Παρακαλώ εισάγετε ένα ψευδώνυμο.',
		'nicknameAlphanumeric': 'Το ψευδώνυμο πρέπει να αποτελείται απο αλφαριθμητικούς χαρακτήρες.',
		'nicknameInUse': 'Το ψευδώνυμο χρησιμοποιείται ήδη.',
		'authenticationFailure': 'Αποτυχία πιστοποίησης.',
		'connectionFailed': 'Αποτυχία σύνδεσης.',
		'thankYouUsing': 'Ευχαριστούμε που χρησιμοποιείτε το Cryptocat.',
		'registering': 'Εγγραφή...',
		'connecting': 'Σύνδεση...',
		'typeRandomly': 'Παρακαλώ πληκτρολογήστε όσο το δυνατό πιο τυχαίους χαρακτήρες στο πληκτρολόγιό σας για λίγο.',
		'generatingKeys': 'Δημιουργία κρυπτογραφικών κλειδιών...'
	},
	'chatWindow': {
		'groupConversation': 'Ομαδική συνομιλία. Κάντε κλικ σε κάποιο χρήστη για ιδιωτική συζήτηση.',
		'otrFingerprint': 'Αποτύπωμα OTR (για προσωπικές συνομιλίες):',
		'groupFingerprint': 'Αποτύπωμα ομαδικής συνομιλίας:',
		'statusAvailable': 'Κατάσταση: Διαθέσιμος/η',
		'statusAway': 'Κατάσταση: Απομακρυσμένος/η',
		'myInfo': 'Οι πληροφορίες μου',
		'desktopNotificationsOn': 'Ειδοποιήσεις οθόνης Ενεργοποιημένες',
		'desktopNotificationsOff': 'Ειδοποιήσεις οθόνης Απενεργοποιημένες',
		'audioNotificationsOn': 'Ηχητικές ειδοποιήσεις Ενεργοποιημένες',
		'audioNotificationsOff': 'Ηχητικές ειδοποιήσεις Απενεργοποιημένες',
		'logout': 'Αποσύνδεση',
		'displayInfo': 'Προβολή Πληροφοριών',
		'sendEncryptedFile': 'Αποστολή κρυπτογραφημένου αρχείου',
		'conversation': 'Συνομιλία'
	}
}

language.nl = {
	'language': 'nl',
	'direction': 'ltr',
	'font-family': 'Helvetica, Arial, Verdana',
	'loginWindow': {
		'introHeader': 'Privé Conversaties voor Iedereen.',
		'introParagraph1': 'Cryptocat is een instant messaging platform welke u gemakkelijk privé conversaties met vrienden laat hebben. Berichten worden versleuteld voordat u uw scherm verlaat en zijn beschermd tegen het afluisteren door derden, zelfs door ons.',
		'introParagraph2': 'Cryptocat is vrije software gebaseerd op open standaarden. De ontwikkeling van Cryptocat is onder voortdurend toezicht van een gemeenschap van vrijwilligers en enthousiastelingen. <a href="https://project.crypto.cat" target="_blank">Leer meer over het Cryptocat Project</a>.',
		'project': 'Project',
		'blog': 'Blog',
		'source': 'Broncode',
		'customServer': 'andere server...',
		'conversationName': 'naam conversatie',
		'nickname': 'gebruikersnaam',
		'connect': 'verbind',
		'enterConversation': 'Voer de naam in van de conversatie die u wilt betreden.'
	},
	'loginMessage': {
		'enterConversation': 'Voer alstublieft een conversatie naam in.',
		'conversationAlphanumeric': 'Conversatienaam moet alfanumeriek zijn.',
		'enterNickname': 'Voer alstublieft een gebruikersnaam in.',
		'nicknameAlphanumeric': 'Gebruikersnaam moet alfanumeriek zijn.',
		'nicknameInUse': 'Gebruikersnaam in gebruik.',
		'authenticationFailure': 'Authentificatie mislukt.',
		'connectionFailed': 'Verbinding mislukt.',
		'thankYouUsing': 'Bedankt voor het gebruiken van Cryptocat.',
		'registering': 'Aan het registreren...',
		'connecting': 'Aan het verbinden...',
		'typeRandomly': 'Typt u alstublieft zo willekeurig mogelijk op uw toetsenbord gedurende enkele seconden.',
		'generatingKeys': 'Encryptie sleutels aan het genereren...'
	},
	'chatWindow': {
		'groupConversation': 'Groepsconversatie. Klik op een gebruiker voor een privé gesprek.',
		'otrFingerprint': 'OTR vingerafdruk (voor privé conversaties):',
		'groupFingerprint': 'Vingerafdruk groepsconversatie:',
		'statusAvailable': 'Status: Beschikbaar',
		'statusAway': 'Status: Afwezig',
		'myInfo': 'Mijn Info',
		'desktopNotificationsOn': 'Desktop Notificaties Aan',
		'desktopNotificationsOff': 'Desktop Notificaties Uit',
		'audioNotificationsOn': 'Audio Notificaties Aan',
		'audioNotificationsOff': 'Audio Notificaties Uit',
		'logout': 'Uitloggen',
		'displayInfo': 'Toon Info',
		'sendEncryptedFile': 'Verstuur versleuteld bestand',
		'conversation': 'Conversatie'
	}
}

language.pt = {
	'language': 'pt',
	'direction': 'ltr',
	'font-family': 'Helvetica, Arial, Verdana',
	'loginWindow': {
		'introHeader': 'Conversa privada para todos.',
		'introParagraph1': 'Cryptocat é uma plataforma de mensagens instantâneas que permite que você tenha conversas privadas com seus amigos. As mensagens são criptografadas antes de sair do seu computador e são protegidas de serem vistas por terceiros, até de nós.',
		'introParagraph2': 'Cryptocat é um software livre construído com padrões abertos. Nosso processo de desenvolvimento está sob examinação contínua por uma comunidade de voluntários e entusiastas. <a href="https://project.crypto.cat" target="_blank">Aprenda mais sobre o Projeto Cryptocat</a>.',
		'project': 'Projeto',
		'blog': 'Blog',
		'source': 'Código',
		'customServer': 'servidor personalizado...',
		'conversationName': 'nome da conversa',
		'nickname': 'nickname',
		'connect': 'conectar',
		'enterConversation': 'Digite o nome da conversa para participar.'
	},
	'loginMessage': {
		'enterConversation': 'Digite um nome da conversa, por favor.',
		'conversationAlphanumeric': 'O nome da conversa tem de ser alfa numérico.',
		'enterNickname': 'Digite um nome, por favor.',
		'nicknameAlphanumeric': 'O nickname tem de ser alfanumérico.',
		'nicknameInUse': 'Nickname em uso.',
		'authenticationFailure': 'A autenticação falhou.',
		'connectionFailed': 'Coneção falhou.',
		'thankYouUsing': 'Obrigado por ter usado Cryptocat.',
		'registering': 'Registrando...',
		'connecting': 'Conectando...',
		'typeRandomly': 'Por favor, digite caracteres aleatórios no seu teclado por alguns segundos.',
		'generatingKeys': 'Gerando chaves criptográficas...'
	},
	'chatWindow': {
		'groupConversation': 'Conversa em grupo. Clique em um usuário para iniciar uma conversa privada.',
		'otrFingerprint': 'Impressao digital OTR ( para conversas privadas):',
		'groupFingerprint': 'Impressão digital de conversa de grupo:',
		'statusAvailable': 'Status: Disponível',
		'statusAway': 'Status: Ausente',
		'myInfo': 'Minhas informações',
		'desktopNotificationsOn': 'Notificações no desktop ligadas',
		'desktopNotificationsOff': 'Notificações no desktop desligadas',
		'audioNotificationsOn': 'Notificações por audio ligadas',
		'audioNotificationsOff': 'Notificações por audio desligadas',
		'logout': 'Sair',
		'displayInfo': 'Exibir informações',
		'sendEncryptedFile': 'Enviar arquivo criptografado',
		'conversation': 'Conversa'
	}
}

language.ru = {
	'language': 'ru',
	'direction': 'ltr',
	'font-family': 'Helvetica, Arial, Verdana',
	'loginWindow': {
		'introHeader': 'Частные беседы для всех.',
		'introParagraph1': 'Cryptocat - это платформа обмена мнгновенными сообщениями, которая позволяет вам приватно общаться с вашими друзьями. Сообщения зашифрованы и защищены от просмотра посторонними людьми, даже разработчиками.',
		'introParagraph2': 'Cryptocat - это свободное программное обеспечение, основанное на открытых стандартах. Наш процесс разработки ведется постоянным контролем сообщества добровольцев и энтузиастов. <a href="https://project.crypto.cat" target="_blank">Узнать больше про проект Cryptocat</a>.',
		'project': 'Проект',
		'blog': 'Блог',
		'source': 'Источник',
		'customServer': 'Подключиться к другому серверу...',
		'conversationName': 'имя для разговора',
		'nickname': 'имя пользователя',
		'connect': 'соединиться',
		'enterConversation': 'Введите название разговора, к которому нужно присоединиться.'
	},
	'loginMessage': {
		'enterConversation': 'Пожалуйста, введите название разговора.',
		'conversationAlphanumeric': 'Имя для разговора должно содержать только буквы или цифры.',
		'enterNickname': 'Пожалуйста, введите имя пользователя.',
		'nicknameAlphanumeric': 'Имя пользователя должно содержать только буквы или цифры.',
		'nicknameInUse': 'Это имя пользователя уже используется.',
		'authenticationFailure': 'Ошибка авторизации.',
		'connectionFailed': 'Ошибка подключения.',
		'thankYouUsing': 'Спасибо за использование Cryptocat.',
		'registering': 'Регистрация...',
		'connecting': 'Соединение...',
		'typeRandomly': 'Пожалуйста, нажимайте случайные клавиши несколько секунд.',
		'generatingKeys': 'Генерация ключей шифрования... '
	},
	'chatWindow': {
		'groupConversation': 'Групповой разговор. Нажмите на имя пользователя для начала приватной беседы.',
		'otrFingerprint': 'Отпечаток OTR (для приватных бесед)',
		'groupFingerprint': 'Отпечаток многопользовательского чата',
		'statusAvailable': 'Статус: Доступен',
		'statusAway': 'Статус: Нет на месте',
		'myInfo': 'Моя информация',
		'desktopNotificationsOn': 'Браузерные уведомления включены',
		'desktopNotificationsOff': 'Браузерные уведомления выключены',
		'audioNotificationsOn': 'Аудио уведомления включены',
		'audioNotificationsOff': 'Аудио уведомления выключены',
		'logout': 'Выйти',
		'displayInfo': 'Отобразить информацию',
		'sendEncryptedFile': 'Отправить зашифрованный файл',
		'conversation': 'Разговор'
	}
}

language.sv = {
	'language': 'sv',
	'direction': 'ltr',
	'font-family': 'Helvetica, Arial, Verdana',
	'loginWindow': {
		'introHeader': 'Privata konversationer för alla.',
		'introParagraph1': 'Cryptocat är en plattform för direktkommunikation som enkelt ger dig möjlighet till privata konversationer med dina vänner. Meddelanden är krypterade innan de lämnar din skärm och är skyddade för insyn av all tredjepart, även oss.',
		'introParagraph2': 'Cryptopcat är en öppen mjukvara byggd på öppna standarder. Vår utvecklingsprocess är under kontinuerlig övervakning av en community bestående av volontärer och entusiaster. <a href="https://project.crypto.cat" target="_blank">Lär dig mer om Cryptocat Projektet</a>.',
		'project': 'Projekt',
		'blog': 'Blogg',
		'source': 'Källa',
		'customServer': 'egen server...',
		'conversationName': 'konversationsnamn',
		'nickname': 'smeknamn',
		'connect': 'ansluta',
		'enterConversation': 'Skriv in namnet på den konversation du vill delta i.'
	},
	'loginMessage': {
		'enterConversation': 'Vänligen skriv in ett konversationsnamn.',
		'conversationAlphanumeric': 'Konversationsnamnet måste vara alfanumeriskt.',
		'enterNickname': 'Vänligen skriv in ett smeknamn.',
		'nicknameAlphanumeric': 'Smeknamnet måste vara alfanumeriskt.',
		'nicknameInUse': 'Smeknamnet användas redan.',
		'authenticationFailure': 'Autentiseringsfel.',
		'connectionFailed': 'Anslutning misslyckades.',
		'thankYouUsing': 'Tack för att du använder Cryptocat.',
		'registering': 'Registrerar...',
		'connecting': 'Ansluter...',
		'typeRandomly': 'Vänligen skriv in slumpmässiga tecken på ditt tangentbord under ett par sekunder.',
		'generatingKeys': 'Genererar krypteringsnycklar...'
	},
	'chatWindow': {
		'groupConversation': 'Gruppkonversation. Klicka på en användare för privat chatt.',
		'otrFingerprint': 'OTR fingeravtryck (för privata konversationer):',
		'groupFingerprint': 'Gruppkonversation fingeravtryck:',
		'statusAvailable': 'Status: Tillgänglig',
		'statusAway': 'Status: Frånvarande',
		'myInfo': 'Min information',
		'desktopNotificationsOn': 'Skrivbordsnotifieringar På',
		'desktopNotificationsOff': 'Skrivbordsnotifieringar Av',
		'audioNotificationsOn': 'Ljudnotifikationer På',
		'audioNotificationsOff': 'Ljudnotifikationer Av',
		'logout': 'Logga ut',
		'displayInfo': 'Visa information',
		'sendEncryptedFile': 'Skicka krypterad fil',
		'conversation': 'Konversation'
	}
}

language.pl = {
	'language': 'pl',
	'direction': 'ltr',
	'font-family': 'Helvetica, Arial, Verdana',
	'loginWindow': {
		'introHeader': 'Prywatne rozmowy dla każdego.',
		'introParagraph1': 'Cryptocat jest platformą do błyskawicznej komunikacji, która pozwala prowadzić prywatne rozmowy z przyjaciółmi w prosty sposób. Wiadomości są szyfrowane jeszcze zanim je wyślesz i są chronione przed osobami trzecimi, nawet przed nami.',
		'introParagraph2': 'Cryptocat jest darmowym oprogramowaniem opartym na otwartych standardach. Nasz proces rozwoju jest pod ciągłą kontrolą ochotników i entuzjastów. <a href="https://project.crypto.cat" target="_blank">Dowiedz się więcej o projekcie Cryptocat</a>.',
		'project': 'Projekt',
		'blog': 'Blog',
		'source': 'Źródło',
		'customServer': 'serwer klienta...',
		'conversationName': 'nazwa rozmowy',
		'nickname': 'pseudonim',
		'connect': 'połącz',
		'enterConversation': 'Wpisz nazwę rozmowy, do której chcesz dołączyć.'
	},
	'loginMessage': {
		'enterConversation': 'Proszę wpisać nazwę rozmowy.',
		'conversationAlphanumeric': 'Nazwa rozmowy może być tylko alfanumeryczna.',
		'enterNickname': 'Proszę o podanie pseudonimu.',
		'nicknameAlphanumeric': 'Pseudonim może być tylko alfanumeryczny.',
		'nicknameInUse': 'Pseudonim jest w użyciu.',
		'authenticationFailure': 'Błąd uwierzytelniania.',
		'connectionFailed': 'Połączenie nieudane.',
		'thankYouUsing': 'Dzięki, że  skorzystałeś z Cryptocata.',
		'registering': 'Rejestruję...',
		'connecting': 'Łączę...',
		'typeRandomly': 'Proszę losowo pisać na klawiaturze przez kilka sekund.',
		'generatingKeys': 'Generuję klucze szyfrujące...'
	},
	'chatWindow': {
		'groupConversation': 'Rozmowa grupowa. Kliknij na użytkownika, aby porozmawiać prywatnie.',
		'otrFingerprint': 'Klucz OTR (dla prywatnych rozmów):',
		'groupFingerprint': 'Klucz rozmowy grupowej:',
		'statusAvailable': 'Status: Dostępny',
		'statusAway': 'Status: Nieobecny',
		'myInfo': 'O mnie',
		'desktopNotificationsOn': 'Powiadomienia ekranowe włączone',
		'desktopNotificationsOff': 'Powiadomienia ekranowe wyłączone',
		'audioNotificationsOn': 'Powiadomienia dźwiękowe włączone',
		'audioNotificationsOff': 'Powiadomienia dźwiękowe wyłączone',
		'logout': 'Wyloguj',
		'displayInfo': 'Wyświetl informacje',
		'sendEncryptedFile': 'Wyślij zaszyfrowany plik',
		'conversation': 'Rozmowa'
	}
}

language.he = {
	'language': 'he',
	'direction': 'rtl',
	'font-family': 'Helvetica, Arial, Verdana',
	'loginWindow': {
		'introHeader': 'שיחות חופשיות לכולם.',
		'introParagraph1': 'Cryptocat היא פלטפורמת מסרים מידיים שמאפשרת לך לנהל שיחות פרטיות עם חברים בקלות. ההודעות מוצפנות לפני עזיבת המסך שלך ומוגנות מצפיה על ידי צד שלישי, אפילו מאיתנו.',
		'introParagraph2': 'Cryptocat היא תוכנה חופשית ובנויה על סטנדרטים פתוחים. תהליך הפיתוח שלנו נמצא תחת בקרה מתמשכת על ידי קהילה של מתנדבי <a href="https://project.crypto.cat" target="_blank">ם. קראו עוד על פרוייקט Cryptocat</a>.',
		'project': 'פרוייקט',
		'blog': 'בלוג',
		'source': 'מקור',
		'customServer': 'שרת מותאם אישית ...',
		'conversationName': 'שם השיחה',
		'nickname': 'כינוי',
		'connect': 'התחבר',
		'enterConversation': 'מלאו שם שיחה על מנת להצטרף'
	},
	'loginMessage': {
		'enterConversation': 'נא למלא שם שיחה',
		'conversationAlphanumeric': 'שם השיחה חייב לכלול אותיות ומספרים בלבד.',
		'enterNickname': 'נא למלא כינוי',
		'nicknameAlphanumeric': 'הכינוי חייב לכלול אותיות ומספרים בלבד.',
		'nicknameInUse': 'הכינוי נמצא בשימוש.',
		'authenticationFailure': 'שגיאה בהזדהות.',
		'connectionFailed': 'חיבור נכשל.',
		'thankYouUsing': 'תודה שהשתמשת בCryptocat.',
		'registering': 'נרשם...',
		'connecting': 'מתחבר...',
		'typeRandomly': 'אנא הקלידו בצורה אקראית למשך מספר שניות.',
		'generatingKeys': 'מייצר מפתחות הצפנה...'
	},
	'chatWindow': {
		'groupConversation': 'שיחה קבוצתית. לחצו על משתמש לשיחה פרטית.',
		'otrFingerprint': 'חתימת OTR (לשיחות פרטיות):',
		'groupFingerprint': 'חתימת שיחה קבוצתית:',
		'statusAvailable': 'מצב: זמין',
		'statusAway': 'מצב: לא זמין',
		'myInfo': 'הפרטים שלי',
		'desktopNotificationsOn': 'התראות שולחן עבודה פעילות',
		'desktopNotificationsOff': 'התראות שולחן עבודה מבוטלות',
		'audioNotificationsOn': 'התראות קוליות פעילות',
		'audioNotificationsOff': 'התראות קוליות מבוטלות',
		'logout': 'יציאה',
		'displayInfo': 'הצג מידע',
		'sendEncryptedFile': 'שלח קובץ מוצפן',
		'conversation': 'שיחה'
	}
}

language.zh = {
	'language': 'zh',
	'direction': 'ltr',
	'font-family': '"Microsoft Yahei", "微软雅黑", Tahoma, Helvetica, Arial, sans-serif, STXihei, "华文细黑"',
	'loginWindow': {
		'introHeader': '为每个人的私人谈话',
		'introParagraph1': 'Cryptocat是一個即時通訊平台，可以讓你輕鬆擁有朋友的私人談話，並會在你離開你的屏幕時對訊息進行加密，好讓防止任何第三者查看，包括我們。',
		'introParagraph2': 'Cryptocat是建立在開放標準的免費軟件。我們的開發過程是由社區志願者和愛好者進行持續的檢測。了解更多 <a href="https://project.crypto.cat" target="_blank">Cryptocat的項目。</a>',
		'project': '项目',
		'blog': '博客',
		'source': '源',
		'customServer': '自定義服務器...',
		'conversationName': '会话名称',
		'nickname': '昵称',
		'connect': '连接',
		'enterConversation': '请输会话名称加入'
	},
	'loginMessage': {
		'enterConversation': '请输一下会话名称',
		'conversationAlphanumeric': '交谈必须是字母或数字',
		'enterNickname': '请输一下请输',
		'nicknameAlphanumeric': '昵称必须是字母或数字',
		'nicknameInUse': '昵称已经用过了',
		'authenticationFailure': '身份验证失败',
		'connectionFailed': '驗證失敗。',
		'thankYouUsing': '谢谢你用Cryptocat',
		'registering': '注册。。。',
		'connecting': '连接。。。',
		'typeRandomly': '請隨意在鍵盤上按鍵幾秒鐘。',
		'generatingKeys': '生成加密密鑰...'
	},
	'chatWindow': {
		'groupConversation': '群組對話。請點擊一個私人聊天的用戶。',
		'otrFingerprint': 'OTR指紋（私人對話）：',
		'groupFingerprint': '群組對話紀錄：',
		'statusAvailable': '状态：上线',
		'statusAway': '状态：离开',
		'myInfo': '我的信息',
		'desktopNotificationsOn': '桌面通知开了',
		'desktopNotificationsOff': '桌面通知关机了',
		'audioNotificationsOn': '音频通知开了',
		'audioNotificationsOff': '音频通知关机了',
		'logout': '退出',
		'displayInfo': '顯示信息',
		'sendEncryptedFile': '发加密的文件',
		'conversation': '交谈'
	}
}

language['zh-tw'] = language.zh;
language['zh-hk'] = language.zh;
language['zh-cn'] = language.zh;
language['zh-sg'] = language.zh;


})();