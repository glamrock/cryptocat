chrome:
	@zip -q -r9 release/cryptocat-chrome.zip src/core/* src/chrome/* -x "*/\.*" -x "\.*"
	@/bin/echo "[Cryptocat] Chrome build available in release/"

firefox:
	@cp -r src/core/* src/firefox/chrome/content/data/
	@zip -q -r9 release/cryptocat-firefox.xpi src/firefox/* -x "*/\.*" -x "\.*"
	@rm -r src/firefox/chrome/content/data/*
	@/bin/echo "[Cryptocat] Firefox build available in release/"

tests:
	@/bin/echo -n "[Cryptocat] Running tests... "
	@`/usr/bin/which npm` install
	@node_modules/.bin/mocha --ui exports --reporter spec test/chrome/js/*.test.js
