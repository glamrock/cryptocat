var Cryptocat = function() {};

(function(){

Cryptocat.generateSeed = function() {
	var output = '';
	// The following incredibly ugly Firefox hack is completely the fault of 
	// Firefox developers sucking and it taking them four years+ to implement
	// window.crypto.getRandomValues().
	function firefoxRandomBytes() {
		var element = document.createElement('cryptocatFirefoxElement');
		document.documentElement.appendChild(element);
		var evt = document.createEvent('HTMLEvents');
		evt.initEvent('cryptocatGenerateRandomBytes', true, false);
		element.dispatchEvent(evt);
		var output = element.getAttribute('randomValues').split(',');
		delete element;
		return output;
	}
	// Firefox
	if (navigator.userAgent.match('Firefox')) {
		var buffer = firefoxRandomBytes();
	}
	// Browsers that don't require shitty workarounds
	else {
		var buffer = new Uint8Array(1024);
		window.crypto.getRandomValues(buffer);
	}
	for (var i in buffer) {
		output += String.fromCharCode(buffer[i]);
	}
	return output;
}

})();//:3