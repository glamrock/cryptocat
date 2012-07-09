Cryptocat 2

Barebones codebase!

**A lot of the new stuff is going in `testing/` so look there first!**

* There will be no server code since we will be using XMPP for server.
* We will use Strophe.js (http://strophe.im/) for XMPP, available in ext/strophejs
* mpOTR code is in src/common/js
* We will only focus on the Chrome extension until that's done, and then port to other browsers/platforms
* Most of the code here (excluding libraries) will be written from scratch, not from Cryptocat v1

Goals:
* XMPP | Discussion: https://github.com/kaepora/cryptocat/issues/83
* mpOTR | Discussion: https://github.com/kaepora/cryptocat/issues/82
* OTR (for backwards compatibility) | Discussion: https://github.com/kaepora/cryptocat/issues/84

Feel free to open issues. Contact <nadim@nadim.cc>
