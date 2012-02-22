## Cryptocat
### Web chat client with client-side cryptography.
### http://crypto.cat
#### Beta software - code review highly appreciated.

Cryptocat lets you instantly set up secure conversations. It's an open source encrypted, private alternative to other services such as Facebook chat.

## Cool features
* A client-side 4096-bit Diffie-Hellman-Merkle public key agreement engine.
* A client-side AES-256 implementation is used to encrypt data.
* HMAC message integrity verification.
* The identity of chatters can be confirmed via key fingerprints, à la OTR.
* Uses the Fortuna secure pseudo-randomness generator.
* Send encrypted .zip files and images.
* Includes a mobile website compatible with iPhone, Android and BlackBerry.
* [Cryptocat Chrome](https://chrome.google.com/webstore/detail/gonbigodpnfghidmnphnadhepmbabhij), a Chrome app that loads all code locally, and is secure from being served compromised code.
* Chats are securely deleted after one hour of inactivity.
* Easily invite your Facebook contacts to join your Cryptocat session.
* Send private messages that can only be seen by a single recipient.
* A sleek design with time-stamping, optional audio notifications, fluid-window mode, and mobile support.
* Translations available for French, Catalan, Basque, Italian, German, Portuguese, Russian and Swedish.

## Protocol Specification
A [design specification for the Cryptocat protocol](https://crypto.cat/about/spec-rev1.pdf) is available.

## License
### Cryptocat is released under the [Creative Commons Attribution-NonCommercial-ShareAlike 3.0 Unported License](http://creativecommons.org/licenses/by-nc-sa/3.0/):
* Noncommercial — You may not use this work for commercial purposes.
* Attribution — You must attribute the work to the Cryptocat project (but not in any way that suggests that they endorse you or your use of the work).
* Share Alike — If you alter, transform, or build upon this work, you may distribute the resulting work only under the same or similar license to this one.

Additionally:
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

## Installation instructions
1. Run `./make.sh` inside the `js/src/` directory in order to generate the client-side cryptography code (requires `gcc`.)
2. Configure settings inside `index.php`.

## Important notes
* Cryptocat provides strongly encrypted, secure communications. However, it is not a replacement to GPG. Think responsibly if you are in extreme, life-threatening situations.

* Paranoid users may want to use [Cryptocat Chrome](https://chrome.google.com/webstore/detail/gonbigodpnfghidmnphnadhepmbabhij), a Chrome app that loads all code locally, and is secure from being served compromised code.

* The code for secure deletion of idle chats after one hour is not included in the Cryptocat git repository. On the [production server](https://crypto.cat), it's actually a cron job that checks the modification time of chats and [wipe](http://linux.die.net/man/1/wipe)s them securely. Those wanting to set up similar functionality should consider writing something similar.

* If Cryptocat does not work on your server, please make sure PHP is compiled with [shmop](http://php.net/manual/en/book.shmop.php) support (--enable-shmop).

## About
Cryptocat™ is a trademark of and is developed by [Nadim Kobeissi](http://nadim.cc). It uses parts of the [crypto-js](http://code.google.com/p/crypto-js/) library and the [Bitcons](http://somerandomdude.com/work/bitcons/) iconset. Cryptocat is indebted to Paul Brodeur, David Mirza, Hasan Saleh, Morgan Sutherland, and Tina Salameh.