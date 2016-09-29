/*jshint browser:true, curly:true, eqeqeq:false, forin:true, strict:false, undef:true*/ 
/*global jQuery:false, $:false*/

var createConsoleLog = function() {
    var iDiv = document.createElement('div');
    iDiv.id = 'console';
    document.getElementsByTagName('body')[0].appendChild(iDiv);
};
var consolelog = function(sMsg) {
    console.log(sMsg);
    var consoleElm = document.getElementById('console');
    consoleElm.innerHTML =  sMsg + '<br>' + consoleElm.innerHTML;
};
createConsoleLog();

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
        this.touchStartY = 0;
        this.touchEndY = 0;
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

            /*Handle Touch Events*/
            if('ontouchstart' in window){
                elm.addEventListener('touchstart', function(event) {
                    oCfg.touchStartX = event.touches[0].pageX;
                    oCfg.touchStartY = event.touches[0].pageY;
                }, false);

                elm.addEventListener('touchmove',function(event) {
                    event.preventDefault();
                    oCfg.touchEndX = event.touches[0].pageX;
                    oCfg.touchEndY = event.touches[0].pageY;
                    oCfg.isMoving = true;
                },false);

                elm.addEventListener('touchend', function() {
                    oCfg.isMoving = false;
                    $(elm).trigger(oCfg.getSwipeDirection('touch'));
                }, false);
                elm.addEventListener('touchcancel', function() {
                    oCfg.isMoving = false;
                    $(elm).trigger(oCfg.getSwipeDirection('touch'));
                }, false);
            }

            /*Handle Mouse Events*/
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
            var orientation, nDifference, nDifferenceY;
            
            var nStartX = (sSwipeType == 'touch') ? oCfg.touchStartX : oCfg.mouseStartX;
            var nEndX = (sSwipeType == 'touch') ? oCfg.touchEndX : oCfg.mouseEndX;

            /*test if touch need to be a scroll?*/
            nDifferenceY = oCfg.touchEndY - oCfg.touchStartY;

            if(nDifferenceY > 100 || nDifferenceY < -100) {
                //USER IS SCROLLING > do not swipe
                // window.scrollBy(0, -nDifferenceY);
                var nCountInterval = 25;
                var nCountPixelInterval = nDifferenceY/nCountInterval;
                var nCountDelay = 800/nCountInterval;
                consolelog('A')
                //is setInterval asynchronous??
                var oIntervalScroll = setInterval(function() {
                    consolelog('B')
                    nCountInterval--;
                    if(nCountInterval === 0){
                        clearInterval(oIntervalScroll);
                        return;
                    }
                    window.scrollBy(0, -nCountPixelInterval);
                }, nCountDelay);
                consolelog('F')
            } else {
                //USER IS NOT SCROLLING > Swipe
                nDifference = nEndX - nStartX;
                if(nEndX > nStartX){ //right
                    orientation = (nDifference < oCfg.settings.longSwipeMin) ? 'swiperight': 'swipelongright';
                }else{ //left
                    orientation = (nDifference > (-oCfg.settings.longSwipeMin)) ? 'swipeleft': 'swipelongleft';
                }
            }
            consolelog(orientation)
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
