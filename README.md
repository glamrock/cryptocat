## Cryptocat
### Web chat client with client-side cryptography.
### https://crypto.cat - http://xdtfje3c46d2dnjd.onion
#### Alpha software: Code review highly appreciated - DO NOT TRUST WITH YOUR LIFE - NOT PEER REVIEWED OR READY FOR PRODUCTION

Cryptocat lets you instantly set up secure conversations. It aims to be an open source encrypted and private alternative to other services such as Facebook chat.

## Cryptocat Versions - convenience and security
* **Cryptocat** is code to place on a web server and provides a HTTPS-accessible web interface that works on modern mobile and desktop browsers. This is for convenience and not for high security use. This is a useful demo and we hope it encourages you to install a native application for your respective platform.
* **Cryptocat Chrome** is a Google Chrome app that loads code locally and connects to a Cryptocat server only to communicate chat data and the server is only used for discovering other peers and to relay encrypted messages between peers. No code is trusted from the server.
* **CryptocatBot** is a native Android app developed in collaboration with the [Guardian Project](https://guardianproject.info/). It includes the full Cryptocat program and connects to a Tor hidden service through the Tor anonymity network by default thanks to Orbot integration from the [Guardian Project](https://guardianproject.info/).

A native iPhone, Blackberry and other versions are possible thanks to the [Guardian Project](https://guardianproject.info/) and [PhoneGap](https://phonegap.com/) but these are not yet implemented. If you're using these platforms, we encourage you to try the web application in the meantime.

## Cool features
* A client-side 4096-bit Diffie-Hellman-Merkle public key agreement engine.
* A client-side AES-256 implementation is used to encrypt data.
* HMAC message integrity verification.
* The identity of chatters can be confirmed via key fingerprints, à la OTR.
* Uses the Fortuna secure pseudo-randomness generator.
* Send encrypted .zip files and images.
* Includes a mobile website compatible with iPhone, Android and BlackBerry.
* Chats are securely deleted after one hour of inactivity.
* Easily invite your Facebook contacts to join your Cryptocat session.
* Send private messages that can only be seen by a single recipient.
* A sleek design with time-stamping, optional audio notifications, fluid-window mode, and mobile support.
* Translations available for French, Catalan, Basque, Italian, German, Portuguese, Russian and Swedish.

## Protocol Specification
A [design specification for the Cryptocat protocol](https://crypto.cat/about/) is available. In the future, the crypto will be entirely replaced with mpOTR for multi-party chat and OTR for private chatting between peers.

## License
### Cryptocat is released under the [GNU Affero General Public License (AGPL3)](https://www.gnu.org/licenses/agpl-3.0.html):
Copyright (C) 2011, 2012  Nadim Kobeissi <nadim@nadim.cc>

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as
published by the Free Software Foundation, either version 3 of the
License, or (at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License
along with this program. If not, see <http://www.gnu.org/licenses/>.

The full license text is included in `LICENSE.txt`.

## Installation instructions
### Cryptocat
1. run `make build-server`.
2. run `make DESTDIR=/var/www/ install-server`, replacing `/var/www/` with your intended web directory.
3. Configure settings inside `index.php`.

### Cryptocat Chrome
1. Run `make build-chrome-zip` in order to generate a Google Chrome-loadable.zip

### Cryptocat for Android
1. Run `make build-android-apk` in order to build an Android package.

## Important notes
* Cryptocat provides strongly encrypted, secure communications. However, it is not a replacement to OTR, GPG or other strong cryptography. Think responsibly; if you are in extreme, life-threatening situations: don't use it!

* Using Cryptocat without HTTPS in a production environment is a recipe for disaster. We severely warn against deploying Cryptocat without HTTPS, unless the deployment is occurring as a Tor Hidden Service.

* We suggest you use a native client for your platform and consider the web interface to be for convenience and for demonstrations.

* In the future the underlying crypto will be entirely replaced with mpOTR and OTR.

* The code for secure deletion of idle chats after one hour is not included in the Cryptocat git repository. On the [production server](https://crypto.cat), it's actually a cron job that checks the modification time of chats and [wipe](http://linux.die.net/man/1/wipe)s them securely. Those wanting to set up similar functionality should consider writing something similar.

## About
Cryptocat™ is a trademark of and is developed by [Nadim Kobeissi](http://nadim.cc). It uses parts of the [crypto-js](http://code.google.com/p/crypto-js/) library and the [Bitcons](http://somerandomdude.com/work/bitcons/) iconset. Cryptocat is indebted to Paul Brodeur, David Mirza, Hasan Saleh and Tina Salameh.
