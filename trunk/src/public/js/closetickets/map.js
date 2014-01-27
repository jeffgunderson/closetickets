CLOSE.map = ( function( $ ) {

    var _ = {};

    /**
     *
     * @param options has the map options to init the map
     * grabs some config options as well for map styles, etc.
     */
    _.initMap = function( options ) {

            var styles = CLOSE.config.gmapStyles();

            // Create a new StyledMapType object, passing it the array of styles,
            // as well as the name to be displayed on the map type control.
            var styledMap = new google.maps.StyledMapType( styles,
                {
                    name: "Styled Map"
                }
            );

            var myLatLng = new google.maps.LatLng( options.currentLocation.latitude, options.currentLocation.longitude );

            // some basic map options
            var mapOptions = CLOSE.config.gmapOptions( myLatLng );

            // Create the map and expose it
            CLOSE.gmap = new google.maps.Map( document.getElementById( options.divId.replace('#','') ), mapOptions);

            //Associate the styled map with the MapTypeId and set it to display.
            CLOSE.gmap.mapTypes.set('map_style', styledMap);
            CLOSE.gmap.setMapTypeId('map_style');

    };



    // global array to hold pins
    var markersArray = [];
    var newArray = [];


    // TODO: Get this shiz figured out including function below
    // removes all pins that are pushed to global markers array
    _.removePins = function() {

        if (markersArray) {
            for (i in markersArray) {
                markersArray[i].setMap(null);
            }
            markersArray.length = 0;
        }

    };

    /**
     *
     * @param listings is an object containing ticket listings
     * places pins on the map along with their corresponding info windows and data
     */
    _.initPins = function( listings ) {

        // get the template
        CLOSE.util.getTemplate('pin-window').done( function( template ) {

            // Create the info window to be used
            // Creating it outside of the loop causes there to only be 1 info window
            // If we want more than 1 open at a time, we need to create it inside the loop and inside the click event
            var infowindow = new google.maps.InfoWindow({
                content: '',
                maxWidth: 400
            });



            // loop over the listings
            for ( var i = 0; i < listings.results.length; i++ ) {

                // get the coords for the pin
                var pinLocation = new google.maps.LatLng(listings.results[i].attributes.location.latitude, listings.results[i].attributes.location.longitude );

                // TODO: come back to this and re-implement.. only 1 pin image right now
                // get event type to determine pin image
                // var eventType = datamarkers.type,
                // markerImage = '/images/pin-'+ eventType +'.png';



                // create the pin marker
                var marker = new google.maps.Marker({
                    map: CLOSE.gmap,
                    position: pinLocation,
                    icon: '/img/map/pin.png'
                });



                // add data from the listing to the pin
                marker.closeData = listings.results[i];



                // add event listeners for the clicks
                google.maps.event.addListener(marker, 'click', (function(marker, i ) {
                    return function() {
                        infowindow.setContent( Mustache.render( template, marker.closeData ) );
                        infowindow.open( CLOSE.gmap, marker);
                        CLOSE.gmap.panTo( marker.position );
                        CLOSE.gmap.panBy( 0 , -70 );
                    }
                })(marker, i));

                // more event listeners
                $('a[data-target="pin"]').on('click', (function( marker, i ) {
                    return function() {

                        var pinId = $(this).data().pinid;

                        if ( pinId == marker.closeData.id ) {

                            infowindow.setContent( Mustache.render( template, marker.closeData ) );
                            infowindow.open( CLOSE.gmap, marker );
                            CLOSE.gmap.panTo( marker.position );
                            CLOSE.gmap.panBy( 0 , -70 );

                        }
                    }
                })(marker, i));

//                google.maps.event.addListener( infowindow, 'domready', hackClose );
//
//                function hackClose() {
//                    $('.gm-style-iw').css('left', function() {
//                        return ( $(this).parent().width() - $(this).width()) / 2;
//                    }).next('div').remove();
//                }

            }

        });

    };



    return _;

} ( jQuery ) );