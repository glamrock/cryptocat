build-chrome-extension:
	google-chrome --pack-extension=`pwd`/src/client/chrome-plugin/
	mv src/client/chrome-plugin.crx out/cryptocat-plugin.crx

build-chrome-extension-signed:
	google-chrome --pack-extension=`pwd`/src/client/chrome-plugin/ --pack-extension-key=`pwd`/src/client/chrome-plugin.pem
	mv src/client/chrome-plugin.crx out/cryptocat-plugin.crx

clean:
	rm out/*

really-clean:
	rm out/*
	rm src/client/chrome-plugin.pem
