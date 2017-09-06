(function($){
	// A collection of elements to which the swipe event is bound.
	var elem_list = $([]),
	// Initialize the initial touch position.
	startX;
	// Swipe speed threshold, defaults to 50
	$.swipeThreshold = 50;

	// Special event definition. Handles Swipeleft and Swiperight
	$.event.special.swipe = {
		setup: function(data){
			// Add this element to the internal collection.
			elem_list = elem_list.add(this);
			// Bind touch handlers to this element 
			$(this).data('swipe',{threshold:data});
			$(this).bind('touchmove', $.event.special.swipe.swipe_handler);
			$(this).bind('touchstart', $.event.special.swipe.update_start);
		},

		teardown: function(){
			// Remove this element from the internal collection.
			elem_list = elem_list.not(this);
			// Unbind touch handlers from this element 
			$(this).unbind('touchmove', $.event.special.swipe.swipe_handler);
			$(this).unbind('touchstart', $.event.special.swipe.update_start);
		},

		swipe_handler: function(event){
			var elem = $(event.target);
			//Get data for current element
			var options = $(elem).data('swipe');
			//Use provided threshold if available or else use default threshold
			var threshold;
			if(options)
				threshold = options.threshold;
			else
				threshold = $.swipeThreshold;
			if(startX != event.originalEvent.touches[0].pageX&&(startX - event.originalEvent.touches[0].pageX > threshold||-(startX - event.originalEvent.touches[0].pageX) > threshold))
			{
				event.preventDefault();
				elem.trigger('swipe');
			}
			if (startX > event.originalEvent.touches[0].pageX&&(startX - event.originalEvent.touches[0].pageX > threshold||-(startX - event.originalEvent.touches[0].pageX) > threshold)) 
			{
				event.preventDefault();
				elem.trigger('swipeLeft');
			}
			else if(startX < event.originalEvent.touches[0].pageX&&(startX - event.originalEvent.touches[0].pageX > threshold||-(startX - event.originalEvent.touches[0].pageX) > threshold))
			{
				event.preventDefault();
				elem.trigger('swipeRight');
			}
		},

		update_start: function(event){
			startX = event.originalEvent.touches[0].pageX;
		}
	};
	
	$.each({
		swipeLeft: "swipe",
		swipeRight: "swipe"
	}, function(event, sourceEvent) {

		$.event.special[ event ] = {
			setup: function() {
				$(this).bind(sourceEvent, $.noop);
			},
			teardown: function() {
				$(this).unbind(sourceEvent);
			}
		};
	});

})(jQuery);