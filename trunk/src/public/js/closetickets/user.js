
CLOSE.user = ( function( $ ) {

    var _ = {};

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

        user.save( null, {
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
     * Using deferred here.. not necessary but using in-case I want to pass some kind of success data/message
     */
    _.logout = function() {

        var deferred = new $.Deferred();

        Parse.User.logOut();

        deferred.resolve('logged out');

        return deferred;

    };

    /**
     * Function to reset password by sending user an email
     * @param email gets passed in through a form or some other input
     * @returns deferred object to handle done methods with the UI
     */
    _.resetPassword = function( email ) {

        var deferred = new $.Deferred();

        Parse.User.requestPasswordReset( email, {
            success: function() {
                // Password reset request was sent successfully
                deferred.resolve();
            },
            error: function(error) {
                // Show the error message somewhere
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


    return _;

} ( jQuery ) );