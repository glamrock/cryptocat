// fortuna.js version 0.3
// 2012 Nadim Kobeissi
// Fortuna PRNG implementation for Crypto-JS
// http://code.google.com/p/crypto-js/
// http://github.com/kaepora/fortunajs/

// Usage:
// Add entropy e to be mixed into the Fortuna pools.
// e has to be a string between 0 and 32 characters:
// CryptoJS.Fortuna.AddRandomEvent(e);
//
// Check if we have enough entropy to generate random bytes. Returns 1 if yes:
// CryptoJS.Fortuna.Ready();
//
// Generate n random bytes:
// CryptoJS.Fortuna.RandomData(n);

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

// License:
// DO WHAT THE FUCK YOU WANT TO PUBLIC LICENSE 
// TERMS AND CONDITIONS FOR COPYING, DISTRIBUTION AND MODIFICATION 
// 0. You just DO WHAT THE FUCK YOU WANT TO.


// Initialization
(function(){

var Fortuna = CryptoJS.Fortuna = function() {
};

var K = '';
var C = 0;
var ReseedCnt = 0;
var MinPoolSize = 32;
var MaxEventSize = 32;
var LastReseed = 0;
var p = 0;
var P = [0, 0, 0, 0];

// Accumulator
function Reseed(s) {
	K = CryptoJS.SHA512(K + s).toString(CryptoJS.enc.Hex).substring(0, 32);
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
// SHA512 state.
function GenerateBlocks(k) {
	if (C === 0) {
		throw "Fortuna ERROR: Entropy pools too empty.";
	}
	var r = '';
	for (var i=0; i!=k; i++) {
		var Cp = CryptoJS.SHA512((C.toString()).substring(0, 16)).toString(CryptoJS.enc.Hex).substring(0, 32);
		var c = CryptoJS.AES.encrypt(Cp, CryptoJS.enc.Hex.parse(K), { 
			mode: CryptoJS.mode.CTR,
			iv: CryptoJS.enc.Hex.parse(K),
			padding: CryptoJS.pad.NoPadding }).ciphertext.toString(CryptoJS.enc.Base64).substring(0, 16);
		r += c;
		C++;
	}
	return r;
}

// Returns a string of n pseudorandom characters derived from the SHA512 state.
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
		var s = '';
		for (var i=0; i!=31; i++) {
			if (ReseedCnt & ((1 << i) - 1) != 0) {
				break;
			}
			s += CryptoJS.SHA512(P[i]).toString(CryptoJS.enc.Hex).substring(0, 32);
			P[i] = 0;
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