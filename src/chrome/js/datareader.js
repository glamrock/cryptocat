/*global postMessage self FileReaderSync importScripts Cryptocat */

// var node = "<iq id=\"" + uniqueId() + "\" to=\"\" type=\"set\">"
//   + "<si xmlns=\"http://jabber.org/protocol/si\" id=\"" + uniqueId() + "\" profile=\"http://jabber.org/protocol/si/profile/file-transfer\">"
//   + "<file xmlns=\"http://jabber.org/protocol/si/profile/file-transfer\" name=\"" + file.name + "\" size=\"" + file.size + "\"/>"
//   + "<feature xmlns=\"http://jabber.org/protocol/feature-neg\">"
//   + "<x xmlns=\"jabber:x:data\" type=\"form\">"
//   + "<field var=\"stream-method\" type=\"list-single\">"
//   + "<option><value>http://jabber.org/protocol/ibb</value></option>"
//   + "</field>"
//   + "</x>"
//   + "</feature>"
//   + "</si>"
//   + "</iq>";

;(function(){
  "use strict";

  importScripts('salsa20.js');
  importScripts('cryptocatRandom.js');

  var sendingFiles = {};

  function uniqueId() {
    return Cryptocat.randomString(64, 1, 1, 1, 0) + ":" + "ibb";
  }

  var fileSize = 700;
  var mime = new RegExp(
    '(image.*)|(application/((x-compressed)|' +
    '(x-zip-compressed)|(zip)))|(multipart/x-zip)'
  );

  self.addEventListener('message', function(e) {
    var data = e.data;

    switch (data.type) {

      case 'seed':
        Cryptocat.setSeed(data.seed);
        return;

      case 'open':
        var file = data.file;

        var error;
        if (!file.type.match(mime)) {
          error = 'typeError';
        } else if (file.size > (fileSize * 1024)) {
          error = 'sizeError';
        }

        if (error) {
          postMessage({ type: 'error', error: error });
          return;
        }

        var to = data.to;
        var sid = uniqueId();

        sendingFiles[sid] = {
          to: to,
          seq: 0,
          file: file
        };

        postMessage({
          type: 'open',
          sid: sid,
          to: to,
          close: true
        });
        break;

      case 'data':
        var seq;
        if (data.start) {
          seq = 0
          var reader = new FileReaderSync();
          file = reader.readAsDataURL(sendingFiles[data.sid].file);
          postMessage({
            type: 'data',
            sid: data.sid,
            to: data.to,
            seq: seq,
            data: file
          });
        } else {
          postMessage({
            type: 'close',
            sid: data.sid,
            to: data.to
          });
        }
        break;

    }

  }, false);

}());