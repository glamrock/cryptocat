chrome:
	cat src/chrome/js/src/seedrandom.js > src/chrome/js/build.js
	cat src/chrome/js/src/aes.js >> src/chrome/js/build.js
	cat src/chrome/js/src/mode-ctr.js >> src/chrome/js/build.js
	cat src/chrome/js/src/pad-nopadding.js >> src/chrome/js/build.js
	cat src/chrome/js/src/x64-core.js >> src/chrome/js/build.js
	cat src/chrome/js/src/sha512.js >> src/chrome/js/build.js
	cat src/chrome/js/src/hmac.js >> src/chrome/js/build.js
	cat src/chrome/js/src/fortuna.js >> src/chrome/js/build.js
	cat src/chrome/js/src/bigint.js >> src/chrome/js/build.js
	cat src/chrome/js/src/elliptic.js >> src/chrome/js/build.js
	cd src/chrome/ && zip -r9 cryptocat-chrome.zip *
	mv src/chrome/cryptocat-chrome.zip .

clean:
	-rm src/client/chrome/js/build.js
