/*jshint browser:true, curly:true, eqeqeq:false, forin:true, strict:false, undef:true*/ 
/*global jQuery:false, $:false*/
;(function ($) {
    var pluginName = 'simpleswipe';
    var defaults =  {
        longSwipeMin : 130
    };

    function Plugin ( element, options ) {
        this.element = element;
        this.settings = $.extend( {}, defaults, options );
        this._defaults = defaults;
        this._name = pluginName;

        this.touchStartX = 0;
        this.touchEndX = 0;
        this.mouseStartX = 0;
        this.mouseEndX = 0;
        this.isMoving = false;
        this.isIePointerMoving = false;
        this.isMouseMoving = false;

        this.init();
    }

    Plugin.prototype = {
        init: function () {
            this.createSwipeEvents();
        },
        createSwipeEvents: function () {
            var oCfg = this;
            var elm = oCfg.element;

            if('ontouchstart' in window){
                elm.addEventListener('touchstart', function(event) {
                    oCfg.touchStartX = event.touches[0].pageX;
                }, false);

                elm.addEventListener('touchmove',function(event) {
                    oCfg.touchEndX = event.touches[0].pageX;
                    oCfg.isMoving = true;
                },false);

                elm.addEventListener('touchend', function() {
                    oCfg.isMoving = false;
                    $(elm).trigger(oCfg.getSwipeDirection('touch'));
                }, false);
            }

            /*TODO IE*/
            // if (window.navigator.msPointerEnabled) {
                // elm.addEventListener('MSPointerDown', function(event) {
                //     console.log('a')
                //     oCfg.mouseStartX = event.clientX;
                // }, false);
                // elm.addEventListener('MSPointerMove', function(event) {
                //     oCfg.isIePointerMoving = true;
                //     oCfg.mouseEndX = event.clientX;
                // }, false);
                // elm.addEventListener('MSPointerUp', function(event) {
                //     oCfg.isIePointerMoving = false;
                //     $(elm).trigger(oCfg.getSwipeDirection('mouse'));
                // }, false);
            // }

            elm.addEventListener('mousedown', function(event) {
                oCfg.mouseStartX = event.clientX;
            }, false);
            elm.addEventListener('mousemove', function(event) {
                oCfg.isMouseMoving = true;
                oCfg.mouseEndX = event.clientX;
            }, false);
            elm.addEventListener('mouseup', function(event) {
                oCfg.isMouseMoving = false;
                $(elm).trigger(oCfg.getSwipeDirection('mouse'));
            }, false);

        },
        getSwipeDirection: function (sSwipeType) {
            if(!sSwipeType) { return; }
            
            var oCfg = this;
            var orientation, nDifference;
            
            var nStartX = (sSwipeType == 'touch') ? oCfg.touchStartX : oCfg.mouseStartX;
            var nEndX = (sSwipeType == 'touch') ? oCfg.touchEndX : oCfg.mouseEndX;

            if(nStartX && nEndX){
                nDifference = nEndX - nStartX;
                if(nEndX > nStartX){ //right
                    orientation = (nDifference < oCfg.settings.longSwipeMin) ? 'swiperight': 'swipelongright';
                }else{ //left
                    orientation = (nDifference > (-oCfg.settings.longSwipeMin)) ? 'swipeleft': 'swipelongleft';
                }
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
// difficile de voir un rapport entre un click et des swipes >> OK
// ne faudrait-il pas plutôt supporter la même gestuelle avec la souris ?*/
