CLOSE.parse = CLOSE.parse || ( function( $ ) {

    var _ = {};

    // TODO: re-implement this ( should be working-ish but not exposed to user )
    _.createNewFbUser = function() {

        var deferred = new $.Deferred();

        Parse.FacebookUtils.init();

        Parse.FacebookUtils.logIn("user_likes,email", {
            success: function(user) {
                // Handle successful login
                console.log(user);

                $.ajax({
                    url: 'https://graph.facebook.com/' + user.attributes.authData.facebook.id,
                    async: true
                }).done(function(userInfo) {

                        var newUser = CLOSE.parse.userData();

                        newUser.set('name',userInfo.name);
                        newUser.set('profileimage','https://graph.facebook.com/' + user.attributes.authData.facebook.id + '/picture');
                        newUser.set('email',userInfo.email);

                        newUser.save(null, {
                            success: function( user ) {

                                deferred.resolve();

                            },
                            error: function(user, error) {

                                deferred.reject();

                            }

                        });

                    });

            },
            error: function(user, error) {
                // Handle errors and cancellation
            }
        });

        return deferred;

    };

    /**
     * Create new user function
     * pass in fields object
     * @$element is for error handling
     */
    _.createNewUser = function( fields ) {

        var deferred = new $.Deferred();

        var user = new Parse.User();

        // set data on user object
        user.set('name', fields.fullname );
        user.set('username', fields.email );
        user.set('password', fields.password );

        CLOSE.log( user );

        user.save(null, {
            success: function(user) {

                deferred.resolve( user );
                CLOSE.log(user);

            },
            error: function(user, error) {

                deferred.reject( user, error );
                CLOSE.log(error);

            }

        });

        return deferred;

    };

    /**
     * Login User Function
     * pass in fields object
     * @$element is for error handling
     */
    _.loginUser = function( fields ) {

        var deferred = new $.Deferred();

        Parse.User.logIn( fields.email , fields.password , {
            success: function(user) {

                deferred.resolve( user );

            },
            error: function(user, error) {

                deferred.reject( user, error );
            }
        });

        return deferred;

    };

    /**
     * Simple logout API wrapper
     * Need a better solution for what to do after logout.. maybe ;-)
     */
    _.logout = function() {

        Parse.User.logOut();

        //TODO: FIGURE OUT WHERE TO GO
        window.location.href = '/';

    };


    /**
     * Finds a user
     * @userId is optional
     * If no userID, it will get the userID based on the url
     */
    _.findUser = function( userId ) {

        var deferred = new $.Deferred();

        if ( !userId ) {

            // if it's not passed in, let's get it from the url
            var urlPathItems = window.location.pathname.split( '/' );
            userId = urlPathItems[1];

        }

        var query = new Parse.Query(Parse.User);
        query.equalTo( 'objectId' , userId );
        query.find({
            success: function( userData ) {

                deferred.resolve( userData );

            },
            error: function( error ) {

                deferred.reject( error );

            }
        });

        return deferred;
    };

    /**
     * Current User function
     * returns the current user object
     */
    _.currentUser = function() {

        return Parse.User.current();

    };

    /**
     * Current User Data function
     * @userData object is created to normalize data
     * returns the current user object after manipulation
     */
    _.userData = function() {

        var user = CLOSE.parse.currentUser();

        // wrap in results
        var userData = {};
        userData.results = user;

        return userData;
    };


    /**
     * Query Listings function
     * @query object is required
     * query help: https://parse.com/docs/js_guide#queries-basic
     */
    _.queryListings = function( query ) {

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


    /**
     * Query Posts function
     * @query object is required
     * query help: https://parse.com/docs/js_guide#queries-basic
     */
    _.queryUserPosts = function( query ) {

        var deferred = new $.Deferred();

        query.find({
            success: function(posts) {

                CLOSE.log("Successfully retrieved " + posts.length + " posts.");

                var data = {};
                data.results = posts;

                CLOSE.util.convertDate( data );

                deferred.resolve( data );

            },
            error: function(object, error) {

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
     */
    _.createListing = function( fields ) {

        // create the deferred
        var deferred = new $.Deferred();

        // access the listing class and create a listing object to be saved
        var Listings = Parse.Object.extend('Listings');
        var listing = new Listings();

        // get some user data from the current user
        var userData = CLOSE.parse.userData();

        // get the location of the current user
        var location = new Parse.GeoPoint({latitude: CLOSE.location.latitude, longitude: CLOSE.location.longitude });

        // set all the fields for the listing
        listing.set('listingTitle', fields.name );
        listing.set('listingDescription', fields.description );
        listing.set('listingDate', new Date( fields.date ));
        listing.set('price', parseFloat( fields.price ) );
        listing.set('userId', userData.id );
        listing.set('searchableText', fields.name.toLowerCase() + fields.description.toLowerCase() );
        listing.set('location', CLOSE.location );
        listing.set('locationGeoPoint', location );

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

        // return the query
        return query;

    };


    return _;

} ( jQuery ) );
