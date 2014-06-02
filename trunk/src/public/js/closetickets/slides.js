/**
 * offCanvas menu plugin
 * let's you add, remove, and go to slides.
 * Using deferred so each has a done method
 * Most return the jQuery object in the done method
 * @returns {{}}
 */
CLOSE.slides = ( function( $ ) {

    var _ = {};

    // TODO get rid of these but turn class names into variables
    // Need to update DOM elements too much to initiate here
    var $slider = $('.side-menu-wrapper'),
        $slides = $('.side-menu-item'),
        slideCount = $slides.length,
        slideWidth = $slides.width(),
        speed = 200;

    _.slidePosition = function() {

        var position = $('.side-menu-wrapper').attr('data-position');

        if ( !position ) {
            position = 'cannot be found';
        }

        return position;

    };


    _.init = function() {

        // starting in 0 position
        var position = 0;

        $slider.attr('data-position', position )
            .attr('data-count', slideCount )
            .width( slideCount * slideWidth );

        $('body' ).on('click','[data-action="removeSlide"]', function() {
            CLOSE.slides.removeSlide();
        });

    };


    _.goToSlide = function( slide ) {

        var $slider = $('.side-menu-wrapper'),
            $slides = $('.side-menu-item'),
            slideWidth = $slides.width();

        $slider.animate({
            marginLeft: - ( slide - 1 ) * slideWidth + 'px'
        }, speed );

        $slider.attr('data-position', slide );

    };

    _.addSlide = function() {

        // TODO: body-wrapper should be passed in or made into a more global variable within function
        if ( !$('.body-wrapper' ).hasClass('active-sidebar') ) {
            $('[data-toggle="sidebar"]' ).first().click();
        }

        var $slider = $('.side-menu-wrapper'),
            $slides = $('.side-menu-item'),
            slideCount = $slides.length,
            slideWidth = $slides.width();

        var deferred = $.Deferred();

        slideCount++;

        $slider.append( '<div class="side-menu-item" />' )
            .attr('data-count', slideCount )
            .width( slideCount * slideWidth );

        var $slide = $('.side-menu-item').last();

        console.log( $slide );

        $slide.html('<div class="loading-graphic"><i class="icon-cw rotate"></i> Loading...</div>');

        console.log( slideCount );

        CLOSE.slides.goToSlide( slideCount );

        deferred.resolve( $slide );

        return deferred;

    };

    _.removeSlide = function() {

        var $slider = $('.side-menu-wrapper'),
            $slides = $('.side-menu-item'),
            slideCount = $slides.length,
            slideWidth = $slides.width();

        var deferred = $.Deferred();

        slideCount--;

        $slides.eq( -1 ).remove();

        $slider.attr('data-position', $slider.data.position-- )
            .attr('data-count', slideCount )
            .width( slideCount * slideWidth );

        CLOSE.slides.goToSlide( slideCount );

        deferred.resolve( $slides.eq( -2 ) );

        return deferred;

    };

    return _;

} ( jQuery ) );