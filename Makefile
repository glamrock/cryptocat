DESTDIR ?= /var/www

build-server:
	cd src/server/js/src/ && ./make.sh

install-server:
	cp -LR src/server/* $(DESTDIR)/

build-chrome-zip:
	cat src/client/chrome-plugin/js/src/seedrandom.js > src/client/chrome-plugin/js/build.js
	cat src/client/chrome-plugin/js/src/aes.js >> src/client/chrome-plugin/js/build.js
	cat src/client/chrome-plugin/js/src/mode-ctr.js >> src/client/chrome-plugin/js/build.js
	cat src/client/chrome-plugin/js/src/pad-nopadding.js >> src/client/chrome-plugin/js/build.js
	cat src/client/chrome-plugin/js/src/x64-core.js >> src/client/chrome-plugin/js/build.js
	cat src/client/chrome-plugin/js/src/sha512.js >> src/client/chrome-plugin/js/build.js
	cat src/client/chrome-plugin/js/src/hmac.js >> src/client/chrome-plugin/js/build.js
	cat src/client/chrome-plugin/js/src/fortuna.js >> src/client/chrome-plugin/js/build.js
	cat src/client/chrome-plugin/js/src/bigint.js >> src/client/chrome-plugin/js/build.js
	cat src/client/chrome-plugin/js/src/elliptic.js >> src/client/chrome-plugin/js/build.js
	cd src/client/chrome-plugin/ && zip -r9 cryptocat-plugin.zip *
	mv src/client/chrome-plugin/cryptocat-plugin.zip .

build-android-apk:
	cat src/client/android/assets/www/js/src/seedrandom.js > src/client/android/assets/www/js/build.js
	cat src/client/android/assets/www/js/src/aes.js >> src/client/android/assets/www/js/build.js
	cat src/client/chrome-plugin/js/src/mode-ctr.js >> src/client/chrome-plugin/js/build.js
	cat src/client/chrome-plugin/js/src/pad-nopadding.js >> src/client/chrome-plugin/js/build.js
	cat src/client/chrome-plugin/js/src/x64-core.js >> src/client/chrome-plugin/js/build.js
	cat src/client/chrome-plugin/js/src/sha512.js >> src/client/chrome-plugin/js/build.js
	cat src/client/android/assets/www/js/src/hmac.js >> src/client/android/assets/www/js/build.js
	cat src/client/android/assets/www/js/src/fortuna.js >> src/client/android/assets/www/js/build.js
	cat src/client/android/assets/www/js/src/bigint.js >> src/client/android/assets/www/js/build.js
	cat src/client/android/assets/www/js/src/elliptic.js >> src/client/android/assets/www/js/build.js
	git submodule init
	git submodule update
	android update project -p src/client/android/
	ant release -f src/client/android/build.xml

clean:
	-rm src/client/android/assets/www/js/build.js
	-rm src/server/js/build.js
	ant clean -f src/client/android/build.xml
	-rm src/client/android/local.properties