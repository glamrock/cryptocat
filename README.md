#[Cryptocat](https://crypto.cat)
###Browser-based app for easy to use, accessible encrypted chat.
Cryptocat is an experimental browser-based chat client for easy to use, encrypted conversations. It aims to make encrypted, private chat easy to use and accessible. We want to break down the barrier that prevents the general public from having an accessible privacy alternative that they already know how to use. Cryptocat is currently available for Chrome, Firefox and Safari. It uses the [OTR](http://www.cypherpunks.ca/otr/) protocol over XMPP for encrypted two-party chat and the (upcoming) mpOTR protocol for encrypted multi-party chat.

## Experimental Status
[![Build Status](https://secure.travis-ci.org/cryptocat/cryptocat.png?branch=master)](http://travis-ci.org/cryptocat/cryptocat)  
**Git repository branches are in-development, nightly builds!** They may not work at all. For stable usable builds, check the [releases](https://github.com/cryptocat/cryptocat/releases) section.  

Cryptocat is still under development. Only use it for experimentation! We've had quite a few serious bugs in the past couple of years. [Reports are available on our blog](https://blog.crypto.cat/category/security/). 

##Platforms

###Google Chrome
Run `make chrome` to build a Google Chrome-loadable .zip extension (or just .zip the directory.)  
Also available from the [Chrome Web Store](https://chrome.google.com/webstore/detail/cryptocat/gonbigodpnfghidmnphnadhepmbabhij).  

###Mozilla Firefox
Run `make firefox` to build a Mozilla Firefox-loadable .xpi extension (or just .zip the directory and change the extension to .xpi.)  
Also available from [Mozilla Firefox Addons](https://addons.mozilla.org/en-US/firefox/addon/cryptocat/).  

###Opera
Run `make opera` to build an Opera-compatible .nex extension (or just .zip the directory and change the extension to .nex)

###Apple Safari
Apple's model makes an automated build process difficult.  
Also available from [Cryptocat](https://crypto.cat/get/cryptocat.safariextz).

### Apple Mac OS X
Run `make mac` to build as a standalone Mac application. (After running `make mac`, you can also `open src/mac/Cryptocat.xcodeproj` to edit & build the project in Xcode normally.)  
Also available from the [Mac App Store](https://itunes.apple.com/app/cryptocat/id613116229?mt=12).

##Goals
* XMPP **[DONE]** | [Discussion](https://github.com/cryptocat/cryptocat/issues/83), [Library](http://strophe.im)
* OTR **[DONE]** | [Discussion](https://github.com/cryptocat/cryptocat/issues/84), [Library](https://github.com/arlolra/otr)
* mpOTR | [Discussion](https://github.com/cryptocat/cryptocat/issues/82), Spec in progress. Currently relying on the [Cryptocat Multiparty Protocol](https://github.com/cryptocat/cryptocat/wiki/Multiparty-Protocol-Specification)  

##Contributing
Please see `CONTRIBUTING.md` for guidelines on how to contribute.  
Please see `SECURITY.md` for guidelines on reporting security issues.

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
Builds for all platforms are available for download from [GitHub Releases](https://github.com/cryptocat/cryptocat/releases), in addition to the sources above. Please be mindful that GitHub builds do not auto-update.

##Changelog
Please review `CHANGELOG.md` for an account of the changes made with each version update.  

##License
##### Cryptocat is released under the [GNU Affero General Public License (AGPL3)](https://www.gnu.org/licenses/agpl-3.0.html).
The full license text is included in `LICENSE.txt`.  
