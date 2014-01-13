
/**
 * Module dependencies.
 */
var express = require('express');
var http = require('http');
var path = require('path');
var routes = require('./routes');
var hogan = require('hogan-express');

// start the app
var app = express();





// Set View Engine
app.engine( 'html', hogan );

// By default, Express will use a generic HTML wrapper (a layout) to render all your pages. If you don't need that, turn it off.
app.set( 'view options', { layout: true } );

// Set the layout page. Layout page needs {{{ yield }}}  where page content will be injected
app.set( 'layout', 'layouts/main_layout' );

// enable view cache
app.enable( 'view cache' );

// all environments
app.set( 'port', process.env.PORT || 3000);
app.set( 'views', __dirname + '/views');
app.set( 'view engine', 'html');
//app.use( express.favicon() );
app.use( express.logger('dev') );
app.use( express.bodyParser() );
app.use( express.methodOverride() );
app.use( app.router );
// app.use(require('less-middleware')({ src: __dirname + '/public' }));
app.use( express.static(path.join(__dirname, 'public')) );

// development only
if ( 'development' == app.get('env') ) {
    app.use(express.errorHandler());
}

// Route the URL's

/** general pages **/
app.get( '/', routes.homepage );
app.get( '/home', routes.home );

/** for FB **/
app.get( '/fb-channel', routes.fbChannel );


// Finally create the server listing to the environment port
// Set to 3000 for now
http.createServer(app).listen(app.get('port'), function(){
    console.log('Express server listening on port ' + app.get('port'));
});