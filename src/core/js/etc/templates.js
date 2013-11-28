// Cryptocat templates for use with mustache.js.

Cryptocat.templates = {

	customServer: '<option data-domain="{{domain}}" data-xmpp="{{XMPP}}" data-bosh="{{BOSH}}">'
		+ '{{name}}</option>',

	catFact: '<br />Here is an interesting fact while you wait:'
		+ '<br /><div id="interestingFact">{{catFact}}</div>',

	buddy: '<div class="buddy" title="{{nickname}}" id="buddy-{{nickname}}" status="online">'
		+ '<span>{{shortNickname}}</span>'
		+ '<div class="buddyMenu" id="menu-{{nickname}}"></div></div>',

	buddyMenu: '<li class="option1">{{displayInfo}}</li>'
		+ '<li class="option3">{{ignore}}</li>',

	myInfo: '<div class="title">{{nickname}}</div>'
		+ '<div id="displayInfo">'
		+ '{{groupFingerprint}}<br /><span id="multiPartyFingerprint"></span><br />'
		+ '{{otrFingerprint}}<br /><span id="otrFingerprint"></span></div>',

	buddyInfo: '<div class="title">{{nickname}}</div>'
		+ '<div id="displayInfo">'
		+ '{{groupFingerprint}}<br /><span id="multiPartyFingerprint"></span>'
		+ '</div><div id="authInfo"><h2>{{authenticate}}</h2>'
		+ '<p>{{otrFingerprint}}<br /><span id="otrFingerprint"></span></p>'
		+ '<p>{{verifyUserIdentity}}</p>'
		+ '<form><input type="text" id="authQuestion" placeholder="{{secretQuestion}}" maxlength="64" />'
		+ '<input type="password" id="authAnswer" placeholder="{{secretAnswer}}" maxlength="64" />'
		+ '<input id="authSubmit" type="submit" value="{{ask}}" /></form>'
		+ '<p id="authVerified">{{identityVerified}}</p>',

	authRequest: '<div class="title">{{authenticate}}</div>'
		+ '<p>{{authRequest}}<br />'
		+ '<strong>{{question}}</strong><br /><br />'
		+ '<form id="authReplyForm"><input id="authReply" type="password" placeholder="{{secretAnswer}}" maxlength="64" />'
		+ '<input id="authReplySubmit" type="submit" value="{{answer}}" /></form></p>'
		+ '<p>{{answerMustMatch}}</p>',

	sendFile: '<div class="title">{{sendEncryptedFile}}</div>'
		+ '<input type="file" id="fileSelector" name="file[]" />'
		+ '<input type="button" id="fileSelectButton" value="{{sendEncryptedFile}}" />'
		+ '<div id="fileInfoField">{{fileTransferInfo}}</div>',

	file: '<div class="fileProgressBar" file="{{message}}"><div class="fileProgressBarFill"></div></div>',

	fileLink: '<a href="{{url}}" class="fileView" target="_blank" download="{{filename}}">{{downloadFile}}</a>',

	fileLinkMac: '<a href="{{url}}" class="fileView" download="{{filename}}">{{downloadFile}}</a>',

	missingRecipients: '<div class="missingRecipients">{{text}}</div>',

	message: '<div class="line{{lineDecoration}}"><span class="sender" sender="{{nickname}}"'
		+ ' timestamp="{{currentTime}}">{{nickname}}</span>{{&message}}</div>',

	composing: '<img src="img/typing.gif" class="typing" id="{{id}}" alt="" />',

	userJoin: '<div class="userJoin"><span class="timestamp">{{currentTime}}</span>'
		+ '<strong>+</strong>{{nickname}}</div>',

	userLeave: '<div class="userLeave"><span class="timestamp">{{currentTime}}</span>'
		+ '<strong>-</strong>{{nickname}}</div>'

}