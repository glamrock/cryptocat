chrome:
	@/bin/echo -n "[Cryptocat] Compressing... "
	@cd src/chrome/ && zip -q -r9 ../../release/cryptocat-chrome.zip * -x "*/\.*" -x "\.*"
	@/bin/echo "done"
	@/bin/echo "[Cryptocat] Chrome build available in release/"

firefox:
	@/bin/echo -n "[Cryptocat] Compressing... "
	@cd src/firefox/ && zip -q -r9 ../../release/cryptocat-firefox.xpi * -x "*/\.*" -x "\.*"
	@/bin/echo "done"
	@/bin/echo "[Cryptocat] Firefox build available in release/"

opera:
	@/bin/echo -n "[Cryptocat] Compressing... "
	@cd src/opera/ && zip -q -r9 ../../release/cryptocat-opera.oex * -x "*/\.*" -x "\.*"
	@/bin/echo "done"
	@/bin/echo "[Cryptocat] Opera build available in release/"
changes:
	@/bin/echo -n "[Cryptocat] Pushing changes to Safari...  "
	@cd src/cryptocat.safariextension/ && rm -rf css img js locale index.html
	@cd src/chrome/ && cp -R css img js locale index.html ../cryptocat.safariextension/
	@/bin/echo "done"
	@/bin/echo -n "[Cryptocat] Pushing changes to Firefox... "
	@cd src/firefox/chrome/content/data/ && rm -rf css img js locale index.html
	@cd src/chrome/ && cp -R css img js locale index.html ../firefox/chrome/content/data/
	@/bin/echo "done"
	@/bin/echo -n "[Cryptocat] Pushing changes to Opera... "
	@cd src/opera/ && rm -rf css img js locale index.html
	@cd src/chrome/ && cp -R css img js locale index.html ../opera/
	@/bin/echo "done"
