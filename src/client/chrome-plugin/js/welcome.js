var chat;
var interval;
var faded = 0;
var nicks = new Array('bunny', 'kitty', 'pony', 'puppy', 'squirrel', 'sparrow', 'turtle',
'kiwi', 'fox', 'owl', 'raccoon', 'koala', 'echidna', 'panther', 'sprite', 'ducky');
var server = 'https://crypto.cat/';

function gen(s) {
	var c = "1234567890abcdefghijklmnopqrstuvwxyz";
	$("#c").val($("#c").val() + c.charAt(Math.floor(Math.random() * c.length)));
	if ($("#c").val().length >= s) {
		clearInterval(interval);
	}
}

var xhr = new XMLHttpRequest();
xhr.open("GET", "chat.html", false);
xhr.onreadystatechange = function() {
	if (xhr.readyState === 4) {
		chat = xhr.responseText;
	}
};
xhr.send();

$(window).keypress(function(e) {
	if (e.keyCode === 13) {
		if (typeof($('#server').val()) === 'string') {
			$("#serverchange").click();
		}
		else {
			$("#create").click();
		}
	}
});

$("#c").click(function(){
	$("#c").focus();
	$("#c").select();
});

$("#random").click(function(){
	clearInterval(interval);
	$("#c").val('');
	interval = setInterval("gen(8)", 40);
});

$("#create").click(function() {
	$("#c").val($("#c").val().toLowerCase());
	if (!$("#c").val().match(/^\w+$/)) {
		$("#c").val(lettersonly);
		$("#c").click();
		return false;
	}
	else {
		chat = chat.replace(/raccoon/g, nicks[(Math.floor(Math.random()*14))]);
		chat = chat.replace('<strong id="name"></strong>', '<strong id="name">' + $("#c").val() + '</strong>');
		chat = chat.replace(/CRYPTOCATSERVER/g, server);
		$('#main').html(chat);
	}
});

$("#custom").click(function(){
	$("#front").css('background-color', 'rgba(0, 0, 0, 0.8)');
	$("#note").html('<input type="button" id="close" value="x" /><br /><br />Enter the URL of the ' +
	'Cryptocat server you wish to connect to:<br /><input type="text" id="server" value="' + server + '" />' + 
	'<input type="button" id="serverchange" value="Set" />');
	$("#front").fadeIn();
	$('#server').focus();
	$("#close").click(function(){
		$("#front").fadeOut(function(){
			$("#note").html('');
			$("#front").css('background-color', 'rgba(0, 0, 0, 0)');
		});
	});
	$("#serverchange").click(function(){
		server = $('#server').val();
		$("#front").fadeOut(function(){
			$('#c').focus();
			$("#note").html('');
			$("#front").css('background-color', 'rgba(0, 0, 0, 0)');
		});
	});
});

var td1 = $("#td1").html();
var td2 = $("#td2").html();
var td3 = $("#td3").html();
var name = $("#c").val();
var create = $("#create").val();
var lettersonly = "letters and numbers only";

$('#en').click(function(){
	$("#td1").html(td1);
	$("#td2").html(td2);
	$("#td3").html(td3);
	$("#c").val(name);
	$("#create").val(create);
	lettersonly = "letters and numbers only";
});
$('#ca').click(function(){
	$("#td1").html("<strong>Cryptocat</strong> li permet crear instantàniament converes segures i encriptades. Es tracta d'una alternativa de codi obert als serveis invasius, com ara el xat de Facebook.");
	$("#td2").html("Els missatges són xifrats dins el seu navegador utilitzant AES-256. Les dades són totalment eliminades després d'una hora d'inactivitat.");
	$("#td3").html('Cryptocat és totalment compatible amb <a target="_blank" href="https://torproject.org">Tor</a> (<a href="http://xdtfje3c46d2dnjd.onion">http://xdtfje3c46d2dnjd.onion</a>) i també funciona en iPhone, Android i BlackBerry.');
	$("#c").val("anomena el teu xat");
	$("#create").val("entrar");
	lettersonly = "unicament lletres i números";
});
$('#de').click(function(){
	$("#td1").html('<strong>Cryptocat</strong> kann sofort einen Chatraum mit sicherer Kommunikation einrichten. Es ist eine <a href="http://de.wikipedia.org/wiki/Freie_Software#Open_Source">quelloffene</a>, verschlüsselte, private Alternative zu Diensten wie dem Chat von Facebook.');
	$("#td2").html('Nachrichten werden im Browser mit AES-256. Daten werden nach einer Stunde Inaktivität sicher gelöscht.');
	$("#td3").html('Cryptocat ist voll mit <a target="_blank" href="https://torproject.org">Tor</a> kompatibel (<a href="http://xdtfje3c46d2dnjd.onion">http://xdtfje3c46d2dnjd.onion</a>) und funktioniert auch auf iPhone, Android oder BlackBerry.');
	$("#c").val('name des chatraums');
	$("#create").val('betreten');
	lettersonly = "nur buchstaben und ziffern";
});
$('#eu').click(function(){
	$("#td1").html("<strong>Cryptocat</strong>-ek elkarrizketa seguruak momentuan eratzea ahalbidetzen du. Facebook-eko txataren moduko zerbitzuen alternatiba pribatu, zifratu eta kode-irekikoa da.");
	$("#td2").html("Mezuak AES-256 erabiliz zifratzen dira. Elkarrizketak era seguruan ezabatzen dira haietan jardunik gabeko ordu bat igaro ondoren.");
	$("#td3").html('Cryptocat guztiz bateragarria da <a target="_blank" href="https://torproject.org">Tor</a>-ekin (<a href="http://xdtfje3c46d2dnjd.onion">http://xdtfje3c46d2dnjd.onion</a>) eta zure iPhone, Android edo BlackBerry-an ere badabil.');
	$("#c").val("izendatu zure elkarrizketa");
	$("#create").val("sartu");
	lettersonly = "letrak eta zenbakiak soilik";
});
$('#fr').click(function(){
	$("#td1").html("<strong>Cryptocat</strong> vous laisse mettre en place des conversations sécurisées. C'est une alternative open source et privée à d'autres services tel que Facebook Chat.");
	$("#td2").html("Les messages sont cryptés à l'intérieur de votre navigateur avec AES-256. Toutes données sont effacés après une heure d'inactivité.");
	$("#td3").html('Cryptocat est entièrement compatible avec <a target="_blank" href="https://torproject.org">Tor</a> (<a href="http://xdtfje3c46d2dnjd.onion">http://xdtfje3c46d2dnjd.onion</a>) et travaille aussi sur votre iPhone, Android et BlackBerry.');
	$("#c").val("nom de la conversation");
	$("#create").val("entrer");
	lettersonly = "lettres et chiffres seulement";
});
$('#it').click(function(){
	$("#td1").html("<strong>Cryptocat</strong> ti permette di impostare istantaneamente conversazioni sicure. E' un servizio privato, crittografato, open source, alternativo ad altri servizi come la chat di Facebook.");
	$("#td2").html("I messaggi sono crittografati all'interno del tuo browser usando chiavi asimmetriche AES-256. Le tue dati sono cancellate in modo sicuro dopo un'ora di inattività.");
	$("#td3").html('Cryptocat è completamente compatibile con <a target="_blank" href="https://torproject.org">Tor</a> (<a href="http://xdtfje3c46d2dnjd.onion">http://xdtfje3c46d2dnjd.onion</a>) e funziona anche sul tuo smartphone iPhone, Android e BlackBerry.');
	$("#c").val("nome della conversazione");
	$("#create").val("entra");
	lettersonly = "solo numeri e lettere";
});
$('#pt').click(function(){
	$("#td1").html("<strong>Cryptocat</strong> permite você estabelecer conversas seguras. É uma alternativa de criptografia-livre para outros serviços como o chat do Facebook.");
	$("#td2").html("As mensagens são encriptadas seu navegador usando AES-256. Todas as dados são apagadas de forma segura após uma hora de inatividade.");
	$("#td3").html('Cryptocat é completamente compatível com <a target="_blank" href="https://torproject.org">Tor</a> (<a href="http://xdtfje3c46d2dnjd.onion">http://xdtfje3c46d2dnjd.onion</a>) e também funciona no seu iPhone, Android ou Blackberry.');
	$("#c").val("nome da sala");
	$("#create").val("entrar");
	lettersonly = "somente letras e números";
});
$('#ru').click(function(){
	$("#td1").html("<strong>Cryptocat</strong> позволяет быстро и безопасно обмениваться сообщениями. Это защищенная система с открытым исходным кодом, использующая шифрование.");
	$("#td2").html("Сообщения шифруются в вашем браузере с использованием AES-256. С сервера зашифрованные сообщения удаляются каждый час.");
	$("#td3").html('Cryptocat полностью совместим с сетью <a target="_blank" href="https://torproject.org">Tor</a> (<a href="http://xdtfje3c46d2dnjd.onion">http://xdtfje3c46d2dnjd.onion</a>), а также работает на iPhone, Android и BlackBerry.');
	$("#c").val("название вашего чата");
	$("#create").val("вход");
	lettersonly = "только буквы и цифры";
});
$('#sv').click(function(){
	$("#td1").html("<strong>Cryptocat</strong> tillåter dig att snabbt upprätta säkra konversationer. Det är ett privat alternativ till andra tjänster, såsom Facebooks chatt, baserat på öppen källkod.");
	$("#td2").html("Meddelanden krypteras i din webbläsare med AES-256. Uppgifter raderas säkert efter en timmes inaktivitet.");
	$("#td3").html('Cryptocat är fullt kompatibelt med <a target="_blank" href="https://torproject.org">Tor</a> (<a href="http://xdtfje3c46d2dnjd.onion">http://xdtfje3c46d2dnjd.onion</a>) och fungerar även på din iPhone, Android och BlackBerry.');
	$("#c").val("namnge din chatt");
	$("#create").val("öppna");
	lettersonly = "endast bokstäver och siffror";
});
$('#uk').click(function(){
	$("#td1").html("<strong>Cryptocat</strong> Дозволяє швидко та безпечно обмінюватися повідомленнями. Це захищена система з вільнодоступним відкритим кодом, яка використовує шифрування.");
	$("#td2").html("Повідомлення шифруються у вашому веб-браузері за допомогю шифру AES-256. Зашифровані повідомлення видаляються з сервера кожну годину");
	$("#td3").html('Cryptocat повністю сумісний з програмним забезпеченням мережі <a target="_blank" href="https://torproject.org">Tor</a> (<a href="http://xdtfje3c46d2dnjd.onion">http://xdtfje3c46d2dnjd.onion</a>), а також працює на iPhone, Android та BlackBerry.');
	$("#c").val("назва Вашого чата");
	$("#create").val("вхід");
	lettersonly = "тільки букви та цифри";
});

$("#c").click();