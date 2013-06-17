[![Build Status](https://secure.travis-ci.org/cryptocat/cryptocat.png?branch=master)](http://travis-ci.org/cryptocat/cryptocat)

#[Cryptocat](https://crypto.cat)
####Web Instant Messaging App With Accessible Encryption.
#####Experimental software: Don't trust with your life! Peer review appreciated.

##Description
Cryptocat is a browser-based XMPP client that provides multi-user (and private) instant messaging inside chatrooms. It uses the [OTR](http://www.cypherpunks.ca/otr/) protocol for encrypted two-party chat and the (upcoming) mpOTR protocol for encrypted multi-party chat.  

##Platforms
####Google Chrome
Run `make chrome` to build a Google Chrome-loadable .zip extension (or just .zip the directory.)  
Also available from the [Chrome Web Store](https://chrome.google.com/webstore/detail/cryptocat/gonbigodpnfghidmnphnadhepmbabhij).  
####Mozilla Firefox
Run `make firefox` to build a Mozilla Firefox-loadable .xpi extension (or just .zip the directory and change the extension to .xpi.)  
Also available from [Mozilla Firefox Addons](https://addons.mozilla.org/en-US/firefox/addon/cryptocat/).  
#####Apple Safari
Apple's model makes an automated build process difficult.  
Also available from [Cryptocat](https://crypto.cat/get/cryptocat.safariextz).

##Goals
* XMPP **[DONE]** | [Discussion](https://github.com/cryptocat/cryptocat/issues/83), [Library](http://strophe.im)
* OTR **[DONE]** | [Discussion](https://github.com/cryptocat/cryptocat/issues/84), [Library](https://github.com/arlolra/otr)
* mpOTR | [Discussion](https://github.com/cryptocat/cryptocat/issues/82), Spec in progress. Currently relying on the [Cryptocat Multiparty Protocol](https://github.com/cryptocat/cryptocat/wiki/Multiparty-Protocol-Specification)  

##Contributing
Please see `CONTRIBUTING.md` for guidelines on how to contribute.

##Documentation & Wiki
* [Multiparty Protocol Specification](https://github.com/cryptocat/cryptocat/wiki/Multiparty-Protocol-Specification)  
* [OTR Encrypted File Transfer Specification](https://github.com/cryptocat/cryptocat/wiki/OTR-Encrypted-File-Transfer-Specification)  
* [Server Deployment Instructions](https://github.com/cryptocat/cryptocat/wiki/Server-Deployment-Instructions)  
* [Threat Model](https://github.com/cryptocat/cryptocat/wiki/Threat-Model)  
* [Design and Functionality Overview](https://github.com/cryptocat/cryptocat/wiki/Design-and-Functionality)  
* [Architecture and Lifecycle](https://project.crypto.cat/documents/a&l.pdf)  

##Discussion & Blog
* [Issue tracker](https://github.com/cryptocat/cryptocat/issues)
* [Development Blog](https://blog.crypto.cat)  

##Builds
* Builds are available in `release/`.  

##Changelog
Please review `CHANGELOG.md` for an account of the changes made with each version update.  

##License
##### Cryptocat is released under the [GNU Affero General Public License (AGPL3)](https://www.gnu.org/licenses/agpl-3.0.html).
The full license text is included in `LICENSE.txt`.  
