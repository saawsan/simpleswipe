# simpleswipe
SimpleSwipe is a JS plugin that handle basic swipe events.

##What simpleswipe does:
Listen the "swipe" event and indicate if it is a "right", "longright", "left" or "longleft" movement. 
Non multi-touch screens are currently not supported and send a "click" event.

##Require:
- jQuery

##Use:
```javascript
$('.simpleswipe').simpleswipe({
	longSwipeMin : 250
});

$('.simpleswipe').on('swipeleft', function(){
	$(this).find('p').append(' swipeleft');
});
```