// TODO: Probably DELETE this file

CLOSE.ui = ( function( $ ) {

    var _ = {};

    _.createUser = function( thisData ) {

        event.preventDefault();

        var data = $( thisData ).serialize();

        CLOSE.log( data );

//        $.ajax({
//            url: '/user/create',
//            data: $( thisData ).serialize(),
//            type: 'POST'
//        }).done(function( data ) {
//                console.log('returning...');
//                console.log( data );
//            })

    }

    return _;

} ( jQuery ) );