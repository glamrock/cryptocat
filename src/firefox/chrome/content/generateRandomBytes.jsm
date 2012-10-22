/* ***** BEGIN LICENSE BLOCK *****
 * Version: MPL 1.1/GPL 2.0/LGPL 2.1
 *
 * The contents of this file are subject to the Mozilla Public License Version
 * 1.1 (the "License"); you may not use this file except in compliance with
 * the License. You may obtain a copy of the License at
 * http://www.mozilla.org/MPL/
 *
 * Software distributed under the License is distributed on an "AS IS" basis,
 * WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License
 * for the specific language governing rights and limitations under the
 * License.
 *
 * The Original Code is mozilla.org code.
 *
 * The Initial Developer of the Original Code is
 * the Mozilla Foundation.
 * Portions created by the Initial Developer are Copyright (C) 2010
 * the Initial Developer. All Rights Reserved.
 *
 * Contributor(s):
 *  Justin Dolske <dolske@mozilla.com> (original author)
 *  David Dahl <ddahl@mozilla.com>
 *
 * Alternatively, the contents of this file may be used under the terms of
 * either the GNU General Public License Version 2 or later (the "GPL"), or
 * the GNU Lesser General Public License Version 2.1 or later (the "LGPL"),
 * in which case the provisions of the GPL or the LGPL are applicable instead
 * of those above. If you wish to allow use of your version of this file only
 * under the terms of either the GPL or the LGPL, and not to allow others to
 * use your version of this file under the terms of the MPL, indicate your
 * decision by deleting the provisions above and replace them with the notice
 * and other provisions required by the GPL or the LGPL. If you do not delete
 * the provisions above, a recipient may use your version of this file under
 * the terms of any one of the MPL, the GPL or the LGPL.
 *
 * ***** END LICENSE BLOCK ***** */

/**
 * NOTE
 *
 * *** UPDATE (ddahl): 2012-09-24 ***
 * Reduced this source code to just include GenerateRandomBytes
 *
 * The WeaveCrypto object in this file was originally pulled from hg.mozilla.org
 *
 * http://hg.mozilla.org/mozilla-central/ \
 * raw-file/d0c40fc38702/services/crypto/modules/WeaveCrypto.js
 *
 * WeaveCrypto's API as it was released in Firefox 4 was reduced in scope due
 * to Sync's move to J-Pake, hence the need for this more complete version.
 *
 */

var EXPORTED_SYMBOLS = ['WeaveCrypto'];

Cu = Components.utils;
Ci = Components.interfaces;
Cc = Components.classes;
Cu.import("resource://gre/modules/ctypes.jsm");

var WeaveCrypto = {
  
  debug      : true,
  nss        : null,
  nss_t      : null,

  log : function (message) {
    if (!this.debug)
      return;
    dump("WeaveCrypto: " + message + "\n");
  },

  shutdown : function WC_shutdown()
  {
    this.log("closing nsslib");
    this.nsslib.close();
  },

  fullPathToLib: null,

  initNSS : function WC_initNSS(aNSSPath) {
    // Open the NSS library.
    this.fullPathToLib = aNSSPath;
    // XXX really want to be able to pass specific dlopen flags here.
    var nsslib;
    nsslib = ctypes.open(this.fullPathToLib);

    this.nsslib = nsslib;
    this.log("Initializing NSS types and function declarations...");

    this.nss = {};
    this.nss_t = {};

    // nsprpub/pr/include/prtypes.h#435
    // typedef PRIntn PRBool; --> int
    this.nss_t.PRBool = ctypes.int;
    // security/nss/lib/util/seccomon.h#91
    // typedef enum
    this.nss_t.SECStatus = ctypes.int;
    this.nss_t.SECItemType = ctypes.int;
    // SECItemType enum values...
    this.nss.SIBUFFER = 0;
    // security/nss/lib/util/seccomon.h#83
    // typedef struct SECItemStr SECItem; --> SECItemStr defined right below it
    this.nss_t.SECItem = ctypes.StructType(
      "SECItem", [{ type: this.nss_t.SECItemType },
                  { data: ctypes.unsigned_char.ptr },
                  { len : ctypes.int }]);
    // security/nss/lib/pk11wrap/pk11pub.h#286
    // SECStatus PK11_GenerateRandom(unsigned char *data,int len);
    this.nss.PK11_GenerateRandom = nsslib.declare("PK11_GenerateRandom",
                                                  ctypes.default_abi, this.nss_t.SECStatus,
                                                  ctypes.unsigned_char.ptr, ctypes.int);
  },

  generateRandomBytes : function(byteCount) {
    this.log("generateRandomBytes() called");

    // Temporary buffer to hold the generated data.
    var scratch = new ctypes.ArrayType(ctypes.unsigned_char, byteCount)();
    if (this.nss.PK11_GenerateRandom(scratch, byteCount))
      throw new Error("PK11_GenrateRandom failed");
    return this.returnArray(scratch.address(), scratch.length);
  },

  //
  // Utility functions
  //

  returnArray : function (data, len) {
    var expanded = [];
    var intData = ctypes.cast(data, ctypes.uint8_t.array(len).ptr).contents;
	for (var i = 0; i < len; i++)
      expanded.push(intData[i]);
    return expanded;
  }
};