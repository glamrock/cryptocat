[![Build Status](https://secure.travis-ci.org/cryptocat/cryptocat.png?branch=master)](http://travis-ci.org/cryptocat/cryptocat)

##[Cryptocat](https://crypto.cat)
#### Web Instant Messaging App With Accessible Encryption.
##### Experimental software: Don't trust with your life! Peer review appreciated.

### Description
Cryptocat is a browser-based XMPP client that provides multi-user (and private) instant messaging inside chatrooms. It uses the [OTR](http://www.cypherpunks.ca/otr/) protocol for encrypted two-party chat and the (upcoming) mpOTR protocol for encrypted multi-party chat.  

### Platforms
##### Google Chrome: `src/chrome/`
Run `make chrome` to build a Google Chrome-loadable .zip extension (or just .zip the directory.)  
Also available from the [Chrome Web Store](https://chrome.google.com/webstore/detail/cryptocat/gonbigodpnfghidmnphnadhepmbabhij).  
##### Mozilla Firefox: `src/firefox/`
Run `make firefox` to build a Mozilla Firefox-loadable .xpi extension (or just .zip the directory and change the extension to .xpi.)  
Also available from [Mozilla Firefox Addons](https://addons.mozilla.org/en-US/firefox/addon/cryptocat/).  
##### Apple Safari: `src/cryptocat.safariplugin/`
Apple's model makes an automated build process difficult.  
Also available from [Cryptocat](https://crypto.cat/get/cryptocat.safariextz).

## Compatibility Status
```
  -----------------------------------------
 |             Windows   Mac      Linux    |
 |-----------------------------------------|
 | Chrome  |   Yes       Yes      Yes      |
 |---------                                |
 | Firefox |   Yes       Yes      Yes      |
 |---------                                |
 | Safari  |   Yes       Yes               |
 |---------                                |
  -----------------------------------------
```  

### Goals
* XMPP **[DONE]** | [Discussion](https://github.com/cryptocat/cryptocat/issues/83), [Library](http://strophe.im)
* OTR **[DONE]** | [Discussion](https://github.com/cryptocat/cryptocat/issues/84), [Library](https://github.com/arlolra/otr)
* mpOTR | [Discussion](https://github.com/cryptocat/cryptocat/issues/82), Spec in progress. Currently relying on the [Cryptocat Multiparty Protocol](https://github.com/cryptocat/cryptocat/wiki/Multiparty-Protocol-Specification)  

### Documentation & Wiki
* [Multiparty Protocol Specification](https://github.com/cryptocat/cryptocat/wiki/Multiparty-Protocol-Specification)  
* [Server Deployment Instructions](https://github.com/cryptocat/cryptocat/wiki/Server-Deployment-Instructions)  
* [Threat Model](https://github.com/cryptocat/cryptocat/wiki/Threat-Model)  
* [Design and Functionality Overview](https://github.com/cryptocat/cryptocat/wiki/Design-and-Functionality)  
* [Architecture and Lifecycle](https://project.crypto.cat/documents/a&l.pdf)  

### Discussion & Blog
* [Issue tracker](https://github.com/cryptocat/cryptocat/issues)
* [Development Blog](https://blog.crypto.cat)  

### Tests
* Run tests using `make tests`.

### Builds
* Builds are available in `release/`.  

### Changelog
Please review `CHANGELOG.md` for an account of the changes made with each version update.  

### License
##### Cryptocat is released under the [GNU Affero General Public License (AGPL3)](https://www.gnu.org/licenses/agpl-3.0.html):  
```
Copyright (C) 2011 - 2013 Nadim Kobeissi <nadim@crypto.cat>  

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
```  

The full license text is included in `LICENSE.txt`.  


### Contributors
* **Lead Developer**: Nadim Kobeissi  
* **Development Contributors**: Jacob Appelbaum, Joseph Bonneau, Griffin Boyce, Arlo Breault, Dmitry Chestnykh, David Dahl, Daniel "koolfy" Faucon, Arturo Filasto, Tom Lowenthal, Fabio Pietrosanti  
* **Multimedia Contributors**: A.J. Korkidakis, P.J. Onori, Rich Vreeland  
  
With a warm thanks to the hard-working contributors who wish to remain anonymous.
