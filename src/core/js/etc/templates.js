// Cryptocat templates for use with mustache.js.

Cryptocat.templates = {
	buddy: '<div class="buddy" title="{{nickname}}" id="buddy-{{nickname}}" status="online">'
		+ '<span>{{shortNickname}}</span>'
		+ '<div class="buddyMenu" id="menu-{{nickname}}"></div></div>',

	buddyMenu: '<li class="option1">{{displayInfo}}</li>'
		+ '<li class="option2">{{sendEncryptedFile}}</li>'
		+ '<li class="option3">{{block}}</li>',

	infoDialog: '<div class="title">{{nickname}}</div>'
		+ '<div id="displayInfo">{{otrFingerprint}}<br /><span id="otrFingerprint"></span>'
		+ '<br />{{groupFingerprint}}<br /><span id="multiPartyFingerprint"></span>'
		+ '</div>'
		+ '<div id="authInfo"><h2>Authenticate</h2>'
		+ '<p>Verify this user\'s identity by asking a secret question. Answers must match exactly!</p>'
		+ '<form><input type="text" id="authQuestion" placeholder="Secret question" />'
		+ '<input type="text" id="authAnswer" placeholder="Secret answer" />'
		+ '<input id="authSubmit" type="submit" value="Ask" /></form>'
		+ '<p id="authVerified">Identity verified.</p>',

	sendFile: '<div class="title">{{sendEncryptedFile}}</div>'
		+ '<input type="file" id="fileSelector" name="file[]" />'
		+ '<input type="button" id="fileSelectButton" value="{{sendEncryptedFile}}" />'
		+ '<div id="fileInfoField">{{fileTransferInfo}}</div>',

	file: '<div class="fileProgressBar" file="{{message}}"><div class="fileProgressBarFill"></div></div>',

	fileLink: '<a href="{{url}}" class="fileView" target="_blank" download="{{filename}}">{{downloadFile}}</a>',

	fileLinkMac: '<a href="{{url}}" class="fileView" download="{{filename}}">{{downloadFile}}</a>',

	message: '<div class="line{{lineDecoration}}"><span class="sender" sender="{{sender}}"'
		+ ' timestamp="{{currentTime}}">{{sender}}</span>{{&message}}</div>',

	composing: '<img src="img/typing.gif" class="typing" id="{{id}}" alt="" />'
}