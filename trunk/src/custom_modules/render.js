var commonPartialsHomepage = {
    'header': 'common/header-home',
    'footer': 'common/footer',
    'tracking':'common/tracking',
    'modals' : 'common/modals',
    'side-menu' : 'common/side-menu'
}
var commonPartials = {
    'header': 'common/header',
    'footer': 'common/footer',
    'tracking':'common/tracking',
    'modals' : 'common/modals',
    'side-menu' : 'common/side-menu'
}

/*
 *
 * Render the homepage
 *
 */
exports.renderHomepage = function( res ) {

    console.log( 'Starting to render the homepage');

    res.render('homepage',
        {
            // TODO: will be 'data: data' once service request is plumbed in
            data: {
                title: 'Close Tickets',
                description: 'This is the page description'
            },
            partials: commonPartialsHomepage
        }
    );

};


/*
 *
 * Render the home screen
 *
 */
exports.renderHome = function( res ) {

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






exports.renderFbChannel = function( res ) {

    //TODO: Get this working

    var cacheExpire = 60*60*24*365;

    res.header('Pragma','public');
    res.header('Cache-Control','max-age=' + cacheExpire );
    res.header('Expires', new Date + cacheExpire );
//    res.end('<script src="//connect.facebook.net/en_US/all.js"></script>');

}
