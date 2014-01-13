var http = require('http');
var request = require('request');
var render = require('../custom_modules/render.js');

/*
 * GET home page.
 */
exports.homepage = function (req, res) {

    // ( res, body ) - Body is data from request response data
    render.renderHomepage( res, null );

};



exports.home = function( req, res ) {

    render.renderHome( res, null );

}





exports.fbChannel = function( res ) {

    render.renderFbChannel( res );

}