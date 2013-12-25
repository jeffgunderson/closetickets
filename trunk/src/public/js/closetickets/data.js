CLOSE.data = CLOSE.data || ( function( $ ) {

    var _ = {};

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

    return _;

} ( jQuery ) );