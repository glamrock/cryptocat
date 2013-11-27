$(window).ready(function() {

function detectBrowser() {
	if (navigator.userAgent.match('OPR')) {
		return 'Opera'
	}
	if (navigator.userAgent.match('Chrome')) {
		return 'Chrome'
	}
	if (navigator.userAgent.match('Firefox')) {
		return 'Firefox'
	}
	if (navigator.userAgent.match('MSIE')) {
		return 'Internet Explorer'
	}
	return 'Safari'
}

function showInstructions(browser) {
	$('.browser').text(browser)
	$('.instructions[data-browser=' + browser + ']').show()
}

showInstructions(detectBrowser())

})