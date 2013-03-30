var _ = require('lodash'),
    path = require('path'),
    test = require('../../testbase')();

var Salsa20 = require('../../../src/chrome/js/salsa20');


test['Salsa20'] = {

  'key=80000000000000000000000000000000, nonce=0000000000000000, ': {
    beforeEach: function() {
      this.salsa20 = new Salsa20([8,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0], [0,0,0,0,0,0,0,0]);
    },

    'check first 512 bytes': function() {
      test.assert.same(
          this.salsa20.getHexString(512),
          '5b393241fd4138028805e664fdd1589f45379ccb57f884234329013e5f0ac632' +
          '0ed2c012bff2b4cbec4f102abad7380828c3a4872995ff062626039958757f91' +
          'ffadf73799ffc0662d41b9e2a646c9fce9486ba8e7ab433623452151fdd06a23' +
          '04c64a5ebcf7e7f1a03df95855f3cf1e8f3a95f33b330325ba0e87eba988e9d1' +
          '7eeff4eb21ba6a13c3774dc0a4d2fcacafbc9dc4b5b6d72d4b8d44d86b4f5fe7' +
          'dcb4cd4f7b9b2bdcbf2e53c50ff5ebc9f62ab923e2204221bc019afdb32f7493' +
          'bab99f2e7bb4708c20480884e77ad038b260c56ec89317847f3548bf12c50f73' +
          '06e44f7453fa4565658f02d9b839c6c3e1c255c813d8fb2bf621ac0e32da99a3' +
          '62fe684d8a57078601bf1809a2ed96df5da5b8d248b87118cd5b20a2945cafb6' +
          'f578933bdfd4ae25955088a30d57810f031b6582bf75cb7dba3dde96d07be006' +
          '6a6a56031fb1a40ac095a6978a7f68a2f34d854bef168cc5c8669290976b6ff4' +
          'cebd421b6dea6242926715c8161c330756ebf0217d84ec942a04664d56a1c8ba' +
          '0408c91f2242dc1dff5052bce9f73f7f29d9887bbe6370f1899af0285d22f28b' +
          '78e42cd079d391993a2e1c11d4b9e307ca7377828d1a48a569b47553e98f9ec4' +
          '6ecc14402da20972df13a86a7707b782c50673a220583d8bcbc5408780f95697' +
          '7edb177c27da09644efa06e008b7fc659e06a532223e88675820ba78e6647877'
      );
    }
  }

};



module.exports[path.basename(__filename)] = test;
