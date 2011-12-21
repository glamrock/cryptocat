var chat;
var faded = 0;
var nicks = new Array('bunny', 'kitty', 'pony', 'puppy', 'squirrel', 'sparrow', 
'kiwi', 'fox', 'owl', 'raccoon', 'koala', 'echidna', 'panther', 'sprite');

$(window).keypress(function(e) {
	if ((e.keyCode == 13) && (!faded)) {
		$("#create").click();
	}
	else if ((e.keyCode == 13) && (faded)) {
		$("#understand").click();
	}
});

var xhr = new XMLHttpRequest();
xhr.open("GET", "chat.html", false);
xhr.onreadystatechange = function() {
	if (xhr.readyState == 4) {
		chat = xhr.responseText;
	}
}
xhr.send();

$("#create").click(function() {
	$("#c").val($("#c").val().toLowerCase());
	if (!$("#c").val().match(/^\w+$/)) {
		$("#c").val(lettersonly);
		idSelect("c");
		return false;
	}
	else {
		faded = 1;
		$("#front").fadeIn();
		return false;
	}
});

$("#understand").click(function(){
	chat = chat.replace('raccoon', nicks[(Math.floor(Math.random()*14))]);
	chat = chat.replace('<strong id="name"></strong>', '<strong id="name">' + $("#c").val() + '</strong>');
	document.write(chat);
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
	if (language == "cat") {
		$("#td1").html("<strong>Cryptocat</strong> li permet crear instantàniament converses segura i encriptada. Es tracta d'una alternativa de codi obert als serveis invasius, com ara el xat de Facebook.");
		$("#td2").html("Els missatges són xifrats dins el seu navegador utilitzant AES-256 i 4096 bits claus asimètriques. Les converses són amb seguretat eliminat després d'una hora d'inactivitat.");
		$("#td3").html('Cryptocat és totalment compatible amb <a target=\"_blank\" href="https://torproject.org">Tor</a> i també funciona en iPhone, Android i BlackBerry.');
		$("#lang").html('<a href="#" onclick="translate(\'fra\')">fra</a> <a href="#" onclick="translate(\'eng\')">eng</a> <a href="#" onclick="translate(\'baq\')">baq</a>');
		$("#notetext").html('Cryptocat proporciona un xifratge fort e les comunicacions segures. No obstant això, es no és un reemplaçament de GPG. Pensar de manera responsable si es troba en extrem, situacions potencialment mortals.');
		$("#understand").val("Jo entenc.");
		$("#c").val("nom de la xerrada");
		$("#create").val("entrar");
		lettersonly = "lletres i números nomes";
	}
	else if (language == "fra") {
		$("#td1").html("<strong>Cryptocat</strong> vous laisse mettre en place des conversations sécurisées. C'est une alternative open source et privée à d'autres services tel que Facebook Chat.");
		$("#td2").html("Les messages sont cryptés à l'intérieur de votre navigateur avec AES-256 et des clefs asymétriques 4096-bit. Toutes conversations sont effacés après une heure d'inactivité.");
		$("#td3").html('Cryptocat est entièrement compatible avec <a target=\"_blank\" href="https://torproject.org">Tor</a> et travaille aussi sur votre iPhone, Android et BlackBerry.');
		$("#lang").html('<a href="#" onclick="translate(\'eng\')">eng</a> <a href="#" onclick="translate(\'cat\')">cat</a> <a href="#" onclick="translate(\'baq\')">baq</a>');
		$("#notetext").html('Cryptocat fournit des communications fortement cryptés. Cependant, Cryptocat n\'est pas un remplacement à GPG. Pensez responsablement si vous êtes dans des situations extrêmes.');
		$("#understand").val("Je comprends.");
		$("#c").val("nom de la conversation");
		$("#create").val("entrer");
		lettersonly = "lettres et chiffres seulement";
	}
	else if (language == "baq") {
		$("#td1").html("<strong>Cryptocat</strong>-ek elkarrizketa seguruak momentuan eratzea ahalbidetzen du. Facebook-eko txataren moduko zerbitzuen alternatiba pribatu, zifratu eta kode-irekikoa da.");
		$("#td2").html("Mezuak dira zifratzen AES-256 eta 4096-bit asimetrikoaren teklak erabiliz. Elkarrizketak era seguruan ezabatzen dira haietan jardunik gabeko ordu bat igaro ondoren.");
		$("#td3").html('Cryptocat guztiz bateragarria da Tor-ekin eta zure iPhone, Android edo BlackBerry-an ere badabil.');
		$("#lang").html('<a href="#" onclick="translate(\'fra\')">fra</a> <a href="#" onclick="translate(\'cat\')">cat</a> <a href="#" onclick="translate(\'eng\')">eng</a>');
		$("#notetext").html('Cryptocat-ek zifraketa sendoa duten komunikazio seguruak hornitzen ditu. Dena den, ez da GPGren ordezkoa. Arduraz pentsatu muturreko edo bizitza arriskupean dagoen egoera batean bazaude.');
		$("#understand").val("Ulertzen dut.");
		$("#c").val("izendatu zure elkarrizketa");
		$("#create").val("sartu");
		lettersonly = "letrak eta zenbakiak soilik";
	}
	else if (language == "eng") {
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