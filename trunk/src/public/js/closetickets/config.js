CLOSE.config = CLOSE.config || ( function( $ ) {

    var _ = {};

    _.gmapOptions = function( myLatLng ) {

        return {
            zoom: 13,
            center: myLatLng,
            disableDefaultUI: true
        };

    };

    _.gmapStyles = function() {

        return [
            {
                featureType: "landscape",
                elementType: "all",
                stylers: [
                    { hue: "#f0f3f4" },
                    { saturation: -43 },
                    { lightness: 54 },
                    { visibility: "on" }
                ]
            },
            {
                featureType: "water",
                elementType: "all",
                stylers: [
                    {hue: "#a5c7da"},
                    {saturation: -7},
                    {lightness: -1},
                    {visibility: "on"}
                ]
            },
            {
                featureType: "poi.park",
                elementType: "all",
                stylers: [
                    {hue: "#a5d5a1"},
                    {saturation: -11},
                    {lightness: -6},
                    {visibility: "on"}
                ]
            },
            {
                featureType: "poi.school",
                elementType: "all",
                stylers: [
                    {hue: "#dfe2e3"},
                    {saturation: -86},
                    {lightness: 31},
                    {visibility: "on"}
                ]
            },
            {
                featureType: "poi.medical",
                elementType: "all",
                stylers: [
                    {hue: "#dfe2e3"},
                    {saturation: -84},
                    {lightness: 10},
                    {visibility: "on"}
                ]
            },
            {
                featureType: "poi.business",
                elementType: "all",
                stylers: [
                    {hue: "#dfe2e3"},
                    {saturation: -56},
                    {lightness: 22},
                    {visibility: "on"}
                ]
            },
            {
                featureType: "poi.attraction",
                elementType: "all",
                stylers: [
                    {hue: "#dfe2e3"},
                    {saturation: -84},
                    {lightness: 47},
                    {visibility: "on"}
                ]
            },
            {
                featureType: "poi.government",
                elementType: "all",
                stylers: [
                    {hue: "#dfe2e3"},
                    {saturation: -56},
                    {lightness: 22},
                    {visibility: "on"}
                ]
            },
            {
                featureType: "poi.place_of_worship",
                elementType: "all",
                stylers: [
                    {hue: "#dfe2e3"},
                    {saturation: -56},
                    {lightness: 22},
                    {visibility: "on"}
                ]
            },
            {
                featureType: "poi.medical",
                elementType: "all",
                stylers: [
                    {hue: "#dfe2e3"},
                    {saturation: -84},
                    {lightness: 10},
                    {visibility: "on"}
                ]
            },
            {
                featureType: "poi.business",
                elementType: "all",
                stylers: [
                    {hue: "#dfe2e3"},
                    {saturation: -56},
                    {lightness: 22},
                    {visibility: "on"}
                ]
            },
            {
                featureType: "poi.place_of_worship",
                elementType: "all",
                stylers: [
                    {hue: "#dfe2e3"},
                    {saturation: -56},
                    {lightness: 22},
                    {visibility: "on"}
                ]
            },
            {
                featureType: "landscape.man_made",
                elementType: "all",
                stylers: [
                    {hue: "#dfe2e3"},
                    {saturation: -75},
                    {lightness: -1},
                    {visibility: "on"}
                ]
            },
            {
                featureType: "poi",
                elementType: "labels",
                stylers: [
                    {visibility: "off"}
                ]
            }
        ];

    };

    return _;

} ( jQuery ) );