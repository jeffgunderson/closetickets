CLOSE.data = CLOSE.data || ( function( $ ) {

    var _ = {};

    /**
     * Normalizing parse result data function
     * converts an anonymous array to an array wrapped with 'results'
     * @data is required
     * returns the data object
     */
    _.normalizeResults = function( data ) {

        var newData = {};
        newData.results = data;

        return newData;

    };

    /**
     * Form to array function
     * converts a forms data to an array for easier handling
     * @$form is required
     * returns the form data as an array
     */
    _.formToArray = function( $form ) {

        // TODO find where I used profileData.. changed to formData for portability

        // get all the values from the form and create an empty array to push values to
        var dataArray = $form.serializeArray(),
            formData = {};

        // loop over each form data item
        for ( i = 0; i < dataArray.length; i++ ) {

            // push the data to the profileData array to be used later
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

        var results = data.results;

        // loop over all the results...
        for ( i = 0; i < results.length; i++ ) {

            var thisData = results[i];

            // ... so we can find each createdAt item
            if ( thisData.createdAt ) {

                // set the dates
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

                // save the date to the data to be used elsewhere
                thisData.createdAtFormatted = date;

            }

        }

    };



    _.getTemplate = function( template ) {

        var deferred = new $.Deferred();

        $.ajax({
            url: '/templates/' + template + '.html'
        })
        .done(function( template ) {
            deferred.resolve( template );
        });

        return deferred;

    }




    _.locationUtil = function( listings ) {

        for ( var i = 0; i < listings.results.length; i++ ) {

            var listing = listings.results[i],
                from = new google.maps.LatLng(listings.results[i].attributes.location.latitude, listings.results[i].attributes.location.longitude),
                to   = new google.maps.LatLng(CLOSE.location.latitude, CLOSE.location.longitude),
                distance = google.maps.geometry.spherical.computeDistanceBetween(from, to);

            console.log(distance);

            var mile = 5280,
                distanceText;

            if ( distance < 1000 ) {

                if ( distance == 0 ) {
                    distanceText = distance + ' feet';
                }
                else{
                    distanceText = Math.round( distance + ' feet');
                }

            }
            else if ( distance > mile && distance < mile + ( mile * 0.1 ) ) {
                distanceText = Math.round( distance + ' mile');
            }
            else {
                distanceText = Math.round( ( distance / mile ) * 10 ) / 10 + ' miles';
            }

            listing.attributes.locationDistanceFromText = distanceText;

        }

        return listings;

    };




    _.createListingQuery = function( thisData ) {

        var $form = $( thisData ),
            fields = CLOSE.data.formToArray( $form ),
            listing = Parse.Object.extend( 'Listings' ),
            query = new Parse.Query( listing );

        query.descending('updatedAt');

        //TODO: need to create a parse field that holds all searchable text

        if ( fields.search ) {

            query.contains('searchableText', fields.search.toLowerCase() );

        }

        if ( fields.dateFrom ) {

            query.greaterThan('updatedAt', new Date( fields.dateFrom ) );

        }

        if ( fields.dateTo ) {

            query.lessThan('updatedAt', new Date( fields.dateTo ) );

        }

        return query;

    };



    return _;

} ( jQuery ) );