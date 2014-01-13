CLOSE.map = ( function( $ ) {

    var _ = {};

    var map;

    _.initMap = function( options ) {

        initialize();

        function initialize() {

            console.log( options.currentLocation );

            styles = [
                {
                    featureType: "landscape", elementType: "all", stylers: [
                    {hue: "#f0f3f4"},
                    {saturation: -43},
                    {lightness: 54},
                    {visibility: "on"}
                ]
                },
                {
                    featureType: "water", elementType: "all",
                    stylers: [
                        {hue: "#a5c7da"},
                        {saturation: -7},
                        {lightness: -1},
                        {visibility: "on"}
                    ]
                },
                {
                    featureType: "poi.park", elementType: "all", stylers: [
                    {hue: "#a5d5a1"},
                    {saturation: -11},
                    {lightness: -6},
                    {visibility: "on"}
                ]
                },
                {
                    featureType: "poi.school", elementType: "all", stylers: [
                    {hue: "#dfe2e3"},
                    {saturation: -86},
                    {lightness: 31},
                    {visibility: "on"}
                ]
                },
                {
                    featureType: "poi.medical",
                    elementType: "all", stylers: [
                    {hue: "#dfe2e3"},
                    {saturation: -84},
                    {lightness: 10},
                    {visibility: "on"}
                ]
                },
                {
                    featureType: "poi.business", elementType: "all", stylers: [
                    {hue: "#dfe2e3"},
                    {saturation: -56},
                    {lightness: 22},
                    {visibility: "on"}
                ]
                },
                {
                    featureType: "poi.attraction", elementType: "all", stylers: [
                    {hue: "#dfe2e3"},
                    {saturation: -84},
                    {lightness: 47},
                    {visibility: "on"}
                ]
                },
                {
                    featureType: "poi.government", elementType: "all", stylers: [
                    {hue: "#dfe2e3"},
                    {saturation: -56},
                    {lightness: 22},
                    {visibility: "on"}
                ]
                },
                {
                    featureType: "poi.place_of_worship",
                    elementType: "all", stylers: [
                    {hue: "#dfe2e3"},
                    {saturation: -56},
                    {lightness: 22},
                    {visibility: "on"}
                ]
                },
                {
                    featureType: "poi.medical", elementType: "all", stylers: [
                    {hue: "#dfe2e3"},
                    {saturation: -84},
                    {lightness: 10},
                    {visibility: "on"}
                ]
                },
                {
                    featureType: "poi.business", elementType: "all", stylers: [
                    {hue: "#dfe2e3"},
                    {saturation: -56},
                    {lightness: 22},
                    {visibility: "on"}
                ]
                },
                {
                    featureType: "poi.place_of_worship", elementType: "all", stylers: [
                    {hue: "#dfe2e3"},
                    {saturation: -56},
                    {lightness: 22},
                    {visibility: "on"}
                ]
                },
                {
                    featureType: "landscape.man_made",
                    elementType: "all", stylers: [
                    {hue: "#dfe2e3"},
                    {saturation: -75},
                    {lightness: -1},
                    {visibility: "on"}
                ]
                },
                {
                    featureType: "poi", elementType: "labels", stylers: [
                    {visibility: "off"}
                ]
                }
            ];

            // Create a new StyledMapType object, passing it the array of styles,
            // as well as the name to be displayed on the map type control.
            var styledMap = new google.maps.StyledMapType(styles,
                {name: "Styled Map"});

            var myLatlng = new google.maps.LatLng( options.currentLocation.latitude, options.currentLocation.longitude );
            var mapOptions = {
                zoom: 13,
                center: myLatlng,
                disableDefaultUI: true
            }

            CLOSE.gmap = new google.maps.Map(document.getElementById( options.divId.replace('#','') ), mapOptions);

            //Associate the styled map with the MapTypeId and set it to display.
            CLOSE.gmap.mapTypes.set('map_style', styledMap);
            CLOSE.gmap.setMapTypeId('map_style');
        }



    };


    _.initPins = function( listings ) {

        CLOSE.data.getTemplate('pin-window').done(function( template ) {

            // Create the info window to be used
            // Creating it outside of the loop causes there to only be 1 info window
            // If we want more than 1 open at a time, we need to create it inside the loop inside the click event
            var infowindow = new google.maps.InfoWindow({
                content: '',
                maxWidth: 400
            });

            for ( var i = 0; i < listings.results.length; i++ ) {

                var pinLocation = new google.maps.LatLng(listings.results[i].attributes.location.latitude,listings.results[i].attributes.location.longitude);

                var marker = new google.maps.Marker({
                    map: CLOSE.gmap,
                    position: pinLocation,
                    icon: '/img/map/pin.png'
                });

                // add listing data to the pin
                marker.closeData = listings.results[i];

                console.log( marker.closeData );

                google.maps.event.addListener(marker, 'click', (function(marker, i ) {
                    return function() {
                        infowindow.setContent(Mustache.render( template, marker.closeData ));
                        infowindow.open(CLOSE.gmap, marker);
                        CLOSE.gmap.panTo( marker.position );
                    }
                })(marker, i));

                $('a[data-target="pin"]').on('click', (function( marker, i ) {
                    return function() {

                        var pinId = $(this).data().pinid;

                        if ( pinId == marker.closeData.id ) {

                            infowindow.setContent(Mustache.render( template, marker.closeData ));
                            infowindow.open(CLOSE.gmap, marker);
                            CLOSE.gmap.panTo( marker.position );

                        }
                    }
                })(marker, i));

            }

        });

    };



    return _;

} ( jQuery ) );