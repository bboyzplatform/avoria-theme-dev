var SECTOR = ['_15_DISCOUNT', 'FREE_2_PROBE', '_20_DISCOUNT', 'GOOD_LUCK_LATER', 'FREE_1_PROBE', '_10_DISCOUNT', 'NOT_TODAY', '_30_DISCOUNT', 'OOPS_SO_SORRY'];

let ERRORS = {
    'limit': 'The limit of attempts is exhausted',
    'server': 'Server error',
    'email_empty': 'Please enter your email',
    'email_invalid': 'Email is invalid. Please enter valid email',
    'wait': 'Waiting for server response'
};
let URL = 'address';
var disabled = false;
let TURNOVERS = 8;

//Test
jQuery(function () {
    roundTo('FREE_2_PROBE');
});

function showSnackbar(message) {
    var snackbar = jQuery('.snackbar');
    snackbar.addClass('show');
    snackbar.text(message);
    // After 3 seconds, remove the show class from DIV
    setTimeout(function () {
        snackbar.removeClass('show');
        snackbar.text();
    }, 3000);
}

function validateEmail(email) {
    var emailReg = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
    return emailReg.test(email);
}

function spin() {
    if (jQuery('.content-form').val().length === 0) {
        showSnackbar(ERRORS['email_empty']);
        return;
    }
    else if (!validateEmail(jQuery('.content-form').val())) {
        showSnackbar(ERRORS['email_invalid']);
        return;
    }
    else if (disabled) {
        showSnackbar(ERRORS['wait']);
        return;
    }
    disabled = true;
    jQuery.post(URL + "/get_code",
        {
            email: jQuery('.content-form').val()
        }).done(function (response) {
            if (response['sector'] === 0) {
                showSnackbar(ERRORS['limit']);
            }
            else if (SECTOR.indexOf(response['sector']) != null) {
                roundTo(response['sector']);
            }
            else {
                showSnackbar(ERRORS['server']);
            }
        });
}

function animate(options) {

    var start = performance.now();

    requestAnimationFrame(function animate(time) {
        var timeFraction = (time - start) / options.duration;
        var progress = options.timing(timeFraction)
        options.draw(progress);

        if (timeFraction < 1) {
            requestAnimationFrame(animate);
        }

    });
}

function roundTo(sector) {
    var lights = [0.1, 0.1, 0.1, 0.1, 0.1];
    var light_speed = 0.4;
    var blink_delay = 2.5;
    var curr_light = 4;
    animate({
        duration: 10000,
        timing:
            function (t) {
                if(t>.97){
                    jQuery('.light').css('opacity', 1);
                    return t = 1;
                }
                return 1 + (--t) * t * t * t * t // acceleration until halfway, then deceleration 
            },
        draw: function (progress) {
            angle = progress * (360 * TURNOVERS) + SECTOR.indexOf(sector)*40;
            jQuery('.rotate').css('transform', 'rotate(' + angle + 'deg)'); //animate wheel

            jQuery('.wheel-text').removeClass('lighten');
            jQuery('.' + SECTOR[parseInt((angle % 360) / 40)]).addClass('lighten'); //animate text light

            jQuery('.light_' + 5 + '-img').css('opacity', 0.3 + angle / (360 * TURNOVERS)); //animate last light

            jQuery('.light_' + curr_light + '-img').css('opacity', lights[curr_light]); //animate lights
            lights[curr_light] += light_speed;
            if (lights[curr_light] > blink_delay) {
                curr_light -= 1;
            }
            if (curr_light < 0) {
                curr_light = lights.length - 1;
                for (var i = 0; i < lights.length - 1; i++) {
                    lights[i] = 0.1;
                    jQuery('.light_' + i + '-img').css('opacity', lights[i]);
                }
            }
        }


    });

}
//by itis.team