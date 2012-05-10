var chat;
var interval;
var faded = 0;
var nicks = new Array('bunny', 'kitty', 'pony', 'puppy', 'squirrel', 'sparrow', 'turtle',
'kiwi', 'fox', 'owl', 'raccoon', 'koala', 'echidna', 'panther', 'sprite', 'ducky');

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
		$("#create").click();
	}
});

$("#c").click(function(){
	$("#c").focus();
	$("#c").val('');
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
		$('#nick').html(nicks[(Math.floor(Math.random()*14))]);
		$('#name').html($("#c").val());
		$('#name').fadeIn(300);
		$('#main').fadeOut(400, function() {
			$('#main').html(chat);
		});
	}
});