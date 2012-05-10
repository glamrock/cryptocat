var watchID = null;
var lastAccel = 0;
var accel = 0;

function startWatch() {
	var options = { frequency: 50 };
	watchID = navigator.accelerometer.watchAcceleration(onSuccess, onError, options);
}

function stopWatch() {
	if (watchID) {
		navigator.accelerometer.clearWatch(watchID);
		watchID = null;
	}
}

function onSuccess(acceleration) {
	if (Crypto.Fortuna.Ready() === 0) {
		accel = acceleration.x + acceleration.y + acceleration.z;
		var ae = String.fromCharCode(Math.round(lastAccel * accel));
		//$('#keytext').append(ae);
		lastAccel = accel;
		Crypto.Fortuna.AddRandomEvent(ae);
	}
	else {
		stopWatch();
		navigator.notification.vibrate(1000);
		$('#shaketext').fadeOut(500, function() {
			$('#keygenprogress').animate({width: '10%'}, 300);
			$('#keygenbar').css('padding-top', '0');
			$('#keygenbar').css('height', '30px');
			$('#keygenbar').html('<div id="keygenprogress"></div>');
			$('#keygenprogress').animate({width: '33%'}, 300);
			if (integritycheck()) {
				$('#keygenprogress').animate({width: '66%'}, 300);
				prikey = gen(32, 0, 1).toString();
				pubkey = bigInt2str(ecDH(prikey), 64);
				$('#keygenprogress').animate({width: '100%'}, 300);
				nickset();
			}
			else {
				$('#keytext').html('<span class="red">Integrity check failed. Cryptocat cannot proceed safely.</span>');
			}
		});
	}
}

function onError() {
	alert('Accelerometer Error!');
}
