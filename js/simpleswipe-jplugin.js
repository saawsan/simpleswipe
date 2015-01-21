/*jshint browser:true, curly:true, eqeqeq:false, forin:true, strict:false, undef:true*/ 
/*global jQuery:false, $:false*/
;(function ( $, window, document, undefined ) {

    var pluginName = "simpleswipe";// guillemets simples pour être cohérent
    var defaults =  {
            largeSwipe : 130
        };// attention à l'indentation
    var hasOnOrientationChange = 'onorientationchange' in window;

    function Plugin ( element, options ) {
        this.element = element;
        this.settings = $.extend( {}, defaults, options );
        this._defaults = defaults;
        this._name = pluginName;

        this.touchStartX = 0;
        this.touchEndX = 0;
        this.isMoving = 0;

        this.init();
    }

    Plugin.prototype = {
        init: function () {
            this.createSwipeEvents();
        },
        createSwipeEvents: function () {
            var oCfg = this;
            var elm = oCfg.element;
            var sCallback = oCfg.callBack;

            // pourquoi faire passer un callback alors que l'on peut envoyer
            // des événements personnalisés ? par exemple :
            // $(elm).trigger('swipeleft')
            // touchstart : support IE (cf pointer events)
            // renommer largeSwipe en longSwipeMin par exemple (mq de cohérence)

            elm.addEventListener('touchstart', function(event) {
                oCfg.touchStartX = event.touches[0].pageX;
            }, false);

            elm.addEventListener('touchmove',function(event) {
                oCfg.touchEndX = event.touches[0].pageX;
                oCfg.isMoving = true;
            },false);

            elm.addEventListener('touchend', function() {
                oCfg.settings.callback(this, oCfg.getSwipeType());
            }, false);
            
            if(!hasOnOrientationChange){ //for desktop
                // difficile de voir un rapport entre un click et des swipes
                // ne faudrait-il pas plutôt supporter la même gestuelle avec la souris ?
                elm.addEventListener('click', function() {
                    oCfg.settings.callback(this, oCfg.getSwipeType());
                }, false);
            }

        },
        getSwipeType: function () {
            var oCfg = this;
            var orientation, nDifference;
            if(oCfg.touchEndX && oCfg.touchStartX && oCfg.isMoving){
                nDifference = oCfg.touchEndX - oCfg.touchStartX;
                if(oCfg.touchEndX > oCfg.touchStartX){ //right
                    orientation = (nDifference < oCfg.settings.largeSwipe) ? 'right': 'longright';
                }else{ //left
                    orientation = (nDifference > (-oCfg.settings.largeSwipe)) ? 'left': 'longleft';
                }
                oCfg.isMoving = false;
            }else{
                orientation = 'click';
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
})( jQuery, window, document );

