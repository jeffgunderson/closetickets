/**
 * Initiate close namespace
 */

var CLOSE = CLOSE || ( function( $ ) {

    var _ = {};

    _.init = function() {
        Parse.initialize("ENUHvNHQuOMhwYxGiZPi6c3AVORDKhfxnR1SvnY5", "1cogFRDdTx1yH1x73irClLWNPRduSAdpNJY1KIsY");
        CLOSE.getLocation();
    };

    var locationInProgress = false;

    _.getLocation = function() {

        if ( !CLOSE.location && locationInProgress == false ) {

            if ("geolocation" in navigator) {

                locationInProgress = true;

                /* geolocation is available */
                navigator.geolocation.getCurrentPosition(function(position) {

                    var coords = {
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude
                    };

                    CLOSE.location = coords;

                    console.log( CLOSE.location );

                });

            }

            else {

                /* geolocation IS NOT available */
            }

        }

        else{

            console.log('already found or started to find')

        }

    };

    _.log = function( a ) {

        // prevent errors for IE
        if ( console.log ) {
            console.log( a );
        }

    };

    return _;

} ( jQuery ) );