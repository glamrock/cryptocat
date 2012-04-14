/*
 * Crypto-JS v2.5.3
 * http://code.google.com/p/crypto-js/
 * (c) 2009-2012 by Jeff Mott. All rights reserved.
 * http://code.google.com/p/crypto-js/wiki/License
 */

/*
 * Note: this code has been slightly modified
 * from its original version in order to work
 * with the Whirlpool implementation used by Cryptocat.
 * 2012 Nadim Kobeissi (nadim@nadim.cc)
 */

(function(){

// Shortcuts
var C = Crypto,
    util = C.util,
    charenc = C.charenc,
    UTF8 = charenc.UTF8,
    Binary = charenc.Binary;

C.HMAC = function (hasher, message, key, options) {

	// Convert to byte arrays
	if (message.constructor == String) message = UTF8.stringToBytes(message);
	if (key.constructor == String) key = UTF8.stringToBytes(key);
	/* else, assume byte arrays already */

	// Allow arbitrary length keys
	if (key.length > 64 * 4)
		key = util.hexToBytes(hasher(key));

	// XOR keys with pad constants
	var okey = key.slice(0),
	    ikey = key.slice(0);
	for (var i = 0; i < 64 * 4; i++) {
		okey[i] ^= 0x5C;
		ikey[i] ^= 0x36;
	}

	var hmacbytes = util.hexToBytes(hasher(okey.concat(util.hexToBytes(hasher(ikey.concat(message))))));

	return options && options.asBytes ? hmacbytes :
	       options && options.asString ? Binary.bytesToString(hmacbytes) :
	       util.bytesToHex(hmacbytes);

};

})();
