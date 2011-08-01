var td1 = $("#td1").html();
var td2 = $("#td2").html()
var td3 = $("#td3").html()
var video = $("#video").html()
var bottom = $("#bottom").html()
var name = $("#name").val()
var create = $("#create").val()
var curlang = "english";

function translate() {
	if (curlang == "english") {
		$("#td1").html("<strong>cryptocat</strong> li permet establir xats encriptada, privada de improvisada converses segures. Fes una ullada a aquest <a href=\"info\">vídeo</a> per obtenir consells sobre com començar!");
		$("#td2").html("els seus missatges són encriptades abans de sortir del seu ordinador usant un algoritme AES-256 i es verifiquen la integritat. totes les converses estan ben esborrat després de 30 minuts d'inactivitat.");
		$("#td3").html('cryptocat és totalment compatible amb <a target="_blank" href="https://torproject.org">Tor</a> per anònima al xat. utilitzeu cryptocat amb Tor de forma anònima la màxima confidencialitat.');
		$("#video").html("(per primera vegada? fes un cop d\'ull a aquest <a href=\"info\">vídeo impressionant!</a>)");
		$("#bottom").html('<a href="#" id="translate" onclick="translate()">english</a> | <a href="about">sobre</a> | cryptocat és el programari beta en el desenvolupament actiu | <a target="_blank" href="https://twitter.com/cryptocatapp">twitter</a> | <a target="_blank" href="https://github.com/kaepora/cryptocat/">github</a>');
		$("#name").val("escrigui el seu nom de xat");
		$("#create").val("entrar");
		curlang = "catalan";
	}
	else if (curlang == "catalan") {
		$("#td1").html(td1);
		$("#td2").html(td2);
		$("#td3").html(td3);
		$("#video").html(video);
		$("#bottom").html(bottom);
		$("#name").val(name);
		$("#create").val(create);
		curlang = "english";
	}
}