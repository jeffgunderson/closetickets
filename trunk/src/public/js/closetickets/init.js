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
        if ( $('#gmap').length ) {

            CLOSE.getLocation()
                .done(function( coords ) {

                    CLOSE.map.initMap({
                        divId: '#gmap',
                        currentLocation: coords
                    });

                    CLOSE.ui.initListingFiltering({
                        searchFormId: '#ticket-search',
                        clearDivId: '#clear-filter',
                        sidebarDivId: '#sidebar-listing'
                    });

                    CLOSE.ui.initListingCreator();

            });
        }

    };



    /**
     * Uses HTML5 location to figure location
     * MOST accurate using phone/tablet with GPS, desktop/laptop not so accurate
     */
//    var locationInProgress = false;
    _.getLocation = function() {

        // create the deferred object
        var deferred = new $.Deferred();

        if ( !CLOSE.location ) {

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

                    deferred.resolve( coords );

                }, function() {

                    // if geo lookup fails, use another option. Throwing in Austin coords instead
                    var coords = {
                        latitude: 30.29128,
                        longitude: -97.73858
                    };

                    // expose the location
                    CLOSE.location = coords;

                    deferred.resolve( coords )

                });

            }

            else {
                CLOSE.log('cant find the location');
                // TODO: Use another way to find location?? IP lookup?? Not interested at the moment
            }

        }

        else{

            deferred.resolve( CLOSE.location );

        }

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