
CLOSE.tickets = ( function( $ ) {

    var _ = {};


        /**
     * Query Listings function
     * @query object is required
     * query help: https://parse.com/docs/js_guide#queries-basic
     */
    _.queryTickets = function( query ) {

        var deferred = new $.Deferred();

        query.find({
            success: function( listings ) {

                var data = CLOSE.util.normalizeResults( listings );

                deferred.resolve( data );

            },
            error: function( object, error ) {

                deferred.resolve( object, error );

            }
        });

        return deferred;

    };

    _.queryUserTickets = function() {

        var deferred = new $.Deferred();

        var userPointerObject = CLOSE.parse.createObject({
            objectName: 'UserClean'
        });

        userPointerObject.id = CLOSE.user.currentUser().attributes.cleanId;

        var query = CLOSE.parse.createQuery({
            descending: true,
            objectName: 'Listings',
            equalTo: {
                userPointer: userPointerObject
            },
            include: [
                'userPointer'
            ]
        });

        query.find( {
            success: function( tickets ) {
                CLOSE.log( 'requested:');
                CLOSE.log( tickets );
                deferred.resolve( tickets );
            },
            error: function( tickets, error ) {
                deferred.reject( error );
            }
        });

        return deferred;

    };

    _.deleteTicket = function( ticketId ) {

        var deferred = new $.Deferred();

        var ticket = CLOSE.parse.createObject({
            objectName: 'Listings'
        });

        ticket.id = ticketId;

        ticket.destroy({
            success: function( ticket ) {

                CLOSE.log('deleted!');
                deferred.resolve('deleted!');

                // The object was deleted from the Parse Cloud.
            },
            error: function( ticket , error ) {
                // The delete failed.
                // error is a Parse.Error with an error code and description.
                deferred.reject( error );
            }
        });

        return deferred;

    };

    /**
     *
     * @param fields
     * fields are an array of fields from a listing form
     * creates the listing with parse and returns the deferred object so done methods can be used
     * @returns {$.Deferred}
     * TODO: change to createTicket
     */
    _.createTicket = function( fields ) {

        // create the deferred
        var deferred = new $.Deferred();

        var userData = CLOSE.user.currentUser();

        var listing = CLOSE.parse.createObject({
            objectName : 'Listings',
            fields : {
                title : fields.name,
                description : fields.description,
                date: new Date( fields.date ),
                price: parseFloat( fields.price ),
                searchableText: fields.name.toLowerCase() + ' ' + fields.description.toLowerCase(),
                location: fields.location,
                locationGeoPoint: new Parse.GeoPoint({ latitude: fields.location.latitude, longitude: fields.location.longitude })
            },
            pointers : [
                {
                    objectName : 'UserClean',
                    objectId : userData.attributes.cleanId,
                    name: 'userPointer'
                }
            ]
        });

        var ACL = CLOSE.parse.createACL({
            publicReadAccess: true,
            publicWriteAccess: false,
            writeUsers:[
                userData.id
            ]
        });

        listing.setACL( ACL );

        // save that shiz
        listing.save( null, {
            success: function( listingItem ) {

                // return a successful handler
                deferred.resolve( listingItem );

            },
            error: function(listingItem, error) {

                // return a failed handler with the error
                deferred.reject( error );

            }
        });

        return deferred;

    };

    /**
     *
     * @param thisData is a form object
     * function creates a parse query for ticket listings to query the DB
     * query help: https://parse.com/docs/js_guide#queries-basic
     * @returns {Parse.Query}
     * TODO: redo this function! Use builder, etc.
     */
    _.createListingQuery = function( thisData ) {

        // turn $form into jQuery object, run it through our form to array util and create the query
        var $form = $( thisData ),
            fields = CLOSE.util.formToArray( $form ),
            listing = Parse.Object.extend( 'Listings' ),
            query = new Parse.Query( listing );

        // formate the query by updated date
        query.descending('updatedAt');

        // if the form contains a search field
        if ( fields.search ) {

            query.contains('searchableText', fields.search.toLowerCase() );

        }

        // if we are looking for a beginning date
        if ( fields.dateFrom ) {

            query.greaterThan('updatedAt', new Date( fields.dateFrom ) );

        }

        // if we are looking at a end date
        if ( fields.dateTo ) {

            query.lessThan('updatedAt', new Date( fields.dateTo ) );

        }

        query.include('userPointer');

        // if we are looking at an area
        query.near('locationGeoPoint', CLOSE.latlng);

        // return the query
        return query;

    };

    return _;

} ( jQuery ) );