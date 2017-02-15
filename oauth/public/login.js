/**
 * Created by calvinm2 on 2/15/17.
 */
$(document).ready(function(){

    function getOAuthCookie() {
        var cookies = (document.cookie).split(';');
        for (let c of cookies) {
            let pair = c.split('=');
            let name = pair[0].trim();
            let value = pair[1].trim();
            if (name == "oauthkeys") {
                // console.log("PRE:", value);
                value = value.substr(4); // random j: at the beginning of it? Dunno.
                value = decodeURIComponent(value);
                // console.log("VAL:", value);
                value = JSON.parse(value);
                // console.log(name, value);
                return value;
            }
        }
        // console.log("Cookies:", cookies);
    }

    $('#sign-in').on('click',function(ev){

        var cookie = getOAuthCookie();
        console.log("Got cookie:",cookie);

        $.ajax("https://foursquare.com/oauth2/authenticate" +
                "?client_id=" + cookie.id +
                "&response_type=code" +
                "&redirect_uri=http://ec2-54-210-24-107.compute-1.amazonaws.com/oauth/",
            {
            }
        );

    })

});