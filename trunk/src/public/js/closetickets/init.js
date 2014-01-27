/**
 * Initiate CLOSE namespace
 */

var CLOSE = CLOSE || ( function( $ ) {

    var _ = {};

    _.init = function() {
        Parse.initialize("ENUHvNHQuOMhwYxGiZPi6c3AVORDKhfxnR1SvnY5", "1cogFRDdTx1yH1x73irClLWNPRduSAdpNJY1KIsY")
//        CLOSE.getLocation();
        CLOSE.initMapPage();
        CLOSE.ui.initUser();
        CLOSE.ui.initSidebar();
        CLOSE.ui.initLogin();
    };

    /**
     *
     * loads the map and binds the search events
     */
    _.initMapPage = function() {

        // get the location first
        CLOSE.getLocation()
            .done(function( coords ) {

            CLOSE.map.initMap({
                divId: '#gmap',
                currentLocation: coords
            });

            $('#ticket-search').on( 'submit', function( e ) {
                e.preventDefault();
                CLOSE.ui.loadListings( this, {
                    divId: '#sidebar-listing',
                    map: true
                } );
            });

            $('#clear-filter').on( 'click', function() {

                $(this).parent().find('input').val('');

                CLOSE.ui.loadListings( null, {
                    divId: '#sidebar-listing'
                });

            });

            $('#ticket-search').submit();

        });

    };



    /**
     * Uses HTML5 location to figure location
     * MOST accurate using phone/tablet with GPS, desktop/laptop not so accurate
     * TODO: use deferred method
     * TODO!!! TODO!!! TODO!!!: make sure new deferred method works ;-)
     */
//    var locationInProgress = false;
    _.getLocation = function() {

        // create the deferred object
        var deferred = new $.Deferred();

//        if ( !CLOSE.location && locationInProgress == false ) {

            // Check if it's possible to get location
            if ( "geolocation" in navigator ) {

                // set the location progress flag
//                locationInProgress = true;

                // get the location
                navigator.geolocation.getCurrentPosition( function( position ) {

                    // create a coordinate array
                    var coords = {
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude
                    };

                    // expose the location
                    CLOSE.location = coords;

                    // TODO: use deferred method so this function doesn't run inside location function
//                    CLOSE.initMapPage( coords );

                    deferred.resolve( coords );

                });

            }

            else {
                // TODO: Use another way to find location?? IP lookup?? Not interested at the moment
            }

//        }

        return deferred;

    };

    /**
     *
     * @param a can be a string or object
     * used to prevent errors in browsers that don't support console.log (IE8, etc)
     */
    _.log = function( a ) {

        // if console log is available
        if ( console.log ) {
            console.log( a );
        }
        // otherwise
        else{
            alert( a );
        }

    };

    return _;

} ( jQuery ) );