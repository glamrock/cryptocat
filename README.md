## Cryptocat
### Web chat client with client-side cryptography.
### https://crypto.cat
### http://xdtfje3c46d2dnjd.onion
#### Alpha software - code review highly appreciated - DO NOT TRUST WITH YOUR LIFE - NOT PEER REVIEWED OR READY FOR PRODUCTION

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
### Cryptocat is released under the [Creative Commons Attribution-NonCommercial-ShareAlike 3.0 Unported License](http://creativecommons.org/licenses/by-nc-sa/3.0/):
* Noncommercial — You may not use this work for commercial purposes.
* Attribution — You must attribute the work to the Cryptocat project (but not in any way that suggests that they endorse you or your use of the work).
* Share Alike — If you alter, transform, or build upon this work, you may distribute the resulting work only under the same or similar license to this one.

Additionally:
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

## Installation instructions
### Cryptocat
1. If your server does not support symlinks, replace the symlinks with copies of the actual files accordingly.
2. Run `./make.sh` inside the `src/server/js/src/` directory in order to generate the client-side cryptography code (requires `gcc`.)
3. Configure settings inside `src/server/index.php`.

### Cryptocat Chrome
1. Run `make build-chrome-zip` in order to generate a Google Chrome-loadable.zip

### CryptocatBot
*Instructions coming soon.*

1. Run `make build-android-apk` in order to build an android package.

## Important notes
* Cryptocat provides strongly encrypted, secure communications. However, it is not a replacement to OTR, GPG or other strong cryptography. Think responsibly; if you are in extreme, life-threatening situations: don't use it!

* Using Cryptocat without HTTPS in a production environment is a recipe for disaster. We severely warn against deploying Cryptocat without HTTPS, unless the deployment is occurring as a Tor Hidden Service.

* We suggest you use a native client for your platform and consider the web interface to be for convenience and for demonstrations.

* In the future the underlying crypto will be entirely replaced with mpOTR and OTR.

* The code for secure deletion of idle chats after one hour is not included in the Cryptocat git repository. On the [production server](https://crypto.cat), it's actually a cron job that checks the modification time of chats and [wipe](http://linux.die.net/man/1/wipe)s them securely. Those wanting to set up similar functionality should consider writing something similar.

## About
Cryptocat™ is a trademark of and is developed by [Nadim Kobeissi](http://nadim.cc). It uses parts of the [crypto-js](http://code.google.com/p/crypto-js/) library and the [Bitcons](http://somerandomdude.com/work/bitcons/) iconset. Cryptocat is indebted to Paul Brodeur, David Mirza, Hasan Saleh and Tina Salameh.
