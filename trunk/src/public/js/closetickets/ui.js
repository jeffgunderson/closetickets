CLOSE.ui = ( function( $ ) {

    var _ = {};

    /**
     * Creating a user from form fields
     * @thisData object is required (from a form submit)
     * TODO: bind the form submit in here instead
     */
    _.createUser = function( thisData ) {

        event.preventDefault();

        var $form = $( thisData ),
            fields = CLOSE.util.formToArray( $form );

        console.log( 'fields:');
        console.log( fields );

        CLOSE.user.createNewUser( fields )
            .done( function( user ) {
                //TODO: do something
//                window.location = '/home'

                CLOSE.parse.loginUser( fields )
                    .done(function() {

                        // TODO: make /home the homepage maybe??
                        if ( window.location.pathname == '/') {
                            console.log('at homepage');
                            window.location = '/home';
                        }

                        $('#signupModal').modal('hide');

                        CLOSE.ui.initUser();

                })

            })
            .fail( function( user, error ) {
                //TODO: do something with the error
            });

    };


    /**
     * UI side of creating an FB user.. still need to finish data part
     * TODO: do something after creating the user
     * TODO: make it on a form submit, button click, etc
     */
    _.createFbUser = function() {

        CLOSE.parse.createNewFbUser()
            .done(function() {
                console.log('created');
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

            CLOSE.user.loginUser( fields )
                .done(function() {

                    // TODO: make /home the homepage maybe??
                    if ( window.location.pathname == '/') {
                        console.log('at homepage');
                        window.location = '/home';
                    }

                    $('#loginModal').modal('hide');

                    CLOSE.ui.initUser();

            });

        });



    };


    /**
     *
     * loads the map and binds the search events
     */
    _.initMapPage = function() {

        // if we even need to load the map
        if ( $('#gmap').length ) {

            // get the location first
            CLOSE.getLocation()
                .done(function( coords ) {

                    CLOSE.map.initMap({
                        divId: '#gmap',
                        currentLocation: coords
                    });

                    CLOSE.ui.initListingFiltering({
                        searchFormId: '#ticket-search',
                        clearDivId: '#clear-filter',
                        sidebarDivId: '#sidebar-listing'
                    });

                    CLOSE.ui.initListingCreator();

                });
        }

    };




    /**
     * Query Listings function
     * @query object is required
     */
    _.loadListings = function( thisData, options ) {

        var query = CLOSE.tickets.createListingQuery( thisData );

        CLOSE.tickets.queryTickets( query ).done(function( listings ) {

            CLOSE.util.getTemplate( 'sidebar-listing' ).done( function( template ) {

                CLOSE.log( listings );

                // add some needed location info ( miles away, etc )
                var newListings = CLOSE.util.locationUtil( listings );

                var html = CLOSE.util.mergeMustacheData( template, newListings );

                $( options.divId ).html( html );

                // init the map pins if needed
                if ( options.map ) {

                    CLOSE.map.initPins( listings );

                }

            })



        });

        return false;

    };


    _.initListingFiltering = function( params ) {

        $( params.searchFormId ).on( 'submit', function( e ) {

            e.preventDefault();

            CLOSE.ui.loadListings( this, {
                divId: params.sidebarDivId,
                map: true
            } );

        }).submit();

        $( params.clearDivId ).on( 'click', function() {

            $(this).parent().find('input').val('');

            CLOSE.ui.loadListings( null, {
                divId: params.sidebarDivId,
                map: true
            });

        });

    }


    /**
     *
     * Sends the form data to create a listing with parse and returns the object so we can do some UI stuff
     */
    _.initListingCreator = function() {

        $('.create-listing-form').on( 'submit', function(e) {

            event.preventDefault();

            var $this = $(this);

            $('#drop-pin').hide();
            $('#confirm-position').show();

            CLOSE.map.dropPinAndPosition().done(function( location ) {

                var fields = CLOSE.util.formToArray( $this );

                // set the location in the fields
                fields.location = {};
                fields.location.latitude = location.k;
                fields.location.longitude = location.A;

                // go ahead and create the lising after we are passed the done handler
                CLOSE.tickets.createTicket( fields ).done(function( listing ) {

                    // reload the page
                    // TODO: update UI without reloading
                    window.location = '/home';

                });

            });

        });

    };


    /**
     * Just a simple function to show whether a user is logged in or not
     */
    _.initUser = function() {

        var user = CLOSE.user.currentUser();

        if ( user ) {

            // change some UI stuff
            $('.not-logged-in').hide();
            $('.logged-in').show();
            $('.logged-in.username').html( user.attributes.name );

            // add event handlers for logging out
            $('.log-out').on( 'click', function() {

                CLOSE.user.logout().done( function( message ) {
                    console.log( message );
//                    CLOSE.ui.initUser();
                    window.location = '/'
                });

            });

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

        var $bodyWrapper = $('.body-wrapper');

        // first need to create the empty div that is needed to cover the other half of the screen
        // only do this once so we don't have duplicates so check to see if it exists first
        if ( !$('#page-cover').length ) {
            $bodyWrapper.append('<a data-toggle="sidebar" id="page-cover" style="display:none"></a>');
        }

        // make sure body wrapper has a min height of the window
        $bodyWrapper.css({
            minHeight: $(window).height()
        });

        // and during resize
        $(window).resize(function() {
            $bodyWrapper.css({
                minHeight: $(window).height()
            });
        });

        CLOSE.slides.init();

        $('a[data-action="messaging"]').on( 'click', function() {
            CLOSE.ui.initMessaging();
        });

        $('a[data-action="ticketmanager"]' ).on( 'click', function() {
            CLOSE.ui.initTicketManager();
        });

        // bind the click events
        $('a[data-toggle="sidebar"]').on( 'click', function() {
            toggleSidebar();
        });

        // this should be done some other way
        if ( CLOSE.user.currentUser() ) {

            $('.logged-in.avatar' ).attr('src', CLOSE.user.currentUser().attributes.profileImage );
            $('.logged-in.username' ).html( CLOSE.user.currentUser().attributes.name );

        }


        var toggleSidebar = function() {

            var activeClass = 'active-sidebar',
                sidebarWidth = 300,
                $cover = $('#page-cover');

            // set some CSS on the body so it can be moved
            $bodyWrapper.css({ position: 'relative' });

            // check to make sure the menu isn't already exposed
            if ( !$bodyWrapper.hasClass(activeClass) ) {


                // animate the body to expose the menu
                $bodyWrapper.animate({
                    position: 'relative',
                    left: sidebarWidth
                }, 100, function() {

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

                } );

                // add the active class so we know that it's open
                $bodyWrapper.addClass(activeClass);

                $bodyWrapper.css({
                    width:'100%',
                    overflow: 'hidden'
                });

                $('body').css({
                    position: 'fixed',
                    top:0,
                    bottom:0,
                    width: '100%',
                    overflow: 'hidden'
                });

            }

            // if it's already open we need to close it
            else{

                // hide the cover
                $cover.hide();

                // animate the body back to normal position
                $bodyWrapper.animate({
                    left: 0
                }, 100, function() {

                    // remove the active class so we know it's closed
                    $bodyWrapper.removeClass(activeClass);

                    $bodyWrapper
                        .attr('style','')
                        .css({
                            minHeight: $(window).height()
                    });

                    $('body').attr('style','');

                } );



            }


        };

        _.initMessaging = function() {

            if ( CLOSE.user.currentUser() ) {

                CLOSE.slides.addSlide().done(function( $div ) {

                    CLOSE.messages.queryConversations().done(function( conversations ) {

                        CLOSE.util.getTemplate('inbox-conversations').done(function( template ) {

                            var conversationData = CLOSE.util.prepareConversationData( conversations );

                            $div.html( CLOSE.util.mergeMustacheData( template, { results: conversationData } ) );

                            $('[data-load="messages"]').on( 'click' , function() {

                                var $thisData = $( this ).data();

                                // TODO: use data().id but I think i was having issues
                                CLOSE.ui.loadMessages( $( this ).attr('data-id'), $thisData.touserid, $thisData.touseridclean );

                            });

                        });

                    });

                });

            }

        };


        // TODO: rename to something more specific
        _.loadMessages = function( conversationId, toUserId, toUserIdClean ) {

            if ( CLOSE.user.currentUser() ) {

                CLOSE.slides.addSlide().done(function( $div ) {

                    CLOSE.messages.queryMessages( conversationId ).done(function( messages ) {

                        CLOSE.log( messages );

                        // some more massaging
                        // setting the current user in the message result
                        // TODO: move somewhere else
                        for ( i = 0; i < messages.length; i++ ) {

                            if ( messages[i].attributes.userPointer.id == CLOSE.user.currentUser().attributes.cleanId ) {

                                messages[i].attributes.currentUser = true;

                            }

                        }

                        // reversing the array so the newest message is last
                        // doing it for view purposes of having the latest message at the bottom of screen like text messaging
                        messages.reverse();

                        var templateData = {
                            results: messages,
                            conversationId: conversationId,
                            toUserId: toUserId,
                            toUserIdClean: toUserIdClean
                        };

                        CLOSE.util.getTemplate('inbox-messages').done(function( template ) {

                            $div.html( CLOSE.util.mergeMustacheData( template, templateData ) );

                            CLOSE.ui.bindAddMessage( $div, messages, templateData );
                            // ^^ hmm... not sure about this way or if anything should get passed in
//                            CLOSE.ui.bindAddMessage({
//                                div: $div,
//                                messages: messages,
//                                templateData: templateData
//                            });

                        })


                    });

                });

            }

        };


        _.bindAddMessage = function( $div, messages, templateData  ) {

            /**
             * Binding the adding message form here
             */
            $('[data-action="message"]').on('submit', function( e ) {

                e.preventDefault();
                e.stopPropagation();

                var fields = CLOSE.util.formToArray( $(this) );

                CLOSE.messages.addMessage( fields.userid, fields.useridclean, fields.message ).done(function( savedMessage ) {

                    // ugh this sucks but parse does not include pointer data after a save
                    savedMessage.attributes.userPointer.attributes.name = CLOSE.user.currentUser().attributes.name;
                    savedMessage.attributes.userPointer.attributes.profileImage = CLOSE.user.currentUser().attributes.profileImage;
                    savedMessage.attributes.currentUser = true;

                    // pushing saved message to array so we can update view but not send another API request
                    messages.push( savedMessage );

                    // mustache the data
                    CLOSE.util.getTemplate('inbox-messages').done(function( template ) {

                        $div.html( CLOSE.util.mergeMustacheData( template, templateData ) );

                    });

                });

            });

        };




    };



    _.initTicketManager = function() {

        if ( CLOSE.user.currentUser() ) {

            CLOSE.slides.addSlide().done(function( $div ) {

                //TODO: query the tickets

                CLOSE.tickets.queryUserTickets().done(function( tickets ) {

                    CLOSE.util.getTemplate('tickets-manager' ).done(function( template ) {

                        var templateData = {
                            results: tickets
                        };

                        $div.html( CLOSE.util.mergeMustacheData( template, templateData ) );

                        $( 'body' ).on( 'click', '[data-action="deleteticket"]', function() {

                            var $this = $(this ),
                                ticketId = $this.attr('data-id');

                            CLOSE.tickets.deleteTicket( ticketId ).done(function() {

                                $this.closest( 'li' ).remove();

                                if ( $('#gmap').length ) {

                                    CLOSE.map.removePin( ticketId );

                                }

                            });

                        });

                    });

                });

            });

        }

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