// fortuna.js version 0.2
// 2012 Nadim Kobeissi
// Fortuna PRNG implementation for Crypto-JS
// http://code.google.com/p/crypto-js/
// http://github.com/kaepora/fortunajs/

// Usage:
// Add entropy e to be mixed into the Fortuna pools.
// e has to be a string between 0 and 32 characters:
// Crypto.Fortuna.AddRandomEvent(e);
//
// Check if we have enough entropy to generate random bytes. Returns 1 if yes:
// Crypto.Fortuna.Ready();
//
// Generate n random bytes:
// Crypto.Fortuna.RandomData(n);

// Notes
// This implementation is based on Bruce Schneier and Niels Ferguson's description
// of the Fortuna PRNG in Cryptography Engineering (First Edition.)
// It differs from the original specification only very slightly:
//
// 1) Instead of 32 pools, this implementation uses 4. This is done under the 
// rationale that 32 pools are likely to be an impediment for web use,
// given the relatively limited session times and limited entropy sources.
//
// 2) PseudoRandomData(n) generates 4 blocks for rekeying instead of 2.

/*
 * Note: this code has been slightly modified
 * from its original version in order to work
 * with the Whirlpool implementation used by Cryptocat.
 * 2012 Nadim Kobeissi (nadim@nadim.cc)
 */


// Initialization
(function(){

var Fortuna = Crypto.Fortuna = function() {
};

var K = 0;
var C = 0;
var ReseedCnt = 0;
var MinPoolSize = 32;
var MaxEventSize = 32;
var LastReseed = 0;
var p = 0;
var P = [0, 0, 0, 0];

// Accumulator
function Reseed(s) {
	if (!K) {
		K = Whirlpool(s).substring(0, 32);
	}
	else {
		K = Whirlpool(K + s).substring(0, 32);
	}
	var d = new Date();
	LastReseed = d.getTime();
	C++;
}

Fortuna.AddRandomEvent = function(e) {
	if ((e.length < 0) || (e.length > MaxEventSize)) {
		throw "Fortuna ERROR: Random event cannot be more than " + MaxEventSize + " bytes."
	}
	for (var i=0; i!=e.length; i++) {
		if (!P[p]) {
			P[p] = e.substring(i, i + 1);
		}
		else {
			P[p] += e.substring(i, i + 1);
		}
		p++;
		if (p == P.length) {
			p = 0;
		}
	}
}

Fortuna.Ready = function() {
	if ((P[0].toString().length >= MinPoolSize) || (ReseedCnt)) {
		return 1;
	}
	else {
		return 0;
	}
}

// Generator
// Returns a string of k*16 bytes (equivalently, k*128 bits) generated from the
// Whirlpool state.
function GenerateBlocks(k) {
	if (C==0) {
		throw "Fortuna ERROR: Entropy pools too empty.";
	}
	var r = '';
	for (var i=0; i!=k; i++) {
		var Cp = Whirlpool((C.toString()).substring(0, 16)).substring(0, 32);
		var iv = Crypto.charenc.Binary.stringToBytes(K.substring(0, 16));
		var c = Crypto.AES.encrypt(Cp, Crypto.util.hexToBytes(K), {
			mode: new Crypto.mode.CTR, iv: iv
			}).substring(0, 16);
		r += c;
		C++;
	}
	return r;
}

// Returns a string of n pseudorandom characters derived from the Whirlpool state.
function PseudoRandomData(n) {
	if ((n <= 0) || (n >= 1048576)) {
		throw "Fortuna ERROR: Invalid value.";
	}
	var r = GenerateBlocks(Math.ceil(n/16)).substring(0, n);
	K = GenerateBlocks(4);
	return r;
}

Fortuna.RandomData = function(n) {
	var d = new Date();
	if ((P[0].toString().length >= MinPoolSize) && ((d.getTime() - LastReseed) > 100)) {
		ReseedCnt++;
		var s;
		for (var i=0; i!=31; i++) {
			if (((ReseedCnt / Math.pow(2, i)) % 1) == 0) {
				if (!s) {
					s = Whirlpool((P[i])).substring(0, 32);
				}
				else {
					s += Whirlpool((P[i])).substring(0, 32);
				}
				P[i] = 0;
			}
		}
		Reseed(s);
	}
	if (ReseedCnt == 0) {
		throw "Fortuna ERROR: Entropy pools too empty.";
	}
	else {
		return PseudoRandomData(n);
	}
}

})();
