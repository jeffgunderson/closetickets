
CLOSE.messages = ( function( $ ) {

    var _ = {};

    /**
     *
     * @param conversationId
     * @returns {$.Deferred}
     */
    _.queryMessages = function( conversationId ) {

        var deferred = new $.Deferred();

        var conversation = CLOSE.parse.createObject({
            objectName: 'Conversations'
        });
        conversation.id = conversationId;

        var query = CLOSE.parse.createQuery({
            descending: true,
            objectName: 'Messages',
            equalTo: {
                conversationPointer: conversation
            },
            include: [
                'userPointer',
                'conversationPointer'
            ]
        });

        query.find( {
            success: function( messages ) {

                deferred.resolve( messages );

            },
            error: function( messages, error ) {

                CLOSE.log( error );
                deferred.reject( error );

            }

        });

        return deferred;


    };


    /**
     *
     * @param toUserId
     * @param toUserIdClean
     * @param messageText
     * @returns {$.Deferred}
     */
    _.addMessage = function( toUserId, toUserIdClean, messageText ) {

        var deferred = new $.Deferred();

        CLOSE.messages.checkConversation( toUserIdClean )
            .done(function( conversation ) {

                addMessage( conversation, messageText );

            })
            .fail(function() {

                CLOSE.messages.createConversation( toUserId, toUserIdClean ).done(function( conversation ) {

                    addMessage( conversation, messageText );

                });

            }
        );

        //TODO maybe move this into it's own fuction
        function addMessage( conversation, messageText ) {

            var conversationId = conversation[0].id;

            if ( !messageText ) {
                messageText = 'This is some sample placeholder text if I am not passing it in.'
            }

            var message = CLOSE.parse.createObject({
                objectName: 'Messages',
                fields: {
                    text: messageText
                },
                pointers: [
                    {
                        objectName : 'Conversations',
                        objectId : conversationId,
                        name: 'conversationPointer'
                    },
                    {
                        objectName: 'UserClean',
                        objectId: CLOSE.user.currentUser().attributes.cleanId,
                        name: 'userPointer'
                    }

                ]

            });

            var ACL = CLOSE.parse.createACL({
                publicReadAccess: false,
                publicWriteAccess: false,
                writeUsers:[
                    CLOSE.user.currentUser().id
                ],
                readUsers:[
                    toUserId,
                    CLOSE.user.currentUser().id
                ]
            });

            message.setACL( ACL );

            message.save( null, {
                success: function( savedMessage ) {

                    deferred.resolve( savedMessage );

                },
                error: function( error ) {

                    deferred.reject( error );

                }
            });

        }

        return deferred;

    };

    /**
     *
     * @param userId
     * @param cleanUserId
     * @returns {$.Deferred}
     */
    _.createConversation = function( userId, cleanUserId ) {

        var deferred = new $.Deferred();

        // TODO: need to check if it exists first

        var ownUserId = CLOSE.user.currentUser().id,
            ownCleanUserId = CLOSE.user.currentUser().attributes.cleanId;

        var inbox = CLOSE.parse.createObject({
            objectName : 'Conversations',
            pointers : [
                {
                    objectName : 'UserClean',
                    objectId : [ cleanUserId, ownCleanUserId ],
                    name: 'users'
                }
            ]
        });

        var ACL = CLOSE.parse.createACL({
            publicReadAccess: false,
            publicWriteAccess: false,
            readUsers:[
                userId,
                ownUserId
            ]
        });

        inbox.setACL( ACL );

        inbox.save( null, {
            success: function( conversation ) {

                deferred.resolve( conversation );

            },
            error: function( conversation, error ) {

            }

        });

        return deferred;

    };

    // TODO: I renamed from queryInbox to queryConversations
    /**
     *
     * @returns {$.Deferred}
     */
    _.queryConversations = function() {

        var deferred = new $.Deferred();

        var conversationQuery = CLOSE.parse.createQuery({
            objectName : 'Conversations',
            descending: true,
            include: [
                'users',
                'userPointers'
            ]
        });

        conversationQuery.find({
            success:function( inbox ) {

                CLOSE.log( inbox );

                var data = CLOSE.util.normalizeResults( inbox );

                deferred.resolve( data );

            },
            error:function( error ) {

                deferred.reject( error );

            }
        });

        return deferred;

    };

    /**
     *
     * @param toUserIdClean is the clean ID of the recipient
     * @returns {$.Deferred} to pass conversation object to done method
     */
    _.checkConversation = function( toUserIdClean ) {

        var deferred = new $.Deferred();

        // we need to create 2 user objects to query the conversations
        // TODO: can we combine the ID and create into one line?
        var toUser = CLOSE.parse.createObject({ objectName: 'UserClean' });
        var currentUser = CLOSE.parse.createObject({ objectName: 'UserClean' });

        // set the ID's.. figure out if we can do the to do above
        toUser.id = toUserIdClean;
        currentUser.id = CLOSE.user.currentUser().attributes.cleanId;

        // create the conversation object to query conversations
        var conversationQuery = CLOSE.parse.createQuery({
            objectName: 'Conversations',
            containsAll: {
                users: [ toUser, currentUser ]
            }
        });

        // query it
        conversationQuery.find({
            success: function( conversation ) {

                // if we get a success, we need to check if it has a length
                if ( conversation.length ) {
                    CLOSE.log('it exists');
                    CLOSE.log( conversation );
                    deferred.resolve( conversation );
                }

                // otherwise we got success but it's an empty success
                else{
                    CLOSE.log('it doesnt exist');
                    deferred.reject( 'empty' );
                }

            },
            error: function( conversation, error ) {

                // some other error
                CLOSE.log('we errored before we could request');
                deferred.reject( error );

            }
        });

        return deferred;

    };


    return _;

} ( jQuery ) );