/*global postMessage self FileReader importScripts Cryptocat CryptoJS */

;(function(){
	"use strict";

	importScripts('../lib/crypto-js/core.js');
	importScripts('../lib/crypto-js/enc-base64.js');
	importScripts('../lib/crypto-js/cipher-core.js');
	importScripts('../lib/crypto-js/x64-core.js');
	importScripts('../lib/crypto-js/aes.js');
	importScripts('../lib/crypto-js/sha256.js');
	importScripts('../lib/crypto-js/sha512.js');
	importScripts('../lib/crypto-js/hmac.js');
	importScripts('../lib/crypto-js/pad-nopadding.js');
	importScripts('../lib/crypto-js/mode-ctr.js');
	importScripts('../lib/salsa20.js');
	importScripts('../cryptocat.js');
	importScripts('../etc/cryptocatRandom.js');

	var files = {};
	
	function uniqueId() {
		return Cryptocat.randomString(64, 1, 0, 1, 0);
	}
	
	function packCtr(val) {
		var i = 0, res = '';
		for (; i < 8; i++) {
			res = String.fromCharCode(val & 0xff) + res;
			val >>= 8;
		}
		return res + '\x00\x00\x00\x00\x00\x00\x00\x00';
	}

	var console = {
		log: function (log) {
			postMessage({ type: 'log', log: log });
		}
	};

	var mime = new RegExp(
		'^(image\/(png|jpeg|gif))|(application\/((x-compressed)|' +
		'(x-zip-compressed)|(zip)))|(multipart/x-zip)$'
	);

	self.addEventListener('message', function(e) {
		var data = e.data;

		var sid;
		switch (data.type) {

			case 'seed':
				Cryptocat.setSeed(data.seed);
				return;

			case 'open':
				var file = data.file;

				var error;
				if (!file.type.match(mime)) {
					error = 'typeError';
				} else if (file.size > (Cryptocat.fileSize * 1024)) {
					error = 'sizeError';
				}

				if (error) {
					postMessage({ type: 'error', error: error });
					return;
				}

				var to = data.to;
				sid = uniqueId();

				files[sid] = {
					to: to,
					position: 0,
					file: file,
					key: data.key,
					ctr: -1
				};

				postMessage({
					type: 'open',
					sid: sid,
					to: to,
					filename: file.name,
					size: file.size,
					mime: file.type,
					close: true
				});
				break;

			case 'data':
				sid = data.sid;

				var seq = data.start ? 0 : parseInt(data.seq, 10) + 1;
				if (seq > 65535) seq = 0;

				if (files[sid].position > files[sid].file.size) {
					postMessage({
						type: 'close',
						sid: data.sid,
						to: data.to,
						ctr: files[sid].ctr,
						size: files[sid].file.size
					});
					return;
				}

				var end = files[sid].position + Cryptocat.chunkSize;
				var chunk = files[sid].file.slice(files[sid].position, end);
				files[sid].position = end;
				files[sid].ctr += 1;
				var reader = new FileReader();
				reader.onload = function(event) {
					var msg = event.target.result;
					// remove dataURL header
					msg = msg.split(',')[1];
					// encrypt
					// don't use seq as a counter
					// it repeats after 65535 above
					var counter = packCtr(files[sid].ctr);
					var opts = {
						mode: CryptoJS.mode.CTR,
						iv: CryptoJS.enc.Latin1.parse(counter),
						padding: CryptoJS.pad.NoPadding
					};
					var aesctr = CryptoJS.AES.encrypt (
						CryptoJS.enc.Base64.parse(msg),
						CryptoJS.enc.Latin1.parse(files[sid].key[0]),
						opts
					);
					msg = aesctr.toString();
					// then mac
					var mac = CryptoJS.HmacSHA512(
						CryptoJS.enc.Base64.parse(msg),
						CryptoJS.enc.Latin1.parse(files[sid].key[1])
					);
					postMessage({
						type: 'data',
						sid: data.sid,
						to: data.to,
						seq: seq,
						ctr: files[sid].ctr,
						size: files[sid].file.size,
						data: msg + mac.toString(CryptoJS.enc.Base64)
					});
				}
				reader.readAsDataURL(chunk);
				break;
			}
	}, false);

}());