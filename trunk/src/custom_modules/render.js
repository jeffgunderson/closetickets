var commonPartials = {
    'header': 'common/header-home',
    'footer': 'common/footer',
    'tracking':'common/tracking',
    'modals' : 'common/modals'
}

/*
 *
 * Render the homepage
 *
 */
exports.renderHomepage = function( res, data ) {

    console.log( 'Starting to render the homepage');
    console.log( data );

    res.render('homepage',
        {
            // TODO: will be 'data: data' once service request is plumbed in
            data: {
                title: 'Close Tickets',
                description: 'This is the page description'
            },
            partials: commonPartials
        }
    );

};


/*
 *
 * Render the home screen
 *
 */
exports.renderHome = function( res, data ) {

    console.log('Starting to render home');

    res.render('home',
        {
            data: {
                title: 'Close Tickets Home',
                description: 'This is the page description'
            },
            partials: commonPartials
        }
    );

};
