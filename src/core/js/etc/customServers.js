$(window).ready(function() {

function updateCustomServers() {
	var customServers = {}
	$('#customServerSelector option').each(function() {
		var name = $(this).val()
		customServers[name] = {}
		customServers[name].domain = $(this).attr('data-domain')
		customServers[name].xmpp = $(this).attr('data-xmpp')
		customServers[name].bosh = $(this).attr('data-bosh')
	})
	Cryptocat.storage.setItem('customServers', JSON.stringify(customServers))
}

// Custom server dialog.
$('#customServer').click(function() {
	if (!document.getElementById('customServerSelector').firstChild) {
		$('#customServerSelector').append(
			Mustache.render(Cryptocat.templates['customServer'], {
				name: 'Cryptocat',
				domain: Cryptocat.xmpp.defaultDomain,
				XMPP: Cryptocat.xmpp.defaultConferenceServer,
				BOSH: Cryptocat.xmpp.defaultBOSH
			})
		)
		$('#customServerSelector').append(
			Mustache.render(Cryptocat.templates['customServer'], {
				name: 'Cryptocat (Tor Hidden Service)',
				domain: Cryptocat.xmpp.defaultDomain,
				XMPP: Cryptocat.xmpp.defaultConferenceServer,
				BOSH: 'http://catmeow2zuqpkpyw.onion/http-bind'
			})
		)
	}
	$('#languages').hide()
	$('#footer').animate({'height': 220}, function() {
		$('#customServerDialog').fadeIn()
		$('#customName').val(Cryptocat.serverName)
		$('#customDomain').val(Cryptocat.xmpp.domain)
		$('#customConferenceServer').val(Cryptocat.xmpp.conferenceServer)
		$('#customBOSH').val(Cryptocat.xmpp.bosh)
		$('#customServerReset').val(Cryptocat.locale['loginWindow']['reset']).click(function() {
			$('#customName').val('Cryptocat')
			$('#customDomain').val(Cryptocat.xmpp.defaultDomain)
			$('#customConferenceServer').val(Cryptocat.xmpp.defaultConferenceServer)
			$('#customBOSH').val(Cryptocat.xmpp.defaultBOSH)
			Cryptocat.storage.removeItem('serverName')
			Cryptocat.storage.removeItem('domain')
			Cryptocat.storage.removeItem('conferenceServer')
			Cryptocat.storage.removeItem('bosh')
		})
		$('#customServerSubmit').val(Cryptocat.locale['chatWindow']['continue']).click(function() {
			$('#customServerDialog').fadeOut(200, function() {
				$('#footer').animate({'height': 14})
			})
			Cryptocat.serverName = $('#customName').val()
			Cryptocat.xmpp.domain = $('#customDomain').val()
			Cryptocat.xmpp.conferenceServer = $('#customConferenceServer').val()
			Cryptocat.xmpp.bosh = $('#customBOSH').val()
			Cryptocat.storage.setItem('serverName', Cryptocat.serverName)
			Cryptocat.storage.setItem('domain', Cryptocat.xmpp.domain)
			Cryptocat.storage.setItem('conferenceServer', Cryptocat.xmpp.conferenceServer)
			Cryptocat.storage.setItem('bosh', Cryptocat.xmpp.bosh)
		})
		$('#customServerSave').unbind('click')
		$('#customServerSave').click(function() {
			$('#customServerDelete').val('Delete')
				.attr('data-deleteconfirm', '0')
				.removeClass('confirm')
			if ($('#customDomain').val() === Cryptocat.xmpp.defaultDomain) {
				return // Cannot overwrite the default domain
			}
			var serverIsInList = false
			$('#customServerSelector').children().each(function() {
				if ($('#customName').val() === $(this).val()) {
					serverIsInList = true
					if ($('#customServerSave').attr('data-saveconfirm') !== '1') {
						$('#customServerSave').val('Overwrite?').attr('data-saveconfirm', '1').addClass('confirm')
						return
					}
					else {
						$('#customServerSave').val('Save').attr('data-saveconfirm', '0').removeClass('confirm')
					}
				}
			})
			if (!serverIsInList) {
				$('#customServerSelector').append(
					Mustache.render(Cryptocat.templates['customServer'], {
						name: $('#customName').val(),
						domain: $('#customDomain').val(),
						XMPP: $('#customConferenceServer').val(),
						BOSH: $('#customBOSH').val()
					})
				)
			}
			else {
				$.each($('#customServerSelector option'), function(index, value) {
					if ($(value).val() === $('#customName').val()) {
						$(value).attr('data-domain', $('#customDomain').val())
						$(value).attr('data-bosh', $('#customBOSH').val())
						$(value).attr('data-xmpp', $('#customConferenceServer').val())
					}
				})
			}
			updateCustomServers()
		})
		$('#customServerDelete').unbind('click')
		$('#customServerDelete').click(function() {
			$('#customServerSave').val('Save').attr('data-saveconfirm', '0').removeClass('confirm')
			if ($('#customServerDelete').attr('data-deleteconfirm') === '1') {
				$.each($('#customServerSelector option'), function(index, value) {
					if ($(value).val() === $('#customName').val()) {
						$(value).remove()
					}
				})
				updateCustomServers()
				$('#customServerDelete').val('Delete').attr('data-deleteconfirm', '0').removeClass('confirm')
			}
			else {
				$('#customServerDelete').val('Are you sure?').attr('data-deleteconfirm', '1').addClass('confirm')
			}
		})
		$('#customServerSelector').unbind('change')
		$('#customServerSelector').change(function() {
			$('#customServerDelete').val('Delete')
				.attr('data-deleteconfirm', '0')
				.removeClass('confirm')
				.removeAttr('disabled')
				.removeClass('disabled')
			$('#customServerSave').val('Save')
				.attr('data-saveconfirm', '0')
				.removeClass('confirm')
			var selectedOption = $(this).find(':selected')
			if ($(selectedOption).attr('data-domain') === Cryptocat.xmpp.defaultDomain) {
				$('#customServerDelete').attr('disabled', 'disabled').addClass('disabled')
			}
			$('#customName').val($(selectedOption).val())
			$('#customDomain').val($(selectedOption).attr('data-domain'))
			$('#customConferenceServer').val($(selectedOption).attr('data-xmpp'))
			$('#customBOSH').val($(selectedOption).attr('data-bosh'))
		})
		$('#customDomain').select()
	})
})

})