CLOSE.ui = ( function( $ ) {

    var _ = {};

    _.createUser = function( thisData ) {

        event.preventDefault();

        var $form = $( thisData );

        var fields = CLOSE.data.formToArray( $form );

        console.log( fields );

        CLOSE.parse.createNewUser( fields );

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