chrome:
	cat src/chrome/js/src/seedrandom.js > src/client/chrome-plugin/js/build.js
	cat src/chrome/js/src/aes.js >> src/client/chrome-plugin/js/build.js
	cat src/chrome/js/src/mode-ctr.js >> src/client/chrome-plugin/js/build.js
	cat src/chrome/js/src/pad-nopadding.js >> src/client/chrome-plugin/js/build.js
	cat src/chrome/js/src/x64-core.js >> src/client/chrome-plugin/js/build.js
	cat src/chrome/js/src/sha512.js >> src/client/chrome-plugin/js/build.js
	cat src/chrome/js/src/hmac.js >> src/client/chrome-plugin/js/build.js
	cat src/chrome/js/src/fortuna.js >> src/client/chrome-plugin/js/build.js
	cat src/chrome/js/src/bigint.js >> src/client/chrome-plugin/js/build.js
	cat src/chrome/js/src/elliptic.js >> src/client/chrome-plugin/js/build.js
	cd src/chrome/ && zip -r9 cryptocat-chrome.zip *
	mv src/client/chrome/cryptocat-chrome.zip .

clean:
	-rm src/client/chrome/js/build.js
