#!/bin/bash
cp -f src/cryptocat.safariextension/css/style.css src/common/css/
cp -f src/cryptocat.safariextension/index.html src/common/
cp -f src/cryptocat.safariextension/manifest.json src/chrome/manifest.json
cp -f src/cryptocat.safariextension/js/cryptocat.js src/common/js/cryptocat.js
cp -f src/cryptocat.safariextension/js/keygenerator.js src/common/js/keygenerator.js
cp -f src/cryptocat.safariextension/js/catfacts.js src/common/js/catfacts.js
cp -f src/cryptocat.safariextension/js/datareader.js src/common/js/datareader.js
cp -f src/cryptocat.safariextension/js/elliptic.js src/common/js/elliptic.js
cp -f src/cryptocat.safariextension/js/multiparty.js src/common/js/multiparty.js
cp -f src/cryptocat.safariextension/js/language.js src/common/js/language.js
rm -f src/common/locale/* && cp src/cryptocat.safariextension/locale/* src/common/locale/
rm -f src/common/img/* && cp src/cryptocat.safariextension/img/* src/common/img/
