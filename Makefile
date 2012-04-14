build-chrome-extension:
	google-chrome --pack-extension=`pwd`/src/client/chrome-plugin/

build-chrome-extension-signed:
	google-chrome --pack-extension=`pwd`/src/client/chrome-plugin/ --pack-extension-key=`pwd`/src/client/chrome-plugin.pem
