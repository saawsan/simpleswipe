/*jshint browser:true, curly:true, eqeqeq:false, forin:true, strict:false, undef:true*/ 
/*global jQuery:false, $:false*/
;(function ($) {
    var pluginName = 'simpleswipe';
    var defaults =  {
        longSwipeMin : 130
    };
    // var hasOnOrientationChange = 'onorientationchange' in window;
    var hasOnTouchStart = 'ontouchstart' in window;

    function Plugin ( element, options ) {
        this.element = element;
        this.settings = $.extend( {}, defaults, options );
        this._defaults = defaults;
        this._name = pluginName;

        this.touchStartX = 0;
        this.touchEndX = 0;
        this.isMoving = false;

        this.init();
    }

    Plugin.prototype = {
        init: function () {
            this.createSwipeEvents();
        },
        createSwipeEvents: function () {
            var oCfg = this;
            var elm = oCfg.element;


           if(!hasOnTouchStart){ //for desktop
                elm.addEventListener('click', function() {
                    $(elm).trigger(oCfg.getSwipeType());
                    // oCfg.settings.callback(this, oCfg.getSwipeType());
                }, false);
            } else {
                elm.addEventListener('touchstart', function(event) {
                    oCfg.touchStartX = event.touches[0].pageX;
                }, false);

                elm.addEventListener('touchmove',function(event) {
                    oCfg.touchEndX = event.touches[0].pageX;
                    oCfg.isMoving = true;
                },false);

                elm.addEventListener('touchend', function() {
                    $(elm).trigger(oCfg.getSwipeType());
                    // oCfg.settings.callback(this, oCfg.getSwipeType());
                }, false);
            }

        },
        getSwipeType: function () {
            var oCfg = this;
            var orientation, nDifference;
            if(oCfg.touchEndX && oCfg.touchStartX && oCfg.isMoving){
                nDifference = oCfg.touchEndX - oCfg.touchStartX;
                if(oCfg.touchEndX > oCfg.touchStartX){ //right
                    orientation = (nDifference < oCfg.settings.longSwipeMin) ? 'swiperight': 'swipelongright';
                }else{ //left
                    orientation = (nDifference > (-oCfg.settings.longSwipeMin)) ? 'swipeleft': 'swipelongleft';
                }
                oCfg.isMoving = false;
            }else{
                orientation = 'swipeclick';
            }
            return orientation;
        }
    };

    $.fn[ pluginName ] = function ( options ) {
        this.each(function() {
            if ( !$.data( this, "plugin_" + pluginName ) ) {
                $.data( this, "plugin_" + pluginName, new Plugin( this, options ) );
            }
        });

        return this;
    };
})( jQuery );


/* Note Manu C
// pourquoi faire passer un callback alors que l'on peut envoyer
// des événements personnalisés ? par exemple :
// $(elm).trigger('swipeleft') >> ok
// touchstart : support IE (cf pointer events)
// difficile de voir un rapport entre un click et des swipes
// ne faudrait-il pas plutôt supporter la même gestuelle avec la souris ?*/
