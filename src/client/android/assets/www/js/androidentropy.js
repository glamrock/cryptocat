

    var watchID = null;
	
	var lastAccel = 0;
	var accel = 0;

    function startWatch() {
        var options = { frequency: 100 };
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
			$('#keytext').append(ae);
			lastAccel = accel;
			
			Crypto.Fortuna.AddRandomEvent(ae);
					
			navigator.notification.vibrate(500);
			
		}
		else {
		
			stopWatch ();
			
			$('#keytext').css('margin-top', '-=6px');
			$('#keytext').html("<br />Checking integrity");
	
			if (integritycheck()) {
				$('#keytext').html($('#keytext').html() + 
				'  &#160;<span class="blue">OK</span>' + '<br />Generating keys');
				pubkey = dhgen(gen(24, 0, 1), "gen");
				$('#keytext').html($('#keytext').html() + ' &#160; &#160; ' + 
				'<span class="blue">OK</span><br />Communicating');
				setTimeout("nickset()", 250);
			}
			else {
				$('#keytext').html('<span class="red">Integrity check failed. Cryptocat cannot proceed safely.</span>');
			}
		}
	
    }

    // onError: Failed to get the acceleration
    //
    function onError() {
        alert('onError!');
    }
    