## Cryptocat - browser-based webapp for encrypted chat
### http://crypto.cat
#### Beta software - code review highly appreciated.

Cryptocat allows you to instantly set up secure conversations. It's an open source encrypted, private alternative to invasive services such as Facebook chat.

## Cool features
* A client-side, multithreaded, OpenSSL cross-compatible RSA public key cryptography engine allows for instant 1048-bit encrypted chat.
* A client-side AES-256 implementation is used to encrypt data with the RSA keys.
* Messages are signed and include integrity verification.
* The identity of chatters can be confirmed via key fingerprints, à la OTR.
* A seeded, cryptographically secure random number generator that relies on browser elements, DOM, JavaScript variable state, and more to produce entropy. The resulting entropy is hashed to produce the final seed, which is then fed back to the CSPRNG.
* [Cryptocat Verifier](https://chrome.google.com/webstore/detail/dlafegoljmjdfmhgoeojifolidmllaie), a Google Chrome browser extension, can be used to verify the integrity of your Cryptocat session.
* Chats are securely deleted after 30 minutes of inactivity.
* A sleek, beautiful design with time-stamping, optional audio notifications, fluid-window mode, and more.

## License
### Cryptocat is released under the [Creative Commons Attribution-NonCommercial-ShareAlike 3.0 Unported License](http://creativecommons.org/licenses/by-nc-sa/3.0/):
* Noncommercial — You may not use this work for commercial purposes.
* Attribution — You must attribute the work to the Cryptocat project (but not in any way that suggests that they endorse you or your use of the work).
* Share Alike — If you alter, transform, or build upon this work, you may distribute the resulting work only under the same or similar license to this one.

## Important notes
* Paranoid users may want to install [Cryptocat Verifier](https://chrome.google.com/webstore/detail/dlafegoljmjdfmhgoeojifolidmllaie), a Chrome extension that verifies that your Cryptocat session is not serving you modified JavaScript code.

* The code for secure deletion of idle chats after 30 minutes is not included in the Cryptocat git repository. On the production server at crypto.cat, it's actually a cron job that checks the modification time of chats and wipes them securely using [wipe](http://linux.die.net/man/1/wipe). People wanting to set up similar functionality on their server should consider writing a similar cron job.

## About
Cryptocat is developed by [Nadim Kobeissi](http://nadim.cc). It uses the [cryptico](http://code.google.com/p/cryptico/) library and the [Bitcons](http://somerandomdude.com/projects/bitcons/) iconset. Furthermore, Cryptocat is indebted to Paul Brodeur, David Mirza, Hasan Saleh, and Tina Salameh for their helpful suggestions and beta testing.