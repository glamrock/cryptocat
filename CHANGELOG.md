## Changelog

#### Cryptocat 2.0.37
**Feb. 11 2013**
- Added Bengali and Bulgarian translations.
- Minor German translation corrections.
- Small usability improvements.

#### Cryptocat 2.0.36
**Feb. 8 2013**
- New and improved language selection interface.

#### Cryptocat 2.0.35
**Feb. 6 2013**
- Update Tibetan translation and improve language display semantics.

#### Cryptocat 2.0.34
**Feb. 5 2013**
- Updated Korean, Latvian and Urdu translations.
- User interface minor bug fixes and improvements.

#### Cryptocat 2.0.33
**Feb. 2 2013**
- Redesigned message display: Now with speech bubbles, better colours and more!

#### Cryptocat 2.0.32
**Feb. 2 2013**
- "Retina-ready" graphics — high definition interface graphics for high resolution displays.
- Prevent desktop notifications from lasting more than 5 seconds.
- Improved Catalan translation.

#### Cryptocat 2.0.31
**Jan. 30 2013**
- More than a dozen bug fixes and tweaks related to the redesigned UI which was pushed last version.
- Logging in/logging out is now faster.
- Fixed a bug that could prohibit desktop notifications from appearing in Google Chrome.
- Fixed a bug that could prevent notification sounds from being played in Google Chrome.
- Warnings have been added to all translations except Tibetan, Korean, Latvian and Urdu (will be updated in an upcoming version.)
- New: Uyghur translation.
- Esperanto translation removed.
- Font family tweaks.

#### Cryptocat 2.0.30
**Jan. 23 2013**
- Comprehensive user interface overhaul with:
	- A full-screen, fluid interface.
	- New fonts.
	- An improved color scheme.
- Usage tips and warnings now included on sign-in screen.

#### Cryptocat 2.0.29
**Jan. 22 2013**
- Removed unnecessary permission demands from Chrome.
- Improved random number generation mechanics (thanks to Dmitry Chestnykh).
- Some aesthetic and other bug fixes.

#### Cryptocat 2.0.28
**Jan. 17 2013**
- Key generation speed improved by over 33%.
- Desktop notifications are now available in Safari.
- Korean translation fixes.
- Tibetan text is now more readable.
- Added a cat fact.
- Some aesthetic bug fixes.

#### Cryptocat 2.0.27
**Dec. 12 2012**
- Added Estonian, Esperanto, Japanese, Korean, Latvian and Khmer
translations.

#### Cryptocat 2.0.26
**Nov. 20 2012**
- Fixed bug where fingerprints would sometimes not appear.
- Version number is now displayed on login screen.
- Fix French translation typos.
- Update jQuery to 1.8.3.
- Replaced call to nsILocalFile with nsIFile (Firefox-specific).

#### Cryptocat 2.0.25
**Nov. 15 2012**
- Fixed inaccuracies in Turkish, Norwegian and Polish.
- Updated OTR.js library to version 0.0.11.

#### Cryptocat 2.0.24
**Nov. 14 2012**
- Added Urdu, Turkish and Norwegian translations.
- Added a tooltip-based tutorial.
- Multiparty protocol improvements:
	* Added replay attack prevention.
	* Added message tags to ensure all participants receive same plaintext per message.
	* Improved multiparty protocol specification details.
- Firefox performance improvements.
- Fixed bug that would cause "nickname in use" error to show improperly.
- Updated source code repository links.
- Updated OTR.js library to version 0.0.10.
- Fixed a buddy notification aesthetic bug.

#### Cryptocat 2.0.23
**Nov. 8 2012**
- Fixed a bug where URLs would not display properly in messages.

#### Cryptocat 2.0.22
**Nov. 7 2012**
- This version pushes many important security fixes, detailed here on the Cryptocat Development Blog: https://blog.crypto.cat/2012/11/security-update-our-first-full-audit/
- Added a user counter.

#### Cryptocat 2.0.21
**Nov. 4 2012**
- Join/part notifications.
- Improved nickname completion.
- Small UX tweaks.

#### Cryptocat 2.0.20
**Nov. 3 2012**
- Bug fixes.
- Updated Chinese translation.

#### Cryptocat 2.0.19
**Nov. 1 2012**
- Language detection bug fixes.
- Minor security fixes.
- Other minor bug fixes.

#### Cryptocat 2.0.18
**Oct. 29 2012**
- Fixed a bug where the fingerprint dialog would sometimes not show.

#### Cryptocat 2.0.17
**Oct. 23 2012**
- A bug fix was not pushed in the previous update by mistake.  

#### Cryptocat 2.0.16
**Oct. 23 2012**
- Fixed major multiparty messaging bug.  

#### Cryptocat 2.0.15
**Oct. 22 2012**
- Fix bug where login would never complete (in extremely rare cases.)
- Minor UI bug fix.

#### Cryptocat 2.0.14
**Oct. 22 2012**
- Refactoring of random number generation.
- Fix bug where buddy context menu would not open under certain circumstances.
- Numerous other bug fixes.

#### Cryptocat 2.0.13
**Oct. 20 2012**  
- Various bug fixes and improvements related to fingerprint generation and display.  

#### Cryptocat 2.0.12
**Oct. 19 2012**  
- Colorprints
(https://blog.crypto.cat/2012/10/colorprints-an-easier-way-to-authenticate/)  
- Fix a bug that would display certain characters incorrectly in desktop notifications.  
- Fix a bug that would not display a certain emoticon.  

#### Cryptocat 2.0.11
**Oct. 17 2012**  
- Nickname tab completion.  
- Messages containing your nickname are highlighted.  
- Prettier message display.  
- Small bug fixes related to group message delivery.  

#### Cryptocat 2.0.10
**Oct. 17 2012**  
- Numerous user interface improvements.  
- Tibetan translation.  
- Improved existing translations (notably Chinese.)  
- Better, more efficient translation handling.  
- Added 12 new cat facts.  
- Fixed a bug where desktop notifications would appear unnecessarily.  
- Fixed a bug where Chrome extension would not ask for the proper permissions needed to connect to custom servers.  

#### Cryptocat 2.0.9
**Oct. 1 2012**  
- Fix bug that would attempt to enter conversation even if conversation name was invalid.  
- Fix permissions for Chrome version so that Cryptocat for Chrome can connect to custom XMPP-BOSH servers.  

#### Cryptocat 2.0.8
**Sep. 30 2012**  
- Fixed bug which prevented Cryptocat from working specifically in Firefox on Fedora Linux.  

#### Cryptocat 2.0.7
**Sep. 29 2012**  
- Switch completely to browser native randomness seeding, remove Fortuna RNG.  

#### Cryptocat 2.0.6
**Sep. 29 2012**  
- Fixed a bug where some characters would be displayed incorrectly/in rare occasions cause the client to crash.  
- Fixed UI bugs where some buttons appeared too large.  

#### Cryptocat 2.0.5
**Sep. 29 2012**  
- Many substantial Firefox-specific code improvements.  
- Many small tweaks, bug fixes, cleanups and improvements.  
- Update jQuery and jQuery plugin libraries.  
- Update Strophe.js library.  

```Note: This version has many localStorage features (such as persistent
keys and settings) fully implemented, but all are disabled (in all
browsers) due to Firefox bug #795615. Will be enabled as soon as that's
fixed.```  

#### Cryptocat 2.0.4
**Sep. 27 2012**  
- Fixed bug where user would not be able to join any conversation again after logging out from first conversation (until restarting Cryptocat).  
- Added Chinese (Hong Kong), Chinese (Traditional), Vietnamese and Hebrew translations.  
- Minor aesthetic improvements.  
- Minor code cleanup.  

#### Cryptocat 2.0.3
**Sep. 24 2012**  
- Fixed bug where conversation names with capital letters would not function properly.  
- Fixed bug where away contacts were not arranged properly on buddy list.  

#### Cryptocat 2.0.2
**Sep. 24 2012**  
- Faster OTR key generation.  
- Native CSPRNG support now implemented in Firefox, making all Cryptocat extensions have native CSPRNG support.  
- Translation fixes.  
- Misc. tweaks.  

#### Cryptocat 2.0.1
**Sep. 23 2012**  
- Add Lolcat translation.  
- Czech translation fixes.  
- Lower minimum Firefox version to Firefox 9.  

#### Cryptocat 2.0.0
**Sep. 22 2012**  
- Initial release.
