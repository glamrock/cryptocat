chrome:
	@/bin/echo -n "[Cryptocat] Compressing... "
	@cd src/chrome/ && zip -q -r9 cryptocat-chrome.zip * -x "*/\.*" -x "\.*"
	@/bin/echo "done"
	@mv src/chrome/cryptocat-chrome.zip release
	@/bin/echo "[Cryptocat] Chrome build available in release/"

firefox:
	@/bin/echo -n "[Cryptocat] Compressing... "
	@cd src/firefox/ && zip -q -r9 cryptocat-firefox.xpi * -x "*/\.*" -x "\.*"
	@/bin/echo "done"
	@mv src/firefox/cryptocat-firefox.xpi release
	@/bin/echo "[Cryptocat] Firefox build available in release/"

changes:
	@/bin/echo -n "[Cryptocat] Pushing changes to Safari...  "
	@cd src/cryptocat.safariextension/ && rm -rf css img js locale index.html
	@cd src/chrome/ && cp -R css img js locale index.html ../cryptocat.safariextension/
	@/bin/echo "done"
	@/bin/echo -n "[Cryptocat] Pushing changes to Firefox... "
	@cd src/firefox/chrome/content/data/ && rm -rf css img js locale index.html
	@cd src/chrome/ && cp -R css img js locale index.html ../firefox/chrome/content/data/
	@/bin/echo "done"