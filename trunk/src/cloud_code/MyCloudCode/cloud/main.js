


/**
 * Function creates a clean user object so we can protect sensitive data
 * TODO: get the actual profile image when it's available
 * TODO: May need to add new fields for a more complete profile
 */
Parse.Cloud.afterSave( Parse.User, function( request ) {

    // only if it didn't exist ( meaning I am only going to run the following once )
    if ( !request.object.existed() ) {

        // SET THE CLEAN USER DATA

        var UserClean = Parse.Object.extend('UserClean');
        var userClean = new UserClean();

        userClean.set('name', request.object.attributes.name );
        userClean.set('userId', request.object.id );

        if ( request.object.attributes.profileImage ) {
            userClean.set('profileImage', request.object.attributes.profileImage );
        }
        else{
            userClean.set('profileImage', '/img/user/blankavatar.png' );
        }

        // SET THE CLEAN ACL

        var cleanACL = new Parse.ACL();

        cleanACL.setPublicReadAccess( true );
        cleanACL.setPublicWriteAccess( false );
        cleanACL.setWriteAccess( Parse.User.current(), true );

        userClean.setACL( cleanACL );

        userClean.save( null, {
            success: function( result ) {

                // RESAVE THE ORIGINAL USER OBJECT WITH PROPER ACL AND CLEAN ID RELATION

                var user = request.object;
                var userACL = new Parse.ACL();

                userACL.setPublicReadAccess( false );
                userACL.setReadAccess( request.object.id, true );
                userACL.setWriteAccess( request.object.id, true );

                user.setACL( userACL );
                user.set('cleanId', result.id );
                user.save();

            },
            error: function() {

                //TODO let's log an error here somehow

            }
        });

    }

});