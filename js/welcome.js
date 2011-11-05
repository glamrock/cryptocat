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
var bottom = $("#bottom").html();
var notetext = $("#notetext").html();
var understand = $("#understand").val();
var name = $("#c").val();
var create = $("#create").val();
var lettersonly = "letters and numbers only";

function translate(language) {
	if (language == "catalan") {
		$("#td1").html("<strong>Cryptocat</strong> li permet crear instantàniament converses segura i encriptada. Es tracta d'una alternativa de codi obert als serveis invasius, com ara el xat de Facebook.");
		$("#td2").html("Missatges es xifren a nivell local i són verificades per la integritat. Converses estan esborrat després de 30 minuts d'inactivitat.");
		$("#td3").html('Cryptocat és totalment compatible amb <a onclick=\"window.open(this.href,\'_blank\');return false;\" href="https://torproject.org">Tor</a> i també funciona en iPhone, Android i BlackBerry.');
		$("#notice").html("(per a una experiència més segura: <a onclick=\"window.open(this.href,\'_blank\');return false;\" href=\"https://chrome.google.com/webstore/detail/dlafegoljmjdfmhgoeojifolidmllaie\">verificador cryptocat.</a>)");
		$("#bottom").html('<a href="#" onclick="translate(\'english\')">english</a> | <a href="https://crypto.cat/about">about</a> | <a onclick="window.open(this.href,\'_blank\');return false;" href="https://chrome.google.com/webstore/detail/gonbigodpnfghidmnphnadhepmbabhij">chrome app</a> | <a onclick=\"window.open(this.href,\'_blank\');return false;\" href="https://twitter.com/cryptocatapp">twitter</a> | <a onclick=\"window.open(this.href,\'_blank\');return false;\" href="https://github.com/kaepora/cryptocat/">github</a>');
		$("#notetext").html('Cryptocat proporciona un xifratge fort e les comunicacions segures. No obstant això, es no és un reemplaçament de GPG. Pensar de manera responsable si es troba en extrem, situacions potencialment mortals.');
		$("#understand").val("Jo entenc.");
		$("#c").val("nom de la xerrada");
		$("#create").val("entrar");
		lettersonly = "lletres i números nomes";
	}
	else if (language == "english") {
		$("#td1").html(td1);
		$("#td2").html(td2);
		$("#td3").html(td3);
		$("#notice").html(notice);
		$("#bottom").html(bottom);
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