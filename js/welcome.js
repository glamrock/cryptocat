var understood;
$("#welcome").submit( function() {
	$("#name").val($("#name").val().toLowerCase());
	if (understood) {
		return true;
	}
	else if (!$("#name").val().match(/^([a-z]|_|[0-9])+$/)) {
		$("#name").val("letters and numbers only");
		StuffSelect("name");
		return false;
	}
	else {
		$("#front").fadeIn();
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
var video = $("#video").html();
var bottom = $("#bottom").html();
var name = $("#name").val();
var create = $("#create").val();

function translate(language) {
	if (language == "catalan") {
		$("#td1").html("<strong>cryptocat</strong> li permet establir xats encriptada, privada de improvisada converses segures. Fes una ullada a aquest <a href=\"info\">vídeo</a> per obtenir consells sobre com començar!");
		$("#td2").html("seus missatges són encriptades abans de sortir del seu ordinador usant un algoritme AES-256. totes les converses estan ben esborrat després de 30 minuts d'inactivitat.");
		$("#td3").html('cryptocat és totalment compatible amb <a onclick=\"window.open(this.href,\'_blank\');return false;\" href="https://torproject.org">Tor</a> per anònima al xat. utilitzeu cryptocat amb Tor de forma anònima la màxima confidencialitat.');
		$("#video").html("(per a una experiència més segura: <a onclick=\"window.open(this.href,\'_blank\');return false;\" href=\"https://chrome.google.com/webstore/detail/dlafegoljmjdfmhgoeojifolidmllaie\">verificador cryptocat.</a>)");
		$("#bottom").html('<a href="#" onclick="translate(\'english\')">english</a> | <a href="https://crypto.cat/about">about</a> | <a onclick=\"window.open(this.href,\'_blank\');return false;\" href="http://creativecommons.org/licenses/by-nc-sa/3.0/">license</a> | <a onclick=\"window.open(this.href,\'_blank\');return false;\" href="https://twitter.com/cryptocatapp">twitter</a> | <a onclick=\"window.open(this.href,\'_blank\');return false;\" href="https://github.com/kaepora/cryptocat/">github</a>');
		$("#notetext").html('Mentre Cryptocat és prou fiable per a la majoria de situacions, és encara un programari experimental. Si vostè està tractant d\'evitar la vigilància dels adversaris extremadament perillosos, considerar l\'ús de la prova dècada d\'alternatives com el PGP.');
		$("#understand").html("Jo entenc.");
		$("#name").val("escrigui el seu nom de xat");
		$("#create").val("entrar");
	}
	else if (language == "english") {
		$("#td1").html(td1);
		$("#td2").html(td2);
		$("#td3").html(td3);
		$("#video").html(video);
		$("#bottom").html(bottom);
		$("#name").val(name);
		$("#create").val(create);
	}
}

