CLOSE.parse = CLOSE.parse || ( function( $ ) {

    var _ = {};


    /**
     * builds query object
     *
     */
    _.createQuery = function( params ) {

        if ( params.objectName ) {

            var Object = Parse.Object.extend( params.objectName );
            var query = new Parse.Query( Object );

            if ( params.descending ) {
                query.descending('updatedAt');
            }

            for ( var key in params.equalTo ) {
                if ( params.equalTo.hasOwnProperty( key ) ) {
                    query.equalTo( key, params.equalTo[key] );
                }
            }

            for ( var key in params.containsAll ) {
                if ( params.containsAll.hasOwnProperty( key ) ) {
                    query.containsAll( key, params.containsAll[key] );
                }
            }

            if ( params.include ) {
                for ( i = 0; i < params.include.length; i++ ) {
                    query.include( params.include[i] );
                }
            }


        }

        return query;

    };


    _.createObject = function( params ) {

        if ( params.objectName ) {

            var Object = Parse.Object.extend( params.objectName ),
                object = new Object();

            for ( var key in params.fields ) {

                if ( params.fields.hasOwnProperty( key ) ) {
                    object.set( key, params.fields[key] );
                }

            }

            if ( params.pointers ) {

                var pointers = params.pointers;

                for ( i = 0; i < pointers.length; i++ ) {

                    var PointerObject = Parse.Object.extend( pointers[i].objectName );

                    if ( pointers[i].objectId instanceof Array ) {

                        var pointerArray = [];

                        for ( j = 0; j < pointers[i].objectId.length; j++ ) {

                            var pointerObject = new PointerObject();
                            pointerObject.id = pointers[i].objectId[j];
                            pointerArray.push( pointerObject );

                        }

                        object.set( pointers[i].name, pointerArray );

                    }

                    else{

                        var pointerObject = new PointerObject();
                        pointerObject.id = pointers[i].objectId;
                        object.set( pointers[i].name, pointerObject );

                    }

                }

            }
        }

        return object;

    };

    _.createACL = function( params ) {

        var acl = new Parse.ACL();

        acl.setPublicReadAccess( params.publicReadAccess );
        acl.setPublicWriteAccess( params.publicWriteAccess );

        if ( params.writeUsers ) {
            for ( i = 0; i < params.writeUsers.length; i++ ) {
                acl.setWriteAccess( params.writeUsers[i], true );
            }
        }

        if ( params.readUsers ) {
            for ( i = 0; i < params.readUsers.length; i++ ) {
                acl.setReadAccess( params.readUsers[i], true );
            }
        }

        return acl;

    };


    return _;

} ( jQuery ) );