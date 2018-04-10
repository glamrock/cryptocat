#Changelog

##Cryptocat 2.1.17
**Dec. 5 2013**

- **Security fix**: A bug which moderately weakened the keys used for group chat was fixed. The reduction in security is not thought to be enough to allow for the easy brute-forcing of keys. The buggy update (2.1.16) was available for less than six days before this bug was detected, and was never released for Firefox. We thank security researcher Steve Thomas for his incredibly valuable contributions to Cryptocat.  
- Fixed a sometimes-incorrect alignment of warning messages in the user interface.  
- The "message received" audio notification sound was redone. The sound was composed by Rich Vreeland.  
- Usability improvements were made to the Authentication Question (SMP) feature.  
- Improvements were made to the German translation.  

##Cryptocat 2.1.16
**Nov. 29 2013**

- Cryptocat is now available for Opera 15 and higher.  
- Big improvements to group chat messaging reliability.  
- Added a "Getting Started" guide that appears for first-time Cryptocat users.  
- New feature: Save custom server configurations to quickly access later.  
- Cryptocat for Firefox now also remembers settings and preferences.  
- Key generation speed improved by up to 40%!  
- Encrypted file sharing is temporarily disabled in order to investigate a potential issue.  
- Implemented some preparations for compatibility with upcoming Cryptocat for iPhone and Android.  
- Buddy context menus now have an improved look.  
- Audio notifications now work in Safari (only versions 7 and higher).  
- Highly substantial reduction in Cryptocat's file size due to code optimization and audio file encoding improvements.  
- Add new Kannada translation.  
- Fix inconsistencies in some translations.  
- Many other bug fixes, improvements, optimizations and tweaks.  

##Cryptocat 2.1.15
**Oct. 13 2013**  
- Improve connection stability.  
- Fixed a bug where messages with URLs would only appear as URL and without accompanying message text.  
- Small bug fixes and tweaks.  

##Cryptocat 2.1.14
**Sep. 16 2013**
- Major new feature: Cryptocat now automatically reconnects to conversations when disconnected, without troubling the user. Cryptocat will automatically detect accidental disconnections and wait for the Internet connection to be re-established before reconnecting.  
- Major new feature: Cryptocat for Mac now includes built-in Tor support. When enabled, Cryptocat for Mac will automatically route all connections through the Tor anonymity network. You do not need to have Tor installed.  
- Cryptocat for Chrome now uses the new "packaged app API."  
- Authentication via questions has been greatly improved.  
- Fixed a confusing user interface bug that would allow you to ask yourself an authentication question.  
- New audio notifications have been added for key generation and user connection.  
- The audio notifications for user join and leave have been replaced with new ones.  
- Browser window title now displays conversation names, for increased usability when running multiple Cryptocat tabs.  
- Many small user interface fixes and improvements.  

##Cryptocat 2.1.13
**Aug. 26 2013**  
**Pending public release in early September.**  
Group chat in this version of Cryptocat is not compatible with previous versions. In order to be able to use group chat, all participants must update to Cryptocat 2.1.13 or higher. Due to this, this release will be delayed until it can be rolled out simultaneously across all platforms. Updating is highly recommended.  

- Important change: the "Block" feature has been changed to an "Ignore" feature. You may ignore messages from users, but you can no longer prevent them from receiving your messages. Ignored users will have a strikethrough through their nickname, displayed in the buddy list.  
- New feature: SMP authentication. You can now authenticate a buddy's identity by asking them a secret question.  
- New feature: Message previews! Private messages for conversations not in focus are now previewed via small speech bubbles that appear next to the buddy list.  
- New feature: Cryptocat for Chrome, Firefox and Safari now displays new message notifications inside the favicon, in the browser tab.  
- Fixed an issue where users may be able to send group chat messages to certain participants, but not to others.  
- Fixed a bug where Cryptocat would not allow the file transfer of certain types of ZIP files.  
- Fixed an issue where Cryptocat would display private messages if they were received without encryption. Now, all unencrypted messages are dropped.  
- Cryptocat's user interface has been improved in numerous areas.  
- Add warnings for decryption failures and for situations where Cryptocat thinks a user in the conversation is sending cryptographically suspicious messages.  
- Fixed a bug that would prevent buddy submenus from working if more than one was open at the same time.  
- Some work was done to resolve some potential openings for cryptographic timing attacks.  
- Fixed a bug that would prevent disconnection and logout messages from displaying properly to the user disconnecting or logging out.  
- Fixed a bug in Cryptocat for Firefox that would cause Cryptocat to freeze for around one second when switching tabs.  
- User join and part notifications and messages now include timestamps.  
- Fixed a bug in Cryptocat for Mac that would add an unnecessary scroll bar to the application window.  
- Fixed a bug that would prevent more than two cat facts from being displayed in one session.  
- Cryptocat for Mac now bounces the dock when new messages are received.  
- Many translation mistakes and typos have been fixed.  
- Many other small improvements and bug fixes.  

##Cryptocat 2.1.12
**Jul. 12 2013**
- Fixed some non-critical security issues reported by Steve Thomas that slightly reduce the bits of entropy in OTR authentication. Updating is recommended.  
- Fixed a pseudo-random number generator bug that causes some bias and wastes entropy. Updating is recommended.  
- Fixed a user interface bug that would make nicknames hard to read under certain circumstances.  
- Fixed a user interface bug that would sometimes show jagged-looking login text.  

##Cryptocat 2.1.11
**Jul. 2 2013**
- Fixed a bug in Cryptocat for Mac that would cause problems when users tried to open links.

##Cryptocat 2.1.10
**Jun. 28 2013**
- Fixed a bug that prevented desktop notifications from working in Chrome and Safari.  
- Many usability bug fixes for Firefox.  
- Fixed a typo.  

##Cryptocat 2.1.9
**Jun. 27 2013**
- Web notifications are now available for Firefox 22 and higher!  
- Fixed a bug that would cause Cryptocat to not launch in browsers set to certain languages and locales.  

##Cryptocat 2.1.8
**Jun. 26 2013**  
- Fixed a bug that would sometimes stall group conversations after some activity, or if a user switched their status to "away".  

##Cryptocat 2.1.6
**Jun. 24 2013**  
- Big fixes to file transfer! If you've been experiencing problems, this update should help.  
- File transfer now works fully in Cryptocat for Safari and Mac, as well as Chrome and Firefox.  
- Cryptocat for Mac has been rewritten from scratch.  
- Cryptocat for Mac now supports creating multiple windows for multiple conversations.  
- Some internal optimizations and updates.  
- Bug fixes.  
- Updated Russian and Farsi translations.  

##Cryptocat 2.1.5
**Jun. 15 2013**  
- Fixed a series of user experience incompatibilities with previous versions.  

##Cryptocat 2.1.3/2.1.4
**Jun. 14 2013**  
- New feature: Block users! Prevents annoying users from sending you messages/from seeing your messages.  
- New feature: Typing notification. See when a user is composing a message (both users need to be using Cryptocat 2.1.3 or higher.)  
- Fixed a bug that would prevent conversations from scrolling down when tabs are switched.  
- Fixed a bug that prevented nickname tab completion from working.  
- Fixed a bug that would prevent some ZIP files from being transferred.  
- Fixed a bug that would prevent audio and desktop notification settings from being saved.  
- Fixed a bug that would prevent a user from logging back in after logging out.  
- Fixed a bug that would show a vertical scroll bar on logout for no reason.  
- Additional small bug fixes.  
- Uighur translation has returned.  

##Cryptocat 2.1.1/2.1.2
**Jun. 10 2013**  
- Fix a connectivity bug introduced in the previous update that could lead to connectivity problems as well as an erroneous mismatch in OTR fingeprint displays in rare circumstances.  
- Many small user interface and usability bug fixes.  

##Cryptocat 2.1
**Jun. 7 2013**  
This is a major update to Cryptocat with many improvements and bug fixes.  

- User Interface redesign: Cryptocat's user interface has been redesigned to be brighter, friendlier, and faster. Existing users will find the new design familiar enough use, while new users will benefit from a friendlier user experience.  
- Encrypted file sharing: Send files via Cryptocat. ZIP files as well as images can now be shared with people inside a chatroom.  
- Security enhancements and bug fixes. Updating is recommended.  
- Major code cleanup and optimizations, including many bug fixes.  
- Added 41 new interesting cat facts.  
- Updated jQuery to 2.0.2.  
- Updated OTR libraries to version 0.1.5.  

**Known issues**: Safari users are currently able to send but not receive files. The Uighur translation is also currently unavailable and will return in a future version.  

##Cryptocat 2.0.42
**Apr. 19 2013**
- IMPORTANT: Due to changes to multiparty key generation (in order to be compatible with the upcoming mobile apps), this version of Cryptocat cannot have multiparty conversations with previous versions. However private conversations still work. Due to this, this release will not be pushed until it is both reviewed by Mozilla (for the Firefox Addons Website) and Apple (for the Mac App Store).
- Fixed a bug found in the encryption libraries that could partially weaken the security of multiparty Cryptocat messages.

##Cryptocat 2.0.41
**Mar. 14 2013**
- Fixed a bug in Cryptocat for Mac that prevented text selection, copy and paste from working.
- Updated OTR libraries to version 0.1.3.
- Notification settings are now saved from session to session.
- Improved Italian translation.
- Improved Japanese translation.
- Some small tweaks and adjustments.

##Cryptocat 2.0.40
**Mar. 3 2013**
- More substantial color scheme and UI improvements.  

##Cryptocat 2.0.39
**Mar. 3 2013**
- User interface bug fixes.  

##Cryptocat 2.0.38
**Mar. 2 2013**
- Cryptocat will now save your language, server and nickname preferences automatically. This feature does not work yet on Firefox.
- Cryptocat will now automatically log out on connection failure.
- Improved message input interface.
- Many small user interface tweaks and improvements.
- Removed unused libraries, replaced some libraries.
- Updated jQuery to version 1.9.1.
- Minor bug fix in elliptic curve cryptography library.
- Russian translation improvements.
- Czech translation improvements.

##Cryptocat 2.0.37
**Feb. 11 2013**
- Added Bengali and Bulgarian translations.
- Minor German translation corrections.
- Small usability improvements.

##Cryptocat 2.0.36
**Feb. 8 2013**
- New and improved language selection interface.

##Cryptocat 2.0.35
**Feb. 6 2013**
- Update Tibetan translation and improve language display semantics.

##Cryptocat 2.0.34
**Feb. 5 2013**
- Updated Korean, Latvian and Urdu translations.
- User interface minor bug fixes and improvements.

##Cryptocat 2.0.33
**Feb. 2 2013**
- Redesigned message display: Now with speech bubbles, better colours and more!

##Cryptocat 2.0.32
**Feb. 2 2013**
- "Retina-ready" graphics — high definition interface graphics for high resolution displays.
- Prevent desktop notifications from lasting more than 5 seconds.
- Improved Catalan translation.

##Cryptocat 2.0.31
**Jan. 30 2013**
- More than a dozen bug fixes and tweaks related to the redesigned UI which was pushed last version.
- Logging in/logging out is now faster.
- Fixed a bug that could prohibit desktop notifications from appearing in Google Chrome.
- Fixed a bug that could prevent notification sounds from being played in Google Chrome.
- Warnings have been added to all translations except Tibetan, Korean, Latvian and Urdu (will be updated in an upcoming version.)
- New: Uyghur translation.
- Esperanto translation removed.
- Font family tweaks.

##Cryptocat 2.0.30
**Jan. 23 2013**
- Comprehensive user interface overhaul with:
	- A full-screen, fluid interface.
	- New fonts.
	- An improved color scheme.
- Usage tips and warnings now included on sign-in screen.

##Cryptocat 2.0.29
**Jan. 22 2013**
- Removed unnecessary permission demands from Chrome.
- Improved random number generation mechanics (thanks to Dmitry Chestnykh).
- Some aesthetic and other bug fixes.

##Cryptocat 2.0.28
**Jan. 17 2013**
- Key generation speed improved by over 33%.
- Desktop notifications are now available in Safari.
- Korean translation fixes.
- Tibetan text is now more readable.
- Added a cat fact.
- Some aesthetic bug fixes.

##Cryptocat 2.0.27
**Dec. 12 2012**
- Added Estonian, Esperanto, Japanese, Korean, Latvian and Khmer
translations.

##Cryptocat 2.0.26
**Nov. 20 2012**
- Fixed bug where fingerprints would sometimes not appear.
- Version number is now displayed on login screen.
- Fix French translation typos.
- Update jQuery to 1.8.3.
- Replaced call to nsILocalFile with nsIFile (Firefox-specific).

##Cryptocat 2.0.25
**Nov. 15 2012**
- Fixed inaccuracies in Turkish, Norwegian and Polish.
- Updated OTR.js library to version 0.0.11.

##Cryptocat 2.0.24
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

##Cryptocat 2.0.23
**Nov. 8 2012**
- Fixed a bug where URLs would not display properly in messages.

##Cryptocat 2.0.22
**Nov. 7 2012**
- This version pushes many important security fixes, detailed here on the Cryptocat Development Blog: https://blog.crypto.cat/2012/11/security-update-our-first-full-audit/
- Added a user counter.

##Cryptocat 2.0.21
**Nov. 4 2012**
- Join/part notifications.
- Improved nickname completion.
- Small UX tweaks.

##Cryptocat 2.0.20
**Nov. 3 2012**
- Bug fixes.
- Updated Chinese translation.

##Cryptocat 2.0.19
**Nov. 1 2012**
- Language detection bug fixes.
- Minor security fixes.
- Other minor bug fixes.

##Cryptocat 2.0.18
**Oct. 29 2012**
- Fixed a bug where the fingerprint dialog would sometimes not show.

##Cryptocat 2.0.17
**Oct. 23 2012**
- A bug fix was not pushed in the previous update by mistake.  

##Cryptocat 2.0.16
**Oct. 23 2012**
- Fixed major multiparty messaging bug.  

##Cryptocat 2.0.15
**Oct. 22 2012**
- Fix bug where login would never complete (in extremely rare cases.)
- Minor UI bug fix.

##Cryptocat 2.0.14
**Oct. 22 2012**
- Refactoring of random number generation.
- Fix bug where buddy context menu would not open under certain circumstances.
- Numerous other bug fixes.

##Cryptocat 2.0.13
**Oct. 20 2012**  
- Various bug fixes and improvements related to fingerprint generation and display.  

##Cryptocat 2.0.12
**Oct. 19 2012**  
- Colorprints
(https://blog.crypto.cat/2012/10/colorprints-an-easier-way-to-authenticate/)  
- Fix a bug that would display certain characters incorrectly in desktop notifications.  
- Fix a bug that would not display a certain emoticon.  

##Cryptocat 2.0.11
**Oct. 17 2012**  
- Nickname tab completion.  
- Messages containing your nickname are highlighted.  
- Prettier message display.  
- Small bug fixes related to group message delivery.  

##Cryptocat 2.0.10
**Oct. 17 2012**  
- Numerous user interface improvements.  
- Tibetan translation.  
- Improved existing translations (notably Chinese.)  
- Better, more efficient translation handling.  
- Added 12 new cat facts.  
- Fixed a bug where desktop notifications would appear unnecessarily.  
- Fixed a bug where Chrome extension would not ask for the proper permissions needed to connect to custom servers.  

##Cryptocat 2.0.9
**Oct. 1 2012**  
- Fix bug that would attempt to enter conversation even if conversation name was invalid.  
- Fix permissions for Chrome version so that Cryptocat for Chrome can connect to custom XMPP-BOSH servers.  

##Cryptocat 2.0.8
**Sep. 30 2012**  
- Fixed bug which prevented Cryptocat from working specifically in Firefox on Fedora Linux.  

##Cryptocat 2.0.7
**Sep. 29 2012**  
- Switch completely to browser native randomness seeding, remove Fortuna RNG.  

##Cryptocat 2.0.6
**Sep. 29 2012**  
- Fixed a bug where some characters would be displayed incorrectly/in rare occasions cause the client to crash.  
- Fixed UI bugs where some buttons appeared too large.  

##Cryptocat 2.0.5
**Sep. 29 2012**  
- Many substantial Firefox-specific code improvements.  
- Many small tweaks, bug fixes, cleanups and improvements.  
- Update jQuery and jQuery plugin libraries.  
- Update Strophe.js library.  

```Note: This version has many localStorage features (such as persistent
keys and settings) fully implemented, but all are disabled (in all
browsers) due to Firefox bug #795615. Will be enabled as soon as that's
fixed.```  

##Cryptocat 2.0.4
**Sep. 27 2012**  
- Fixed bug where user would not be able to join any conversation again after logging out from first conversation (until restarting Cryptocat).  
- Added Chinese (Hong Kong), Chinese (Traditional), Vietnamese and Hebrew translations.  
- Minor aesthetic improvements.  
- Minor code cleanup.  

##Cryptocat 2.0.3
**Sep. 24 2012**  
- Fixed bug where conversation names with capital letters would not function properly.  
- Fixed bug where away contacts were not arranged properly on buddy list.  

##Cryptocat 2.0.2
**Sep. 24 2012**  
- Faster OTR key generation.  
- Native CSPRNG support now implemented in Firefox, making all Cryptocat extensions have native CSPRNG support.  
- Translation fixes.  
- Misc. tweaks.  

##Cryptocat 2.0.1
**Sep. 23 2012**  
- Add Lolcat translation.  
- Czech translation fixes.  
- Lower minimum Firefox version to Firefox 9.  

##Cryptocat 2.0.0
**Sep. 22 2012**  
- Initial release.
