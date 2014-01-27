CLOSE.util = CLOSE.util || ( function( $ ) {

    var _ = {};

    /**
     * Normalizing parse result data function
     * converts an anonymous array to an array wrapped with 'results'...
     * makes it easier to use when using templates
     * @data is required
     * returns the data object
     */
    _.normalizeResults = function( data ) {

        // create the array and wrap the data in results
        var newData = {};
        newData.results = data;

        // return the data
        return newData;

    };


    /**
     * Form to array function
     * converts a forms data to an array for easier handling
     * @$form is required (jQuery object)
     * returns the form data as an array
     */
    _.formToArray = function( $form ) {

        // get all the values from the form and create an empty array to push values to
        var dataArray = $form.serializeArray(),
            formData = {};

        // loop over each form data item
        for ( i = 0; i < dataArray.length; i++ ) {

            // push the data to the formData array to be used later
            formData[dataArray[i].name] = dataArray[i].value;

        }

        // return the new data
        return formData;

    };

    /**
     * Date converter function
     * Uses the moment.js lib
     * Used to convert parse dates to a human readable date
     * Doesn't return any data because it edits the object directly
     */
    _.convertDate = function( data ) {

        // get the results ( most likely ticket listings ) from the data object
        var results = data.results;

        // loop over all the results...
        for ( i = 0; i < results.length; i++ ) {

            // get the single result
            var thisData = results[i];

            // if it has a createdAt
            // TODO: figure out if other dates need to be converted
            if ( thisData.createdAt ) {

                // set the dates into a moment.js readable form
                var dateCreated = new Date( thisData.createdAt ),
                    today = new Date(),
                    date;

                // if the date is over 5 days ago, show a full date
                if ( dateCreated - today <= -432000000 ) {
                    date = moment( thisData.createdAt ).format("MMMM DD YYYY");
                }

                // otherwise we will show a from now value instead (ex. 3 days ago)
                else{
                    date = moment( thisData.createdAt ).fromNow();
                }

                // save the date to the data object directly
                thisData.createdAtFormatted = date;

            }

        }

    };


    /**
     *
     * @param templateName is a string containing template name
     * templates are cached in templateCache array
     * @returns {$.Deferred}
     */

    // the template cache array
    var templateCache = {};

    _.getTemplate = function( templateName ) {

        var deferred = new $.Deferred();

        // if the template has been cached
        if ( templateCache[ templateName ] ) {

            deferred.resolve( templateCache[ templateName ] );

        }

        // otherwise fetch the template
        else {

            // send the request
            $.ajax({
                url: '/templates/' + templateName + '.html'
            })
                .done(function( template ) {
                    templateCache[ templateName ] = template;
                    deferred.resolve( template );
                })
                .fail(function( error ) {
                    deferred.reject( error );
                });

        }

        // and return the deferred object
        return deferred;

    };


    /**
     *
     * @param listings is an object containing listings
     * adds locationDistanceFromText to listings object and returns it
     * uses google maps compute distance function
     * @returns {*}
     */
    _.locationUtil = function( listings ) {

        for ( var i = 0; i < listings.results.length; i++ ) {

            var listing = listings.results[i],
                from = new google.maps.LatLng(listings.results[i].attributes.location.latitude, listings.results[i].attributes.location.longitude),
                to   = new google.maps.LatLng(CLOSE.location.latitude, CLOSE.location.longitude),
                distance = google.maps.geometry.spherical.computeDistanceBetween(from, to);

            var mile = 5280,
                distanceText;

            // if the distance is 0 set it as current location
            if ( distance == 0 ) {
                distanceText = 'current location';
            }

            // if its less than 1000 feet away we will use feet measurement
            else if ( distance > 0 && distance < 1000 ) {
                distanceText = Math.round( distance + ' feet');
            }

            // if its between 1 miles and 1.1 mile (round to mile) set it as singular mile
            else if ( distance > mile && distance < mile + ( mile * 0.1 ) ) {
                distanceText = Math.round( distance + ' mile');
            }

            // otherwise set it to miles
            else {
                distanceText = Math.round( ( distance / mile ) * 10 ) / 10 + ' miles';
            }

            // add the location text to the listing object
            listing.attributes.locationDistanceFromText = distanceText;

        }

        return listings;

    };


    return _;

} ( jQuery ) );