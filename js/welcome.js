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
var bottom = $("#bottom").html();
var notetext = $("#notetext").html();
var understand = $("#understand").html();
var name = $("#c").val();
var create = $("#create").val();
var lettersonly = "letters and numbers only";

function translate(language) {
	if (language == "catalan") {
		$("#td1").html("<strong>Cryptocat</strong> li permet crear instantàniament converses segura i encriptada. Es tracta d'una alternativa de codi obert als serveis invasius, com ara el xat de Facebook.");
		$("#td2").html("Els missatges es xifren a nivell local i són verificades per la integritat. Les converses estan esborrat després de 30 minuts d'inactivitat.");
		$("#td3").html('Cryptocat és totalment compatible amb <a onclick=\"window.open(this.href,\'_blank\');return false;\" href="https://torproject.org">Tor</a> per conversar anònims. Utilitza Cryptocat amb Tor per la màxima confidencialitat.');
		$("#notice").html("(per a una experiència més segura: <a onclick=\"window.open(this.href,\'_blank\');return false;\" href=\"https://chrome.google.com/webstore/detail/dlafegoljmjdfmhgoeojifolidmllaie\">verificador cryptocat.</a>)");
		$("#bottom").html('<a href="#" onclick="translate(\'english\')">english</a> | <a href="https://crypto.cat/about">about</a> | <a onclick=\"window.open(this.href,\'_blank\');return false;\" href="http://creativecommons.org/licenses/by-nc-sa/3.0/">license</a> | <a onclick=\"window.open(this.href,\'_blank\');return false;\" href="https://twitter.com/cryptocatapp">twitter</a> | <a onclick=\"window.open(this.href,\'_blank\');return false;\" href="https://github.com/kaepora/cryptocat/">github</a>');
		$("#notetext").html('Mentre Cryptocat és una gran alternativa als serveis de xat encriptada públic amb les polítiques invasives de la privacitat, seu no és pensat com un reemplaçament de tecnologies d\'alt nivell com el PGP. Pensar de manera responsable si tu troben en situacions extremes.');
		$("#understand").html("Jo entenc.");
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
		$("#understand").html(understand);
		$("#c").val(name);
		$("#create").val(create);
		lettersonly = "letters and numbers only";
	}
}

function idSelect(id) {
	document.getElementById(id).focus();
	document.getElementById(id).select();
}