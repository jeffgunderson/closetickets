CLOSE.ui = ( function( $ ) {

    var _ = {};

    /**
     * Creating a user from form fields
     * @thisData object is required (from a form submit)
     */
    _.createUser = function( thisData ) {

        event.preventDefault();

        var $form = $( thisData ),
            fields = CLOSE.util.formToArray( $form );

        CLOSE.parse.createNewUser( fields )
            .done( function( user ) {
                //TODO: do something
            })
            .fail( function( user, error ) {
                //TODO: do something with the error
            });
    };

    /**
     * Inits the login bindings
     */
    _.initLogin = function() {

        $('form[action="login"]').on('submit',function( event ) {

            event.preventDefault();

            var $form = $( this ),
                fields = CLOSE.util.formToArray( $form );

            CLOSE.parse.loginUser( fields ).done(function() {

                // TODO: make /home the homepage maybe??
                if ( window.location.pathname == '/') {
                    console.log('at homepage');
                    window.location = '/home';
                }

                CLOSE.ui.initUser();

            });

        });



    };

    /**
     * UI side of creating an FB user
     * TODO: do something after creating the user
     */
    _.createFbUser = function() {

        CLOSE.parse.createNewFbUser().done(function() {
            console.log('created');
        });

    };




    /**
     * Query Listings function
     * @query object is required
     */
    _.loadListings = function( thisData, options ) {

        var query = CLOSE.parse.createListingQuery( thisData );

        CLOSE.parse.queryListings( query ).done(function( listings ) {

            CLOSE.util.getTemplate( 'sidebar-listing' ).done( function( template ) {

                // add some needed location info ( miles away, etc )
                var newListings = CLOSE.util.locationUtil( listings );

                var html = Mustache.render( template, newListings );

                $( options.divId ).html( html );

                // init the map pins if needed
                if ( options.map ) {

                    CLOSE.map.initPins( listings );

                }

            })



        });

        return false;

    };


    /**
     *
     * @param thisData is from a form submit
     * Sends the form data to create a listing with parse and returns the object so we can do some UI stuff
     */
    _.createListing = function( thisData ) {

        event.preventDefault();

        var fields = CLOSE.util.formToArray( $(thisData ) );

        CLOSE.parse.createListing( fields ).done(function( listing ) {

            // TODO: Do something here with the UI after we create a listing
            console.log( 'created listing' );
            console.log( listing );

        });

    };


    /**
     * Just a simple function to show whether a user is logged in or not
     */
    _.initUser = function() {

        var user = CLOSE.parse.currentUser();

        if ( user ) {

            $('.not-logged-in').hide();
            $('.logged-in').show();
            $('.logged-in.username').html( user.attributes.name );

        }

        else{

            $('.not-logged-in').show();
            $('.logged-in').hide();
            $('.logged-in.username').html('');
        }

    };



    /**
     * Initializes the hide/show tabs for main UI search vs create
     * options:
     * - buttonClass (related to elements that trigger tab changes)
     * - tabClass (related to the elements that change when trigger is acted on)
     */
    _.initTabs = function( options ) {

        $('.' + options.buttonClass ).on( 'click', function() {

            var $this = $(this),
                $these = $('.' + options.buttonClass ),
                targetId = $this.data('target'),
                $thisTab = $('#' + targetId ),
                $theseTabs = $('.' + options.tabClass ),
                active = 'active';

            $these.removeClass( active );
            $this.addClass( active );
            $theseTabs.hide();
            $thisTab.show();

        });

    }



    /**
     * Initializes the off canvas menu
     * TODO: rename to off canvas or something that makes more sense
     */
    _.initSidebar = function() {

        var $body = $('body');

        // first need to create the empty div that is needed to cover the other half of the screen
        // only do this once so we don't have duplicates so check to see if it exists first
        if ( !$('#page-cover').length ) {
            $body.append('<a data-toggle="sidebar" id="page-cover" style="display:none"></a>');
        }

        // TODO: move??
        var messagingFlag = false;
        $('#messagesModal').on( 'show.bs.modal', function (e) {
            if ( !messagingFlag ) {
                CLOSE.messaging.initMessaging();
                messagingFlag = true;
            }
        });

        // bind the click events
        $('a[data-toggle="sidebar"]').on( 'click', function() {

            var activeClass = 'active',
                sidebarWidth = 300,
                $cover = $('#page-cover');

            // set some CSS on the body so it can be moved
            $body.css({ position: 'relative' });

            // check to make sure the menu isn't already exposed
            if ( !$body.hasClass(activeClass) ) {

                // show the cover and add some CSS to it
                $cover.show().css({
                    display: 'block',
                    position: 'fixed',
                    zIndex: '120',
                    left: sidebarWidth + 'px',
                    top:0,
                    right:0,
                    bottom:0
                });

                // animate the body to expose the menu
                $body.animate({
                    left: sidebarWidth
                }, 100 );

                // add the active class so we know that it's open
                $body.addClass(activeClass);

            }

            // if it's already open we need to close it
            else{

                // hide the cover
                $cover.hide();

                // animate the body back to normal position
                $body.animate({
                    left: 0
                }, 100 );

                // remove the active class so we know it's closed
                $body.removeClass(activeClass);

            }

        });


    };









































    _.createHomepagePills = function( options ) {

        // create an array for the pills
        var pills = [];

        // append 200 of them
        for( var i = 1; i <= 200; i++ ){

            pills.push('<div class="' + options.pillClass + '"><div class="' + options.slitClass + '"></div></div>');

        }

        // insert all the pills into the pill wrapper
        $('.' + options.wrapperClass ).html( pills.join('') );

        // initiate the dom elements for all pills
        var $pills = $('.' + options.pillClass );

        // create some colors to chose from for the pills
        var colors = [
            '#2B3990',
            '#ffffff',
            '#BE1E2D',
            '#EC008C',
            '#6FBC0C'
        ];

        // loop over the dom elements
        $pills.each(function( i ) {

            // generate some random numbers
            var left = Math.round( Math.random() * (100 - 0) + 0 ),
                bottom = Math.round( Math.random() * (20 - (-20)) - 20 ),
                size = Math.round( Math.random() * (70-30) + 30 ),
                rotation = Math.round( Math.random() * (360 - 0) + 0 ),
                colorIndex = Math.round( Math.random() * ( colors.length - 0 ) + 0 );
            slitHeight = size - 6,
                $this = $(this);

            $this.css({
                left: left + '%',
                bottom: bottom + 'px',
                height: size + 'px',
                width: size + 'px',
                borderRadius: size/2 + 'px',
                background: colors[colorIndex]
            });

            $this.find('.pill-slit').css({
                height: slitHeight,
                width: size * .1 + 'px',
                marginLeft: size/2 - size * .05 + 'px',
                '-webkit-transform' : 'rotate('+rotation+'deg)'
            });

        });

        // animate that shiz ( CSS3 transitions )

//        $.fn.reverse = [].reverse;
//
//        $pills.reverse().each(function(i) {
//
//            var $this = $(this);
//
//            setTimeout(function(){
//
//                $this.css({ bottom: '-80px' } );
//
//            }, 30 * i );
//        });
    }


    return _;

} ( jQuery ) );