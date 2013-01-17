(function(){
importScripts('crypto-js/core.js');
importScripts('crypto-js/enc-base64.js');
importScripts('crypto-js/cipher-core.js');
importScripts('crypto-js/x64-core.js');
importScripts('crypto-js/aes.js');
importScripts('crypto-js/sha1.js');
importScripts('crypto-js/sha256.js');
importScripts('crypto-js/sha512.js');
importScripts('crypto-js/hmac.js');
importScripts('crypto-js/pad-nopadding.js');
importScripts('crypto-js/mode-ctr.js');
importScripts('cryptocatRandom.js');
importScripts('seedrandom.js');
importScripts('bigint.js');
importScripts('otr.js');

self.addEventListener('message', function(e) {
	Math.seedrandom(e.data);
	self.postMessage(new DSA());
}, false);

})();
