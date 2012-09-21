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
		'logout': 'Disconnect',
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


})();