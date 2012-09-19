chrome:
	cd src/chrome/ && zip -r9 cryptocat-chrome.zip *
	mv src/chrome/cryptocat-chrome.zip .

firefox:
	cd src/firefox/ && zip -r9 cryptocat-firefox.xpi *
	mv src/firefox/cryptocat-firefox.xpi .

clean:

