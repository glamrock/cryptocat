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

tests:
	@/bin/echo -n "[Cryptocat] Running tests... "
	@`/usr/bin/which npm` install
	@node_modules/.bin/mocha --ui exports --reporter spec test/chrome/js/*.test.js