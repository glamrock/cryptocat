var understood;
$("#welcome").submit( function() {
	$("#c").val($("#c").val().toLowerCase());
	if (understood) {
		return true;
	}
	else if (!$("#c").val().match(/^\w+$/)) {
		$("#c").val(lettersonly);
		idSelect("c");
		return false;
	}
	else {
		$("#front").fadeIn();
		$(window).keypress(function(e) {
			if (e.keyCode == 13) {
				$("#understand").click();
			}
		});
		return false;
	}
});

$("#understand").click(function(){
	understood = 1;
	$("#welcome").submit();
});

var td1 = $("#td1").html();
var td2 = $("#td2").html();
var td3 = $("#td3").html();
var notice = $("#notice").html();
var bottom = $("#lang").html();
var notetext = $("#notetext").html();
var understand = $("#understand").val();
var name = $("#c").val();
var create = $("#create").val();
var lettersonly = "letters and numbers only";

function translate(language) {
	if (language == "ca") {
		$("#td1").html("<strong>Cryptocat</strong> li permet crear instantàniament converes segures i encriptades. Es tracta d'una alternativa de codi obert als serveis invasius, com ara el xat de Facebook.");
		$("#td2").html("Els missatges són xifrats dins el seu navegador utilitzant AES-256 i claus asimètriques de 4096 bits. Les converses són totalment eliminades després d'una hora d'inactivitat.");
		$("#td3").html('Cryptocat és totalment compatible amb <a target="_blank" href="https://torproject.org">Tor</a> i també funciona en iPhone, Android i BlackBerry.');
		$("#lang").html('<a href="#" onclick="translate(\'fr\')">fr</a> <a href="#" onclick="translate(\'en\')">en</a> <a href="#" onclick="translate(\'eu\')">eu</a> <a href="#" onclick="translate(\'it\')">it</a> <a href="#" onclick="translate(\'de\')">de</a> <a href="#" onclick="translate(\'pt\')">pt</a> <a href="#" onclick="translate(\'ru\')">ru</a> <a href="#" onclick="translate(\'sv\')">sv</a>');
		$("#notetext").html('Cryptocat ofereix un sistema d\'encriptació segur, però no és motiu per reemplaçar una forta cultura de seguretat. Podeu instalar l\'aplicació <a href="https://chrome.google.com/webstore/detail/gonbigodpnfghidmnphnadhepmbabhij" target="_blank">Cryptocat per Google Chrome</a> com a extra de seguretat i penseu responsablement a l\'hora d\'usarlo en situacions compromeses.');
		$("#understand").val("Ho entenc");
		$("#c").val("anomena el teu xat");
		$("#create").val("entrar");
		lettersonly = "unicament lletres i números";
	}
	else if (language == "fr") {
		$("#td1").html("<strong>Cryptocat</strong> vous laisse mettre en place des conversations sécurisées. C'est une alternative open source et privée à d'autres services tel que Facebook Chat.");
		$("#td2").html("Les messages sont cryptés à l'intérieur de votre navigateur avec AES-256 et des clefs asymétriques 4096-bit. Toutes conversations sont effacés après une heure d'inactivité.");
		$("#td3").html('Cryptocat est entièrement compatible avec <a target="_blank" href="https://torproject.org">Tor</a> et travaille aussi sur votre iPhone, Android et BlackBerry.');
		$("#lang").html('<a href="#" onclick="translate(\'en\')">en</a> <a href="#" onclick="translate(\'ca\')">ca</a> <a href="#" onclick="translate(\'eu\')">eu</a> <a href="#" onclick="translate(\'it\')">it</a> <a href="#" onclick="translate(\'de\')">de</a> <a href="#" onclick="translate(\'pt\')">pt</a> <a href="#" onclick="translate(\'ru\')">ru</a> <a href="#" onclick="translate(\'sv\')">sv</a>');
		$("#notetext").html('Cryptocat fournit des communications fortement cryptés, mais n\'est pas un remplacement d\'une culture de sécurité forte. Envisagez l\'installation de l\'application <a href="https://chrome.google.com/webstore/detail/gonbigodpnfghidmnphnadhepmbabhij" target="_blank">Cryptocat pour Google Chrome</a> pour plus de sécurité, et pensez responsablement si vous êtes dans des situations extrêmes.');
		$("#understand").val("Je comprends");
		$("#c").val("nom de la conversation");
		$("#create").val("entrer");
		lettersonly = "lettres et chiffres seulement";
	}
	else if (language == "eu") {
		$("#td1").html("<strong>Cryptocat</strong>-ek elkarrizketa seguruak momentuan eratzea ahalbidetzen du. Facebook-eko txataren moduko zerbitzuen alternatiba pribatu, zifratu eta kode-irekikoa da.");
		$("#td2").html("Mezuak AES-256 eta 4096 biteko gako asimetrikoak erabiliz zifratzen dira. Elkarrizketak era seguruan ezabatzen dira haietan jardunik gabeko ordu bat igaro ondoren.");
		$("#td3").html('Cryptocat guztiz bateragarria da <a target="_blank" href="https://torproject.org">Tor</a>-ekin eta zure iPhone, Android edo BlackBerry-an ere badabil.');
		$("#lang").html('<a href="#" onclick="translate(\'fr\')">fr</a> <a href="#" onclick="translate(\'ca\')">ca</a> <a href="#" onclick="translate(\'en\')">en</a> <a href="#" onclick="translate(\'it\')">it</a> <a href="#" onclick="translate(\'de\')">de</a> <a href="#" onclick="translate(\'pt\')">pt</a> <a href="#" onclick="translate(\'ru\')">ru</a> <a href="#" onclick="translate(\'sv\')">sv</a>');
		$("#notetext").html('Cryptocat-ek zifraketa sendoa eskaintzen du, baina ez da segurtasun kultura sendo baten ordezkoa. Segurtasun gehiagorako, <a href="https://chrome.google.com/webstore/detail/gonbigodpnfghidmnphnadhepmbabhij" target="_blank">Google Chrome-rako Cryptocat aplikazioa</a> instalatzea kontuan har ezazu eta jokatu arduraz egoera larriren batean bazaude.');
		$("#understand").val("Ulertzen dut");
		$("#c").val("izendatu zure elkarrizketa");
		$("#create").val("sartu");
		lettersonly = "letrak eta zenbakiak soilik";
	}
	else if (language == "it") {
		$("#td1").html("<strong>Cryptocat</strong> ti permette di impostare istantaneamente conversazioni sicure. E' un servizio privato, crittografato, open source, alternativo ad altri servizi come la chat di Facebook.");
		$("#td2").html("I messaggi sono crittografati all'interno del tuo browser usando chiavi asimmetriche AES-256 a 4069-bit. Le tue conversazioni sono cancellate in modo sicuro dopo un'ora di inattività.");
		$("#td3").html('Cryptocat è completamente compatibile con <a target="_blank" href="https://torproject.org">Tor</a> e funziona anche sul tuo smartphone iPhone, Android e BlackBerry.');
		$("#lang").html('<a href="#" onclick="translate(\'fr\')">fr</a> <a href="#" onclick="translate(\'ca\')">ca</a> <a href="#" onclick="translate(\'eu\')">eu</a> <a href="#" onclick="translate(\'en\')">en</a> <a href="#" onclick="translate(\'de\')">de</a> <a href="#" onclick="translate(\'pt\')">pt</a> <a href="#" onclick="translate(\'ru\')">ru</a> <a href="#" onclick="translate(\'sv\')">sv</a>');
		$("#notetext").html('Cryptocat fornisce la crittografia forte, ma non è una sostituzione di una cultura della sicurezza forte. Considera l\'installazione di <a href="https://chrome.google.com/webstore/detail/gonbigodpnfghidmnphnadhepmbabhij" target="_blank">Cryptocat per Google Chrome</a> per una maggiore sicurezza e pensa sempre responsabilmente se ti trovi in situazioni gravi.');
		$("#understand").val("Sono consapevole");
		$("#c").val("nome della conversazione");
		$("#create").val("entra");
		lettersonly = "solo numeri e lettere";
	}
	else if (language == "de") {
		$("#td1").html('<strong>Cryptocat</strong> kann sofort einen Chatraum mit sicherer Kommunikation einrichten. Es ist eine <a href="http://de.wikipedia.org/wiki/Freie_Software#Open_Source">quelloffene</a>, verschlüsselte, private Alternative zu Diensten wie dem Chat von Facebook.');
		$("#td2").html('Nachrichten werden im Browser mit AES-256 und asymmetrischen Schlüsseln mit 4096 Bit Länge verschlüsselt. Konversationen werden nach einer Stunde Inaktivität sicher gelöscht.');
		$("#td3").html('Cryptocat st voll mit <a target="_blank" href="https://torproject.org">Tor</a> kompatibel und funktioniert auch auf iPhone, Android oder BlackBerry.');
		$("#lang").html('<a href="#" onclick="translate(\'fr\')">fr</a> <a href="#" onclick="translate(\'ca\')">ca</a> <a href="#" onclick="translate(\'eu\')">eu</a> <a href="#" onclick="translate(\'it\')">it</a> <a href="#" onclick="translate(\'en\')">en</a> <a href="#" onclick="translate(\'pt\')">pt</a> <a href="#" onclick="translate(\'ru\')">ru</a> <a href="#" onclick="translate(\'sv\')">sv</a>');
		$("#notetext").html('Cryptocat bietet starke Verschlüsselung, aber sorgt nicht alleine für eine starke Sicherheits-Kultur. Wir empfehlen, zur weiteren Erhöhung der Sicherheit <a href="https://chrome.google.com/webstore/detail/gonbigodpnfghidmnphnadhepmbabhij" target="_blank">die Cryptocat-App für Google Chrome</a> zu installieren, und in ernsten Situationen immer verantwortungsvoll zu handeln.');
		$("#understand").val('Ich verstehe');
		$("#c").val('name des chatraums');
		$("#create").val('betreten');
		lettersonly = "nur buchstaben und ziffern";
	}
	else if (language == "pt") {
		$("#td1").html("<strong>Cryptocat</strong> permite você estabelecer conversas seguras. É uma alternativa de criptografia-livre para outros serviços como o chat do Facebook.");
		$("#td2").html("As mensagens são encriptadas seu navegador usando chaves assimétricas 4096-bit e AES-256. Todas as conversas são apagadas de forma segura após uma hora de inatividade.");
		$("#td3").html('Cryptocat é completamente compatível com <a target="_blank" href="https://torproject.org">Tor</a> e também funciona no seu iPhone, Android ou Blackberry.');
		$("#lang").html('<a href="#" onclick="translate(\'fr\')">fr</a> <a href="#" onclick="translate(\'ca\')">ca</a> <a href="#" onclick="translate(\'eu\')">eu</a> <a href="#" onclick="translate(\'it\')">it</a> <a href="#" onclick="translate(\'de\')">de</a> <a href="#" onclick="translate(\'en\')">en</a> <a href="#" onclick="translate(\'ru\')">ru</a> <a href="#" onclick="translate(\'sv\')">sv</a>');
		$("#notetext").html('Cryptocat prove uma encriptação forte, mas não substitui sozinho uma cultura de alta segurança. Considere instalar o aplicativo do <a href="https://chrome.google.com/webstore/detail/gonbigodpnfghidmnphnadhepmbabhij" target="_blank">Cryptocat para Google Chrome</a> para uma segurança maior e sempre pense de maneira responsável caso esteja envolvido em uma situação séria.');
		$("#understand").val("Eu compreendo");
		$("#c").val("nome da sala");
		$("#create").val("entrar");
		lettersonly = "somente letras e números";
	}
	else if (language == "ru") {
		$("#td1").html("<strong>Cryptocat</strong> позволяет быстро и безопасно обмениваться сообщениями. Это защищенная система с открытым исходным кодом, использующая шифрование.");
		$("#td2").html("Сообщения шифруются в вашем браузере с использованием AES-256 и 4096-битных ключей. С сервера зашифрованные сообщения удаляются каждый час.");
		$("#td3").html('Cryptocat полностью совместим с сетью <a target="_blank" href="https://torproject.org">Tor</a>, а также работает на iPhone, Android и BlackBerry.');
		$("#lang").html('<a href="#" onclick="translate(\'fr\')">fr</a> <a href="#" onclick="translate(\'ca\')">ca</a> <a href="#" onclick="translate(\'eu\')">eu</a> <a href="#" onclick="translate(\'it\')">it</a> <a href="#" onclick="translate(\'de\')">de</a> <a href="#" onclick="translate(\'pt\')">pt</a> <a href="#" onclick="translate(\'en\')">en</a> <a href="#" onclick="translate(\'sv\')">sv</a>');
		$("#notetext").html('Cryptocat использует сильное шифрование, но не заменяет отвественное отношение к безопасности. Установите <a href="https://chrome.google.com/webstore/detail/gonbigodpnfghidmnphnadhepmbabhij" target="_blank">Приложение Cryptocat для Google Chrome</a> для усиления безопасности, и всегда будьте на чеку, если вы в сложной ситуации.');
		$("#understand").val("Я понимаю");
		$("#c").val("название вашего чата");
		$("#create").val("вход");
		lettersonly = "только буквы и цифры";
	}
	else if (language == "sv") {
		$("#td1").html("<strong>Cryptocat</strong> tillåter dig att snabbt upprätta säkra konversationer. Det är ett privat alternativ till andra tjänster, såsom Facebooks chatt, baserat på öppen källkod.");
		$("#td2").html("Meddelanden krypteras i din webbläsare med AES-256 och 4096-bitars assymmetriska nycklar. Konversationer raderas säkert efter en timmes inaktivitet.");
		$("#td3").html('Cryptocat är fullt kompatibelt med <a target="_blank" href="https://torproject.org">Tor</a> och fungerar även på din iPhone, Android och BlackBerry.');
		$("#lang").html('<a href="#" onclick="translate(\'fr\')">fr</a> <a href="#" onclick="translate(\'ca\')">ca</a> <a href="#" onclick="translate(\'eu\')">eu</a> <a href="#" onclick="translate(\'it\')">it</a> <a href="#" onclick="translate(\'de\')">de</a> <a href="#" onclick="translate(\'pt\')">pt</a> <a href="#" onclick="translate(\'ru\')">ru</a> <a href="#" onclick="translate(\'en\')">en</a>');
		$("#notetext").html('Cryptocat tillhandahåller en stark kryptering men ersätter inte en stark säkerhetskultur. Överväg att installera <a href="https://chrome.google.com/webstore/detail/gonbigodpnfghidmnphnadhepmbabhij" target="_blank">Cryptocat-appen för Google Chrome</a> för extra säkerhet, och tänk på att alltid vara ansvarsfull i nödställda situationer.');
		$("#understand").val("Jag förstår");
		$("#c").val("namnge din chatt");
		$("#create").val("öppna");
		lettersonly = "endast bokstäver och siffror";
	}
	else if (language == "en") {
		$("#td1").html(td1);
		$("#td2").html(td2);
		$("#td3").html(td3);
		$("#notice").html(notice);
		$("#lang").html(bottom);
		$("#notetext").html(notetext);
		$("#understand").val(understand);
		$("#c").val(name);
		$("#create").val(create);
		lettersonly = "letters and numbers only";
	}
}

function idSelect(id) {
	document.getElementById(id).focus();
	document.getElementById(id).select();
}