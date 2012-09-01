chrome:
	cp src/common/img/* src/chrome/img/
	cd src/chrome/ && zip -r9 cryptocat-chrome.zip *
	mv src/chrome/cryptocat-chrome.zip .
	rm -f src/chrome/img/*

clean:

