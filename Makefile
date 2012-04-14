build-chrome-extension:
	cat `pwd`/src/client/chrome-plugin/js/*.js >>`pwd`/src/client/chrome-plugin/js/build.js
	google-chrome --pack-extension=`pwd`/src/client/chrome-plugin/
	mv src/client/chrome-plugin.crx out/cryptocat-plugin.crx

build-chrome-extension-signed:
	cat `pwd`/src/client/chrome-plugin/js/*.js >>`pwd`/src/client/chrome-plugin/js/build.js
	google-chrome --pack-extension=`pwd`/src/client/chrome-plugin/ --pack-extension-key=`pwd`/src/client/chrome-plugin.pem
	mv src/client/chrome-plugin.crx out/cryptocat-plugin.crx

clean:
	-rm `pwd`/src/client/chrome-plugin/js/build.js
	-rm out/*.crx

really-clean:
	-rm out/*.crx
	-rm `pwd`/src/client/chrome-plugin/js/build.js
	-rm src/client/chrome-plugin.pem
