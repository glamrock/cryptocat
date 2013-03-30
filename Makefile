chrome:
	@/bin/echo -n "[Cryptocat] Compressing... "
	@cd src/chrome/ && zip -q -r9 ../../release/cryptocat-chrome.zip * -x "*/\.*" -x "\.*"
	@/bin/echo "               done"
	@/bin/echo "[Cryptocat] Chrome build available in release/"

firefox:
	@/bin/echo -n "[Cryptocat] Compressing... "
	@cd src/firefox/ && zip -q -r9 ../../release/cryptocat-firefox.xpi * -x "*/\.*" -x "\.*"
	@/bin/echo "               done"
	@/bin/echo "[Cryptocat] Firefox build available in release/"
changes:
	@/bin/echo -n "[Cryptocat] Pushing changes to Safari...  "
	@cd src/cryptocat.safariextension/ && rm -rf css img js locale snd index.html
	@cd src/chrome/ && cp -R css img js locale snd index.html ../cryptocat.safariextension/
	@/bin/echo "done"
	@/bin/echo -n "[Cryptocat] Pushing changes to Firefox... "
	@cd src/firefox/chrome/content/data/ && rm -rf css img js locale snd index.html
	@cd src/chrome/ && cp -R css img js locale snd index.html ../firefox/chrome/content/data/
	@/bin/echo "done"

tests:
	@/bin/echo -n "[Cryptocat] Running tests... "
	@`/usr/bin/which npm` install
	@node_modules/.bin/mocha --ui exports --reporter spec test/chrome/js/*.test.js
