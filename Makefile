DESTDIR ?= /var/www/cryptocat/

build-chrome-zip:
	cat src/client/chrome-plugin/js/src/crypto.js >> src/client/chrome-plugin/js/build.js
	cat src/client/chrome-plugin/js/src/blockmodes.js >> src/client/chrome-plugin/js/build.js
	cat src/client/chrome-plugin/js/src/aes.js >> src/client/chrome-plugin/js/build.js
	cat src/client/chrome-plugin/js/src/hmac.js >> src/client/chrome-plugin/js/build.js
	cat src/client/chrome-plugin/js/src/fortuna.js >> src/client/chrome-plugin/js/build.js
	cat src/client/chrome-plugin/js/src/whirlpool.js >> src/client/chrome-plugin/js/build.js
	cat src/client/chrome-plugin/js/src/seedrandom.js >> src/client/chrome-plugin/js/build.js
	cat src/client/chrome-plugin/js/src/bigint.js >> src/client/chrome-plugin/js/build.js
	cd src/client/chrome-plugin/ && zip -r9 cryptocat-plugin.zip *
	mv src/client/chrome-plugin/cryptocat-plugin.zip .

build-chrome-crx:
	cat src/client/chrome-plugin/js/src/crypto.js >> src/client/chrome-plugin/js/build.js
	cat src/client/chrome-plugin/js/src/blockmodes.js >> src/client/chrome-plugin/js/build.js
	cat src/client/chrome-plugin/js/src/aes.js >> src/client/chrome-plugin/js/build.js
	cat src/client/chrome-plugin/js/src/hmac.js >> src/client/chrome-plugin/js/build.js
	cat src/client/chrome-plugin/js/src/fortuna.js >> src/client/chrome-plugin/js/build.js
	cat src/client/chrome-plugin/js/src/whirlpool.js >> src/client/chrome-plugin/js/build.js
	cat src/client/chrome-plugin/js/src/seedrandom.js >> src/client/chrome-plugin/js/build.js
	cat src/client/chrome-plugin/js/src/bigint.js >> src/client/chrome-plugin/js/build.js
	google-chrome --pack-extension=`pwd`/src/client/chrome-plugin/
	mv src/client/chrome-plugin.crx cryptocat-plugin.crx

build-chrome-crx-signed:
	cat src/client/chrome-plugin/js/src/crypto.js >> src/client/chrome-plugin/js/build.js
	cat src/client/chrome-plugin/js/src/blockmodes.js >> src/client/chrome-plugin/js/build.js
	cat src/client/chrome-plugin/js/src/aes.js >> src/client/chrome-plugin/js/build.js
	cat src/client/chrome-plugin/js/src/hmac.js >> src/client/chrome-plugin/js/build.js
	cat src/client/chrome-plugin/js/src/fortuna.js >> src/client/chrome-plugin/js/build.js
	cat src/client/chrome-plugin/js/src/whirlpool.js >> src/client/chrome-plugin/js/build.js
	cat src/client/chrome-plugin/js/src/seedrandom.js >> src/client/chrome-plugin/js/build.js
	cat src/client/chrome-plugin/js/src/bigint.js >> src/client/chrome-plugin/js/build.js
	google-chrome --pack-extension=`pwd`/src/client/chrome-plugin/ --pack-extension-key=`pwd`/src/client/chrome-plugin.pem
	mv src/client/chrome-plugin.crx cryptocat-plugin.crx

build-android-apk:
	android-update-project -p src/client/android/CryptocatBot/
	ant-debug-release src/client/android/CryptocatBot/build.xml
#	mv src/client/android/CryptocatBot/bin/CryptocatBot/bin/foo.apk

js-server-build:
	cat src/server/js/src/crypto.js >> src/server/js/build.js
	cat src/server/js/src/blockmodes.js >> src/server/js/build.js
	cat src/server/js/src/aes.js >> src/server/js/build.js
	cat src/server/js/src/hmac.js >> src/server/js/build.js
	cat src/server/js/src/fortuna.js >> src/server/js/build.js
	cat src/server/js/src/whirlpool.js >> src/server/js/build.js
	cat src/server/js/src/seedrandom.js >> src/server/js/build.js
	cat src/server/js/src/bigint.js >> src/server/js/build.js

install: js-server-build
	install -m 0755 src/server/index.php -d $(DESTDIR)
	install -m 0644 src/server/css -d $(DESTDIR)
	install -m 0644 src/server/img -d $(DESTDIR)
	install -m 0644 src/server/js -d $(DESTDIR)
	install -m 0644 src/server/snd -d $(DESTDIR)

clean:
	-rm src/client/chrome-plugin/js/build.js
	-rm src/server/js/build.js
	-rm out/*.crx
	-rm out/*.apk

really-clean:
	-rm out/*.crx
	-rm src/client/chrome-plugin/js/build.js
	-rm src/client/chrome-plugin.pem
