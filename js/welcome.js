$("#welcome").submit( function() {
	$("#name").val($("#name").val().toLowerCase());
	if (!$("#name").val().match(/^([a-z]|_|[0-9])+$/)) {
		$("#name").val("letters and numbers only");
		return false;
	}
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
		$("#td3").html('cryptocat és totalment compatible amb <a target="_blank" href="https://torproject.org">Tor</a> per anònima al xat. utilitzeu cryptocat amb Tor de forma anònima la màxima confidencialitat.');
		$("#video").html("(per a una experiència més segura: <a target=\"_blank\" href=\"https://chrome.google.com/webstore/detail/dlafegoljmjdfmhgoeojifolidmllaie\">verificador cryptocat.</a>)");
		$("#bottom").html('<a href="#" id="translate" onclick="translate(\'english\')">english</a> | <a href="#" id="translate" onclick="translate(\'arabic\')">عربي</a> | <a href="https://crypto.cat/about">about</a> | <a target="_blank" href="http://creativecommons.org/licenses/by-nc-sa/3.0/">license</a> | <a target="_blank" href="https://twitter.com/cryptocatapp">twitter</a> | <a target="_blank" href="https://github.com/kaepora/cryptocat/">github</a> | cryptocat està actualment en versió beta');
		$("#name").val("escrigui el seu nom de xat");
		$("#create").val("entrar");
	}
	else if (language == "arabic") {
		$("#td1").html("!<strong>كريبتوكت</strong> يتيح لك إعداد محادثات دردشة أمينة و مشفرة.  <a href=\"info\"> تحقق من هذا الفيديو </a>للحصول على نصائح حول كيفية إستعمال كريبتوكت");
		$("#td2").html(".يتم تشفير الرسائل قبل مغادرة الكمبيوتر ويتم التحقق من أجل النزاهة. يتم محو جميع المحادثات بعد ثلاثون دقيقة من الخمول");
		$("#td3").html('.كريبتوكت متوافق تماما مع تور للدردشة لإخفاء الهوية وللسرية القصوى');
		$("#video").html("(لتجربة أمينة بعد أكثر، سجل : <a target=\"_blank\" href=\"https://chrome.google.com/webstore/detail/dlafegoljmjdfmhgoeojifolidmllaie\">مدقق كريبتوكت.</a>)");
		$("#bottom").html('<a href="#" id="translate" onclick="translate(\'catalan\')">català</a> | <a href="#" id="translate" onclick="translate(\'english\')">english</a> | <a href="https://crypto.cat/about">about</a> | <a target="_blank" href="http://creativecommons.org/licenses/by-nc-sa/3.0/">license</a> | <a target="_blank" href="https://twitter.com/cryptocatapp">twitter</a> | <a target="_blank" href="https://github.com/kaepora/cryptocat/">github</a> | كريبتوكت حالياً تحت التطور');
		$("#name").val("إدخل إسم المكالمة هنا");
		$("#create").val("تحدث");
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