chrome:
	cd src/chrome/ && zip -r9 cryptocat-chrome.zip * -x "*/\.*" -x "\.*"
	mv src/chrome/cryptocat-chrome.zip release

firefox:
	cd src/firefox/ && zip -r9 cryptocat-firefox.xpi * -x "*/\.*" -x "\.*"
	mv src/firefox/cryptocat-firefox.xpi release

changes:
	cd src/cryptocat.safariextension/ && rm -rf css img js locale snd index.html
	cd src/chrome/ && cp -R css img js locale snd index.html ../cryptocat.safariextension/
	cd src/firefox/chrome/content/data/ && rm -rf css img js locale snd index.html
	cd src/chrome/ && cp -R css img js locale snd index.html ../firefox/chrome/content/data/