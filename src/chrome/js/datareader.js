/*global postMessage self FileReader importScripts Cryptocat CryptoJS */

;(function(){
  "use strict";

  importScripts('crypto-js/core.js');
  importScripts('crypto-js/enc-base64.js');
  importScripts('salsa20.js');
  importScripts('cryptocatRandom.js');

  var files = {};
  var fileSize = 700;
  var chunkSize = 4096;

  function uniqueId() {
    return Cryptocat.randomString(64, 1, 1, 1, 0) + ":" + "ibb";
  }

  var mime = new RegExp(
    '(image.*)|(application/((x-compressed)|' +
    '(x-zip-compressed)|(zip)))|(multipart/x-zip)'
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
        } else if (file.size > (fileSize * 1024)) {
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
          file: file
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
            to: data.to
          });
          return;
        }

        var end = files[sid].position + chunkSize;
        var chunk = files[sid].file.slice(files[sid].position, end);
        files[sid].position = end;

        var reader = new FileReader();
        reader.onload = function(event) {
          postMessage({
            type: 'data',
            sid: data.sid,
            to: data.to,
            seq: seq,
            data: event.target.result
          });
        }
        reader.readAsDataURL(chunk);
        break;

    }

  }, false);

}());