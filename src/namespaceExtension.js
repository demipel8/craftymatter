/**
 * Extends crafty namespace to have a init function that sets the world properties 
 */
Crafty.extend({
  	Matter: (function() {

  		return {
  			/**
  			 * Creates the matter world with our custom controller.
  			 * @param  {object} _arg - game options such as debug mode or gravity
  			 */
  			init: function init(_arg) {

		    	// create a Matter.js engine
				engine = Engine.create({
				    render: {
				        controller: CraftyRenderer,
				        options: {
				        	width: Crafty.viewport.width,
            				height: Crafty.viewport.height
				        }
				    }
				});


  				if( !!_arg ) {

  					if( !!_arg.debug ) {
  						debug = _arg.debug;
  					}

  					if( !!_arg.gravity ){
  						engine.world.gravity = _arg.gravity;
  					}

  				}

				engine.world.bounds.max = {
					x: Crafty.viewport.width,
					y: Crafty.viewport.height
				};

				worldDebug();

		    	//Update engine every frame
		    	Crafty.bind('EnterFrame', function(data) {
		    		Matter.Events.trigger(engine, 'beforeTick', event);
			        Engine.update(engine, ( 1000 / data.dt ), 1);
					Engine.render(engine);
					Matter.Events.trigger(engine, 'afterTick', event);
			    });
		    },

		    destroy: function() {}
  		};
  	})()
});
