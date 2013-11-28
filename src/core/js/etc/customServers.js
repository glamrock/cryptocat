$(window).ready(function() {

// Custom server dialog.
$('#customServer').click(function() {
	if (!document.getElementById('customServerSelector').firstChild) {
		$('#customServerSelector').append(
			Mustache.render(Cryptocat.templates['customServer'], {
				name: 'Cryptocat',
				domain: Cryptocat.defaultDomain,
				XMPP: Cryptocat.defaultConferenceServer,
				BOSH: Cryptocat.defaultBOSH
			})
		)
		$('#customServerSelector').append(
			Mustache.render(Cryptocat.templates['customServer'], {
				name: 'Cryptocat (Tor Hidden Service)',
				domain: Cryptocat.defaultDomain,
				XMPP: Cryptocat.defaultConferenceServer,
				BOSH: 'http://catmeow2zuqpkpyw.onion/http-bind'
			})
		)
	}
	$('#languages').hide()
	$('#footer').animate({'height': 220}, function() {
		$('#customServerDialog').fadeIn()
		$('#customName').val(Cryptocat.serverName)
		$('#customDomain').val(Cryptocat.domain)
		$('#customConferenceServer').val(Cryptocat.conferenceServer)
		$('#customBOSH').val(Cryptocat.bosh)
		$('#customServerReset').val(Cryptocat.Locale['loginWindow']['reset']).click(function() {
			$('#customName').val('Cryptocat')
			$('#customDomain').val(Cryptocat.defaultDomain)
			$('#customConferenceServer').val(Cryptocat.defaultConferenceServer)
			$('#customBOSH').val(Cryptocat.defaultBOSH)
			Cryptocat.Storage.removeItem('serverName')
			Cryptocat.Storage.removeItem('domain')
			Cryptocat.Storage.removeItem('conferenceServer')
			Cryptocat.Storage.removeItem('bosh')
		})
		$('#customServerSubmit').val(Cryptocat.Locale['chatWindow']['continue']).click(function() {
			$('#customServerDialog').fadeOut(200, function() {
				$('#footer').animate({'height': 14})
			})
			Cryptocat.serverName = $('#customName').val()
			Cryptocat.domain = $('#customDomain').val()
			Cryptocat.conferenceServer = $('#customConferenceServer').val()
			Cryptocat.bosh = $('#customBOSH').val()
			Cryptocat.Storage.setItem('serverName', Cryptocat.serverName)
			Cryptocat.Storage.setItem('domain', Cryptocat.domain)
			Cryptocat.Storage.setItem('conferenceServer', Cryptocat.conferenceServer)
			Cryptocat.Storage.setItem('bosh', Cryptocat.bosh)
		})
		$('#customServerSave').unbind('click')
		$('#customServerSave').click(function() {
			$('#customServerDelete').val('Delete')
				.attr('data-deleteconfirm', '0')
				.removeClass('confirm')
			if ($('#customDomain').val() === Cryptocat.defaultDomain) {
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
			if ($(selectedOption).attr('data-domain') === Cryptocat.defaultDomain) {
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

function updateCustomServers() {
	var customServers = {}
	$('#customServerSelector option').each(function() {
		var name = $(this).val()
		customServers[name] = {}
		customServers[name].domain = $(this).attr('data-domain')
		customServers[name].xmpp = $(this).attr('data-xmpp')
		customServers[name].bosh = $(this).attr('data-bosh')
	})
	Cryptocat.Storage.setItem('customServers', JSON.stringify(customServers))
}

})