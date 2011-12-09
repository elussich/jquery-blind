(function($){

	/* PUBLIC METHODS ENCLOSED IN AN OBJECT */
	var methods = {
	
		// init method (build container and handler)
		init : function(options) {	

			var defaults = {
				blindLimit: true, // define whether the blind movement should be restrain from zero to the original height (false, for infinite height...)
				handlerText: '...', // pass an array of names (strings) for using inside each cell
				onInit: function() {}, // callback for component created event (no params)
				onHandlerDown: function() {}, // callback for handler pressed (param: handler)
				onHandlerUp: function() {}, // callback for handler released (param: handler)
				onHandlerOver: function() {}, // callback for handler rollover (param: handler)
				onHandlerOut: function() {}, // callback for handler rollout (param: handler)
				onHandlerDrag: function() {}, // callback for handler being dragged (param: handler)
				onHandlerStop: function() {}, // callback for handler stop dragging (param: handler)
				handlerOverClass: 'hover',
				handlerDownClass: 'down',
				customCursor: 'row-resize',
				autoAdjust: true, // make the blind adjust automatically to the beginning (or the end) of the container if it gets close to it
				adjustZone: 50, // distance on pixels to start adjusting
				adjustSpeed: 400, // animation speed
				onAdjustEnd: function() {} // callback for autoAdjust animation end
				
			};
		
			return this.each(function() {
			
				// merge options with defaults
				if (options) {
					$.extend(defaults, options);
				}
				
				// assign "this"
				var obj = $(this);
				
				// store content and empty obj
				var content = obj.html();
				obj.empty();
				
				// append blind container and make it "overflow: hidden"
				obj.append('<div class="blindContainer" style="overflow: hidden;"></div>');
				
				// put content on container (and remove it from memory, please)
				var container = obj.children('.blindContainer');
				container.html(content);
				delete content;
				
				// add handler after container
				container.after('<div class="blindHandler">'+defaults.handlerText+'</div>');
				var handler = obj.children('.blindContainer').next('.blindHandler');
				
				// switch for monitor dragging
				var isDragging = false;
				// store movement value
				var moveY;
				// store initial height
				var initialHeight = container.height();
				
				// bind dragging to handler
				handler.bind('mousedown', function(e) {
					
					// switch
					isDragging = true;
					
					// custom cursor while moving 
					obj.css('cursor', defaults.customCursor);
					
					// add class to handler (remove any other states)
					handler.removeClass(defaults.handlerOverClass);
					handler.addClass(defaults.handlerDownClass);
					
					// callback function for mouse down on handler
					if (typeof defaults.onHandlerDown == 'function') {
						defaults.onHandlerDown(handler); // send two params: handler and its index
					} else {
						$.error(defaults.onHandlerDown + ' is not a function or has not been defined.');
					}
					
					// bind movement to the whole document
					$(document).bind('mousemove', function(e) {
					
						if (isDragging) {
						
							// get local value for vertical position (mouse position - container offset)
							moveY = e.pageY - container.offset().top;
								
							// check if movement is limited
							if (defaults.blindLimit) {
								// move only if is less or equal to container initial height
								if (moveY <= initialHeight) {
									container.css('height', moveY + 'px');
								}
							} else {
								// else, move handler along freely...
								container.css('height', moveY + 'px');
							}
								
							// callback function for handler move
							if (typeof defaults.onHandlerDrag == 'function') {
								defaults.onHandlerDrag(handler); // param: handler
							} else {
								$.error(defaults.onHandlerDrag + ' is not a function or has not been defined.');
							}
						
						}
						
					});
					
					// listen for mouse up on whole document, and stop moving
					$(document).bind('mouseup', function() {
						
						// cancel dragging
						isDragging = false;
						
						// default cursor for content
						obj.css('cursor', 'inherit');
						
						// remove class to handler
						handler.removeClass(defaults.handlerDownClass);
						
						// callback function for handler up
						if (typeof defaults.onHandlerUp == 'function') {
							defaults.onHandlerUp(handler); // param: handler
						} else {
							$.error(defaults.onHandlerUp + ' is not a function or has not been defined.');
						}
							
						// autoAdjust
						if (defaults.autoAdjust) {
						
							//  if we get close to the top
							if (moveY < defaults.adjustZone) {
								// animate
								container.animate({'height': '0px'}, defaults.adjustSpeed, defaults.onAdjustEnd);
							}
							// if we get close to the bottom, first check if it is limited
							if (defaults.blindLimit) {
								if (moveY > parseInt(initialHeight - defaults.adjustZone)) {
									// animate
									container.animate({'height': initialHeight + 'px'}, defaults.adjustSpeed, defaults.onAdjustEnd);
								}
							}
						
						}
						
						// unbind movement, unbind release
						$(document).unbind('mousemove');
						$(document).unbind('mouseup');
						
					});
				});
				
				// on over
				handler.bind('mouseenter', function() {
				
					// disable text selection
					document.onselectstart = function() { return false; }; 
					document.unselectable = "on";
					document.css('user-select', 'none'); 
					document.css('-o-user-select', 'none'); 
					document.css('-moz-user-select', 'none'); 
					document.css('-khtml-user-select', 'none'); 
					document.css('-webkit-user-select', 'none');
				
					if (!isDragging) {
				
						// add class
						$(this).addClass(defaults.handlerOverClass);
						
						// callback function for hovering the handler
						if (typeof defaults.onHandlerOver == 'function') {
							defaults.onHandlerOver( $(this) ); // param: handler
						} else {
							$.error(defaults.onHandlerOver + ' is not a function or has not been defined.');
						}
					
					}
					
				});				
				
				// on out
				handler.bind('mouseleave', function() {
				
					if (!isDragging) {
					
						// enable selection...
						document.onselectstart = null;
						document.unselectable = "off";
						document.css('user-select', 'initial'); 
						document.css('-o-user-select', 'initial'); 
						document.css('-moz-user-select', 'initial'); 
						document.css('-khtml-user-select', 'initial'); 
						document.css('-webkit-user-select', 'initial');
				
						// remove class
						$(this).removeClass(defaults.handlerOverClass);
						
						// callback function for hovering the handler
						if (typeof defaults.onHandlerOut == 'function') {
							defaults.onHandlerOut( $(this) ); // param: handler
						} else {
							$.error(defaults.onHandlerOut + ' is not a function or has not been defined.');
						}
					
					}
					
				});
				
				// callback function for component finally created
				if (typeof defaults.onInit == 'function') {
					defaults.onInit(); // no params
				} else {
					$.error(defaults.onInit + ' is not a function or has not been defined.');
				}
				
			});
		
		
		}
	
	};

	$.fn.blind = function(method) {
		
		// Method calling logic
		if ( methods[method] ) {
			return methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
		} else if ( typeof method === 'object' || ! method ) {
			return methods.init.apply( this, arguments );
		} else {
			$.error( 'Method ' +  method + ' does not exist on jQuery.multiSlider.' );
		}
		
	};
	
			
	/* PRIVATE METHODS */

})(jQuery);