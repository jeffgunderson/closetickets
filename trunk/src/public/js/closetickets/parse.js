CLOSE.parse = CLOSE.parse || ( function( $ ) {

    var _ = {};

    _.init = function() {

        Parse.initialize("fyvfNcsZtTWYwDqsdAvDwpvxKANR7TyaWaUFt0hz", "3OyBI4lgjRUOa7O3BSKRMBpX52ReROkuypwFvIoo");

    };

    _.createNewFbUser = function() {

        Parse.FacebookUtils.logIn("user_likes,email", {
            success: function(user) {
                // Handle successful login
                console.log(user);

                $.ajax({
                    url: 'https://graph.facebook.com/' + user.attributes.authData.facebook.id,
                    async: true
                }).done(function(userInfo) {

//                        var newUser = MOTO.parse.userData();

                        newUser.set('name',userInfo.name);
                        newUser.set('profileimage','https://graph.facebook.com/' + user.attributes.authData.facebook.id + '/picture');
                        newUser.set('email',userInfo.email);

                        newUser.save(null, {
                            success: function(user) {

                                // successfully created the account so do this
//                                CLOSE.ui.modalHide('welcome-signup');
//                                CLOSE.ui.modalShow('welcome-start');
//
//                                CLOSE.ui.initProfilePreview('profile-menu','profile-menu','profile-preview');

                            },
                            error: function(user, error) {

                            }

                        });



                    });

            },
            error: function(user, error) {
                // Handle errors and cancellation
            }
        });

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
    _.loginUser = function( $element, fields ) {

        var deferred = new $.Deferred();

        Parse.User.logIn( fields['0'].value , fields['1'].value , {
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

        var user = MOTO.parse.currentUser();

        // wrap in results
        var userData = {};
        userData.results = user;

        return userData;
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

                console.log("Successfully retrieved " + posts.length + " posts.");

                var data = {};
                data.results = posts;

                MOTO.data.convertDate( data );

                deferred.resolve( data );

            },
            error: function(object, error) {

                deferred.reject( error );

            }
        });

        return deferred;

    };

    /**
     * Upload image function
     * Image data is passed in through... TODO: FIGURE OUT :)
     */
    _.uploadPhoto = function() {

    };

    /**
     * Add Photo Post function
     * @formdata is required
     */
    _.addPhoto = function( formData ) {

        var deferred = new $.Deferred();

        var currentUser = MOTO.parse.currentUser();
        var post = Parse.Object.extend('posts');
        var photoPost = new post();

        // if there is no image, then fail it
        if ( !formData.url || formData.url == '' ) {
            console.log('no image');
            deferred.reject();
            return false;
        }

        // set some data for the post
        photoPost.set( 'message', formData.message )
            .set( 'url', formData.url )
            .set( 'user', currentUser.id )
            .set( 'name', currentUser.attributes.name )
            .set( 'profileurl', currentUser.attributes.profileImage )
            .set( 'type', 'photo' );

        // save the photo
        photoPost.save(null, {
            success:function( returnData ) {

                deferred.resolve( returnData );

            },
            error: function( error ) {

                deferred.reject( error );

            }
        });

        return deferred;

    };



    return _;

} ( jQuery ) );
