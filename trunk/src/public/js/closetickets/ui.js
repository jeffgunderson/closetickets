CLOSE.ui = ( function( $ ) {

    var _ = {};

    _.createUser = function( thisData ) {

        event.preventDefault();

        var $form = $( thisData );

        var fields = CLOSE.data.formToArray( $form );

        console.log( fields );

        CLOSE.parse.createNewUser( fields );

    };

    _.initLogin = function() {

        $('form[action="login"]').on('submit',function( event ) {

            event.preventDefault();

            var $form = $( this );

            var fields = CLOSE.data.formToArray( $form );

            CLOSE.parse.loginUser( fields ).done(function() {

                // TODO: make /home the homepage maybe??
                if ( window.location.pathname == '/') {
                    console.log('at homepage');
                    window.location = '/home';
                }

                CLOSE.ui.initUser();

            });

        });



    }


    _.createFbUser = function() {

        CLOSE.parse.createNewFbUser().done(function() {
            console.log('created');
        });

    };


    /**
     * Query Listings function
     * @query object is required
     * query help: https://parse.com/docs/js_guide#queries-basic
     */
    _.loadListings = function( thisData, options ) {

        var query = CLOSE.data.createListingQuery( thisData );

        CLOSE.parse.queryListings( query ).done(function( listings ) {

            CLOSE.data.getTemplate( 'sidebar-listing' ).done( function( template ) {

                // add some needed location info
                var newListings = CLOSE.data.locationUtil( listings );

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

    _.createListing = function( thisData, options ) {

        event.preventDefault();

        var fields = CLOSE.data.formToArray( $(thisData ) );

        CLOSE.parse.createListing( fields ).done(function( listing ) {

            console.log( 'created listing' );
            console.log( listing );

        });

    };


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

    _.initSidebar = function() {

        var $body = $('body');
        // first need to create the empty div that is needed
        $body.append('<a data-toggle="sidebar" id="page-cover" style="display:none"></a>');

        $('a[data-toggle="sidebar"]').on('click', function() {

            var activeClass = 'active',
                sidebarWidth = 300,
                $cover = $('#page-cover');

            $body.css({ position: 'relative' });

            if ( !$body.hasClass(activeClass) ) {

                $cover.show().css({
                    display: 'block',
                    position: 'fixed',
                    zIndex: '120',
                    left: sidebarWidth + 'px',
                    top:0,
                    right:0,
                    bottom:0
                });

                $body.animate({
                    left: sidebarWidth
                }, 100 );

                $body.addClass(activeClass);

            }

            else{

                $cover.hide();

                $body.animate({
                    left: 0
                }, 100 );

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