changes:
	cd src/cryptocat.safariextension/ && rm -rf css img js locale snd index.html
	cd src/chrome/ && cp -R css img js locale snd index.html ../cryptocat.safariextension/
	cd src/firefox/chrome/content/data/ && rm -rf css img js locale snd index.html
	cd src/chrome/ && cp -R css img js locale snd index.html ../firefox/chrome/content/data/

chrome:
	cd src/chrome/ && zip -r9 cryptocat-chrome.zip *
	mv src/chrome/cryptocat-chrome.zip .

firefox:
	cd src/firefox/ && zip -r9 cryptocat-firefox.xpi *
	mv src/firefox/cryptocat-firefox.xpi .

clean:
	rm -f cryptocat-chrome.zip
	rm -f cryptocat-firefox.xpi
