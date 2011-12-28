## Cryptocat - browser-based webapp for encrypted chat
### http://crypto.cat
#### Beta software - code review highly appreciated.

Cryptocat lets you instantly set up secure conversations. It's an open source encrypted, private alternative to other services such as Facebook chat.

## Cool features
* A client-side 4096-bit Diffie-Hellman-Merkle public key agreement engine.
* A client-side AES-256 implementation is used to encrypt data.
* HMAC message integrity verification.
* The identity of chatters can be confirmed via key fingerprints, à la OTR.
* A seeded, cryptographically secure random number generator that relies on browser elements, DOM, JavaScript variable state, and more to produce entropy. The resulting entropy is hashed to produce the final seed, which is then fed back to the CSPRNG.
* Compatible with all modern browsers, and includes a mobile website that is fully compatible with iPhone, Android and BlackBerry.
* [Cryptocat Chrome](https://chrome.google.com/webstore/detail/gonbigodpnfghidmnphnadhepmbabhij), a Chrome app that loads all code locally, and is secure from being served compromised code.
* Chats are securely deleted after one hour of inactivity.
* Private messaging between only two people in a room.
* A sleek design with time-stamping, optional audio notifications, fluid-window mode, and mobile support.
* Translations available for French, Catalan, Basque, Italian, German, Portuguese, Russian and Swedish.

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
1. Run ./make.sh inside the js/src/ directory in order to generate the client-side cryptography code (requires GCC.)
2. Configure settings inside index.php.

## Important notes
* Cryptocat provides strongly encrypted, secure communications. However, it is not a replacement to GPG. Think responsibly if you are in extreme, life-threatening situations.

* Paranoid users may want to use [Cryptocat Chrome](https://chrome.google.com/webstore/detail/gonbigodpnfghidmnphnadhepmbabhij), a Chrome app that loads all code locally, and is secure from being served compromised code.

* The code for secure deletion of idle chats after one hour is not included in the Cryptocat git repository. On the [production server](https://crypto.cat), it's actually a cron job that checks the modification time of chats and [wipe](http://linux.die.net/man/1/wipe)s them securely. Those wanting to set up similar functionality should consider writing something similar.

## About
Cryptocat is developed by [Nadim Kobeissi](http://nadim.cc). It uses parts of the [crypto-js](http://code.google.com/p/crypto-js/) library and the Bitcons iconset. Cryptocat is indebted to Paul Brodeur, David Mirza, Hasan Saleh, Morgan Sutherland, Tina Salameh, and Mikel Iturbe Urretxa.