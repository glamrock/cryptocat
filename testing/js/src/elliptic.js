// curve25519

// In order to generate a public value:
//   priv = randBigInt(256)
//   pub = scalarMult(priv, basePoint)
//
// In order to perform key agreement:
//   shared = scalarMult(myPrivate, theirPublic)

/*
Here's a test: this should print the same thing twice.
var priv1 = randBigInt(256, 0)
var priv2 = randBigInt(256, 0)
var pub1 = scalarMult(priv1, basePoint)
var pub2 = scalarMult(priv2, basePoint)
print (scalarMult(priv1, pub2))
print (scalarMult(priv2, pub1)) */

// p22519 is the curve25519 prime: 2^255 - 19
var p25519 = str2bigInt("7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffed", 16);
// p25519Minus2 = 2^255 - 21
var p25519Minus2 = str2bigInt("7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffeb", 16);
// a is a parameter of the elliptic curve
var a = str2bigInt("486662", 10);
// basePoint is the generator of the elliptic curve group
var basePoint = str2bigInt("9", 10);

// These variables are names for small, bigint constants.
var eight = str2bigInt("8", 10);
var four = str2bigInt("4", 10);
var three = str2bigInt("3", 10);
var two = str2bigInt("2", 10);

// groupAdd adds two elements of the elliptic curve group in Montgomery form.
function groupAdd(x1, xn, zn, xm, zm) {
        // x₃ = 4(x·x′ - z·z′)² · z1
        var xx = multMod(xn, xm, p25519);
        var zz = multMod(zn, zm, p25519);
        var d;
        if (greater(xx, zz)) {
                d = sub(xx, zz);
        } else {
                d = sub(zz, xx);
        }
        var sq = multMod(d, d, p25519);
        var outx = multMod(sq, four, p25519);

        // z₃ = 4(x·z′ - z·x′)² · x1
        var xz = multMod(xm, zn, p25519);
        var zx = multMod(zm, xn, p25519);
        var d;
        if (greater(xz, zx)) {
            d = sub(xz, zx);
        } else {
            d = sub(zx, xz);
        }
        var sq = multMod(d, d, p25519);
        var sq2 = multMod(sq, x1, p25519);
        var outz = multMod(sq2, four, p25519);

        return [outx, outz];
}

// groupDouble doubles a point in the elliptic curve group.
function groupDouble(x, z) {
        // x₂ = (x² - z²)²
        var xx = multMod(x, x, p25519);
        var zz = multMod(z, z, p25519);
        var d;
        if (greater(xx, zz)) {
          d = sub(xx, zz);
        } else {
          d = sub(zz, xx);
        }
        var outx = multMod(d, d, p25519);

        // z₂ = 4xz·(x² + Axz + z²)
        var s = add(xx, zz);
        var xz = multMod(x, z, p25519);
        var axz = mult(xz, a);
        s = add(s, axz);
        var fourxz = mult(xz, four);
        var outz = multMod(fourxz, s, p25519);

        return [outx, outz];
}

// scalarMult calculates i*base in the elliptic curve.
function scalarMult(i, base) {
        var scalar = expand(i, 18);
        scalar[0] &= (248 | 0x7f00);
        scalar[17] = 0;
        scalar[16] |= 0x4000;

        var x1 = str2bigInt("1", 10);
        var z1 = str2bigInt("0", 10);
        var x2 = base;
        var z2 = str2bigInt("1", 10);

        for (i = 17; i >= 0; i--) {
                var j = 14;
                if (i == 17) {
                        j = 0;
                }
                for (; j >= 0; j--) {
                        if (scalar[i]&0x4000) {
                                var point = groupAdd(base, x1, z1, x2, z2);
                                x1 = point[0];
                                z1 = point[1];
                                point = groupDouble(x2, z2);
                                x2 = point[0];
                                z2 = point[1];
                        } else {
                                var point = groupAdd(base, x1, z1, x2, z2);
                                x2 = point[0];
                                z2 = point[1];
                                point = groupDouble(x1, z1);
                                x1 = point[0];
                                z1 = point[1];
                        }
                        scalar[i] <<= 1;
                }
        }

        var z1inv = powMod(z1, p25519Minus2, p25519);
        var x = multMod(z1inv, x1, p25519);

        return x;
}


// P256



// var priv = randBigInt(256)
// var pub = scalarMultP256(p256Gx, p256Gy, priv)
// var message = str2bigInt("2349623424239482634", 10)
// var signature = ecdsaSign(priv, message)
// print (ecdsaVerify(pub, signature, message))

// p256 is the p256 prime
var p256 = str2bigInt("115792089210356248762697446949407573530086143415290314195533631308867097853951", 10);
// n256 is the number of points in the group
var n256 = str2bigInt("115792089210356248762697446949407573529996955224135760342422259061068512044369", 10);
// b256 is a parameter of the curve
var b256 = str2bigInt("5ac635d8aa3a93e7b3ebbd55769886bc651d06b0cc53b0f63bce3c3e27d2604b", 16);
// p256Gx and p256Gy is the generator of the group
var p256Gx = str2bigInt("6b17d1f2e12c4247f8bce6e563a440f277037d812deb33a0f4a13945d898c296", 16);
var p256Gy = str2bigInt("4fe342e2fe1a7f9b8ee7eb4a7c0f9e162bce33576b315ececbb6406837bf51f5", 16);




function privateKeyToString(p){
  return bigInt2str(p, 64);
}

function privateKeyFromString(s){
  return str2bigInt(s, 64);
}


function sigToString(p){
  return JSON.stringify([bigInt2str(p[0], 64), bigInt2str(p[1], 64)]);
}

function sigFromString(s){
  p = JSON.parse(s);
  p[0] = str2bigInt(p[0], 64);
  p[1] = str2bigInt(p[1], 64);
  return p;
}

function publicKeyToString(p){
  return JSON.stringify([bigInt2str(p[0], 64), bigInt2str(p[1], 64)]);
}

function publicKeyFromString(s){
  p = JSON.parse(s);
  p[0] = str2bigInt(p[0], 64);
  p[1] = str2bigInt(p[1], 64);
  return p;
}

function ecdsaGenPrivateKey(){
  return privateKeyToString(randBigInt(256));
}

function ecdsaGenPublicKey(privateKey){
  return publicKeyToString(scalarMultP256(p256Gx, p256Gy, privateKeyFromString(privateKey)));
}

// isOnCurve returns true if the given point is on the curve.
function isOnCurve(x, y) {
        // y² = x³ - 3x + b
        var yy = multMod(y, y, p);
        var xxx = multMod(x, mult(x, x), p);
        var threex = multMod(three, x, p);
        var s = add(xxx, b256);
        if (greater(threex, s)) {
                return false;
        }
        s = sub(s, threex);
        return equals(s, yy);
}

// subMod returns a-b mod m
function subMod(a, b, m) {
        if (greater(a, b)) {
                return mod(sub(a, b), m);
        }
        tmp = mod(sub(b, a), m);
        return sub(m, tmp);

}

// addJacobian adds two elliptic curve points in Jacobian form.
function addJacobian(x1, y1, z1, x2, y2, z2) {
        var z1z1 = multMod(z1, z1, p256);
        var z2z2 = multMod(z2, z2, p256);
        var u1 = multMod(x1, z2z2, p256);
        var u2 = multMod(x2, z1z1, p256);
        var s1 = multMod(y1, multMod(z2, z2z2, p256), p256);
        var s2 = multMod(y2, multMod(z1, z1z1, p256), p256);
        var h = subMod(u2, u1, p256);
        var i = mult(h, two);
        i = multMod(i, i, p256);
        j = multMod(h, i, p256)

        var r = subMod(s2, s1, p256);
        r = mult(r, two);

        var v = multMod(u1, i, p256);
        var x3 = mult(r, r);
        x3 = subMod(x3, j, p256);
        var twoV = mult(v, two);
        x3 = subMod(x3, twoV, p256);

        var tmp = subMod(v, x3, p256);
        tmp = mult(r, tmp);
        var y3 = mult(s1, j);
        y3 = mult(y3, two);
        y3 = subMod(tmp, y3, p256);

        var tmp = add(z1, z2);
        tmp = multMod(tmp, tmp, p256);
        tmp = subMod(tmp, z1z1, p256);
        tmp = subMod(tmp, z2z2, p256);
        var z3 = multMod(tmp, h, p256);

        return [x3, y3, z3];
}

// doubleJacobian doubles an elliptic curve point in Jacobian form.
function doubleJacobian(x, y, z) {
        var delta = multMod(z, z, p256);
        var gamma = multMod(y, y, p256);
        var beta = multMod(x, gamma, p256);
        var alpha = mult(three, mult(subMod(x, delta, p256), add(x, delta)));
        var x3 = subMod(multMod(alpha, alpha, p256), mult(eight, beta), p256);
        var tmp = add(y, z);
        tmp = mult(tmp, tmp);
        var z3 = subMod(subMod(tmp, gamma, p256), delta, p256);
        tmp = mult(eight, mult(gamma, gamma));
        var y3 = subMod(multMod(alpha, subMod(mult(four, beta), x3, p256), p256), tmp, p256);

        return [x3, y3, z3];
}

// affineFromJacobian returns the affine point corresponding to the given
// Jacobian point.
function affineFromJacobian(x, y, z) {
        var zinv = inverseMod(z, p256);
        var zinvsq = multMod(zinv, zinv, p256);

        var outx = multMod(x, zinvsq, p256);
        var zinv3 = multMod(zinvsq, zinv, p256);
        var outy = multMod(y, zinv3, p256);

        return [outx, outy];
}

// scalarMultP256 returns in_k*(bx,by)
function scalarMultP256(bx, by, in_k) {
        var bz = [1, 0];
        var k = dup(in_k);

        // The Jacobian functions don't work with the point at infinity so we
        // start with 1, not zero.
        var x = bx;
        var y = by;
        var z = bz;

        var seenFirstTrue = false;
        for (var i = k.length-1; i >= 0; i--) {
                for (var j = 14; j >= 0; j--) {
                  if (seenFirstTrue) {
                          var point = doubleJacobian(x, y, z);
                          x = point[0];
                          y = point[1];
                          z = point[2];
                  }
                  if (k[i]&0x4000) {
                          if (!seenFirstTrue) {
                                  seenFirstTrue = true;
                          } else {
                                  var point = addJacobian(bx, by, bz, x, y, z);
                                  x = point[0];
                                  y = point[1];
                                  z = point[2];
                          }
                  }
                  k[i] <<= 1;
                }
        }

        if (!seenFirstTrue) {
                return [[0], [0]];
        }

        return affineFromJacobian(x, y, z);
}

// ecdsaSign returns a signature of message as an array [r,s]. message is a
// bigint, however it should be generated by hashing the true message and
// converting it to bigint. Note: if attempting to interoperate you should be
// careful because the NSA and SECG documents differ on how the conversion to
// an interger occurs. SECG says that you should truncate to the big-length of
// the curve first and that's what OpenSSL does.
function ecdsaSign(privateKey, message) {
        var r;
        var s;

        priv = privateKeyFromString(privateKey);

        m = mod(CryptoJS.SHA512(JSON.stringify(message)).toString(CryptoJS.enc.Hex).substring(0,32), n256);

        while (true) {
                var k;
                while (true) {
                        k = randBigInt(256);
                        var point = scalarMultP256(p256Gx, p256Gy, k);
                        var r = point[0];
                        r = mod(r, n256);
                        if (!isZero(r)) {
                                break;
                        }
                }

                var s = multMod(priv, r, n256);
                s = add(s, m);
                kinv = inverseMod(k, n256);
                s = multMod(s, kinv, n256);
                if (!isZero(s)) {
                        break;
                }
        }

        return sigToString([r,s]);
}

// ecdsaVerify returns true iff signature is a valid ECDSA signature for
// message. See the comment above ecdsaSign about converting a message into the
// bigint |message|.
function ecdsaVerify(publicKey, signature, message) {

        pub = publicKeyFromString(publicKey);
        sig = sigFromString(signature);

        m = mod(CryptoJS.SHA512(JSON.stringify(message)).toString(CryptoJS.enc.Hex).substring(0,32), n256);

        var r = sig[0]
        var s = sig[1]

        if (isZero(r) || isZero(s)) {
                return false;
        }

        if (greater(r, n256) || greater(s, n256)) {
                return false;
        }

        var w = inverseMod(s, n256);
        var u1 = multMod(m, w, n256);
        var u2 = multMod(r, w, n256);

        var point1 = scalarMultP256(p256Gx, p256Gy, u1);
        var point2 = scalarMultP256(pub[0], pub[1], u2);
        if (equals(point1[0], point2[0])) {
                return false;
        }

        var one = [1, 0];
        var point3 = addJacobian(point1[0], point1[1], one, point2[0], point2[1], one);
        var point4 = affineFromJacobian(point3[0], point3[1], point3[2]);
        mod(point3, n256);
        return equals(point4[0], r);
}

function ecDH(priv, pub) {
	if (typeof pub === "undefined") {
		return scalarMult(priv, basePoint);
	}
	else {
        return bigInt2str(scalarMult(priv, pub), 64);
	}
}
