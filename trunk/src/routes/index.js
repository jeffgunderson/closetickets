var http = require('http');
var request = require('request');
var render = require('../custom_modules/render.js');

/*
 * GET home page.
 */
// ( res, body ) - Body is data from request response data
exports.homepage = function ( req, res ) {


    render.renderHomepage( res );

};


/*
 * GET home(map page).
 */
exports.home = function( req, res ) {

    render.renderHome( res );

};




exports.fbChannel = function( res ) {

    render.renderFbChannel( res );

};