importScripts("cryptico.js");
var names, keys, nick, mysecret, mypublic, gsm;
var gsm;

self.onmessage = function(e) {
	if (e.data.substring(0, 1) == "!") {
		decrypted = cryptico.decrypt(e.data.substring(1), mysecret);
		if (decrypted.signature != "verified") {
			self.postMessage("corrupt");
		}
		else if (decrypted.status == "success") {
			self.postMessage(decrypted.plaintext);
		}
	}
	else if (e.data.substring(0, 1) == "|") {
		names = keys = nick = gsm = "";
		match = e.data.match(/^\|[a-z|,]+/);
		names = match[0].substring(1).split(",");
		match = e.data.match(/\:[^\*]+/);
		keys = match[0].substring(1).split(",");
		match = e.data.match(/\*[a-z]{1,12}$/);
		nick = match[0].substring(1);
		self.postMessage(names);
	}
	else if (e.data.substring(0, 1) == "?") {
		var i = 0;
		for (i=0; i <= 8; i++) {
			if ((names[i]) && (names[i] != nick)) {
				gsm += "(" + names[i] + ")" + cryptico.encrypt(e.data.substring(1), keys[i], mysecret).cipher;
			}
		}
		self.postMessage(gsm);
	}
	else {
		mysecret = cryptico.generateRSAKey(e.data, 1024);
		mypublic = cryptico.publicKeyString(mysecret);
		self.postMessage(mypublic);
	}
}