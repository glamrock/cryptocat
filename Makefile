chrome:
	@rm -f release/cryptocat-chrome.zip
	@cd src/core/ && zip -q -r9 ../../release/cryptocat-chrome.zip * -x "*/\.*" -x "\.*"
	@/bin/echo "[Cryptocat] Chrome build available in release/"

firefox:
	@rm -f release/cryptocat-firefox.xpi
	@cp -r src/core/* src/firefox/chrome/content/data/
	@cd src/firefox/ && zip -q -r9 ../../release/cryptocat-firefox.xpi * -x "*/\.*" -x "\.*"
	@rm -r src/firefox/chrome/content/data/*
	@/bin/echo "[Cryptocat] Firefox build available in release/"

safari:
	@rm -rf src/cryptocat.safariextension
	@cp -R src/core src/cryptocat.safariextension
	@cp -R src/safari/* src/cryptocat.safariextension
	@/bin/echo "[Cryptocat] Safari extension packaged for testing."

mac:
	@rm -rf src/mac/htdocs
	@cp -R src/core src/mac/htdocs
	@/bin/echo "[Cryptocat] Mac app packaged for testing."

tests:
	@/bin/echo -n "[Cryptocat] Running tests... "
	@`/usr/bin/which npm` install
	@node_modules/.bin/mocha --ui exports --reporter spec test/core/js/*.test.js

lint:
	@node_modules/.bin/jshint --verbose --config .jshintrc \
		src/core/js/cryptocat.js \
		src/core/js/lib/multiParty.js \
		src/core/js/lib/elliptic.js \
		src/core/js/etc/*.js \
		test/testBase.js \
		test/core/js/*.js

all: lint tests
