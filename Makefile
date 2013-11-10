chrome:
	@mkdir -p release
	@rm -f release/cryptocat.chrome.zip
	@cd src/core/ && zip -q -r9 ../../release/cryptocat.chrome.zip * -x "*/\.*" -x "\.*"
	@/bin/echo "[Cryptocat] Chrome build available in release/"

firefox:
	@mkdir -p release
	@rm -f release/cryptocat.firefox.xpi
	@mkdir src/firefox/chrome/content/data/
	@cp -r src/core/* src/firefox/chrome/content/data/
	@cd src/firefox/ && zip -q -r9 ../../release/cryptocat.firefox.xpi * -x "*/\.*" -x "\.*"
	@rm -r src/firefox/chrome/content/data/
	@/bin/echo "[Cryptocat] Firefox build available in release/"

safari:
	@rm -rf src/cryptocat.safariextension
	@cp -R src/core src/cryptocat.safariextension
	@cp -R src/safari/* src/cryptocat.safariextension
	@/bin/echo "[Cryptocat] Safari extension packaged for testing."

opera:
	@mkdir -p release
	@rm -f release/cryptocat_opera.nex
	@cp -r src/core/css src/core/img src/core/index.html src/core/js src/core/locale src/core/snd src/opera
	@cd src/opera/ && zip -q -r9 ../../release/cryptocat_opera.nex * -x "*/\.*" -x "\.*"
	@rm -rf src/opera/css src/opera/img src/opera/index.html src/opera/js src/opera/locale src/opera/snd
	@/bin/echo "[Cryptocat] Opera build available in release/"

mac:
	@brew install openssl libevent
	@brew link openssl --force
	@git submodule update --init --recursive
	@rm -rf release/Cryptocat.app
	@rm -rf release/cryptocat.mac.zip
	@cp -R src/core/* src/mac/htdocs
	@xcodebuild -project src/mac/Cryptocat.xcodeproj -configuration 'Release' clean
	@xcodebuild CONFIGURATION_BUILD_DIR="${PWD}/release" -project src/mac/Cryptocat.xcodeproj -configuration 'Release' build
	@rm -rf release/Cryptocat.app.dSYM
	@rm -rf src/mac/htdocs/*
	@echo "." >> src/mac/htdocs/placeholder.txt
	@rm -rf release/Tor.framework
	@rm -rf release/Tor.framework.dSYM
	@cd release && zip -q -r9 cryptocat.mac.zip Cryptocat.app
	@/bin/echo "[Cryptocat] Mac app available in release/"

tests:
	@/bin/echo "[Cryptocat] Running tests... "
	@`/usr/bin/which npm` install
	@node_modules/.bin/mocha --ui exports --reporter spec test/core/js/*.test.js

lint:
	@node_modules/.bin/jshint --verbose --config .jshintrc \
		src/core/js/cryptocat.js \
		src/core/js/lib/multiParty.js \
		src/core/js/lib/elliptic.js \
		src/core/js/lib/salsa20.js \
		src/core/js/etc/*.js \
		src/standaloneServer.js \
		test/testBase.js \
		test/core/js/*.js \
		Gruntfile.js

all: lint tests
