/**
 * Initiate close namespace
 */

var CLOSE = CLOSE || ( function( $ ) {

    var _ = {};

    _.init = function() {
        Parse.initialize("ENUHvNHQuOMhwYxGiZPi6c3AVORDKhfxnR1SvnY5", "1cogFRDdTx1yH1x73irClLWNPRduSAdpNJY1KIsY")
        CLOSE.getLocation();
        CLOSE.ui.initUser();
        CLOSE.ui.initSidebar();
        CLOSE.ui.initLogin();
    };

    _.initMapPage = function( coords ) {

        CLOSE.map.initMap({
            divId: '#gmap',
            currentLocation: coords
        });

        $('#ticket-search').on('submit', function( e ) {
            e.preventDefault();
            CLOSE.ui.loadListings( this, {
                divId: '#sidebar-listing',
                map: true
            } );
        });

        $('#clear-filter').on('click', function() {

            $(this).parent().find('input').val('');

            CLOSE.ui.loadListings( null, {
                divId: '#sidebar-listing'
            });

        });

        $('#ticket-search').submit();


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

                    CLOSE.initMapPage( coords );

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