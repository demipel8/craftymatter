/**
 * CraftyRenderer for MatterJS. Creates the custom renderer and updates the entities according to Matter
 * physics
 * @type {Object}
 */
var CraftyRenderer = {
	
    create: function(options) {

    	var defaults = {
    		controller: CraftyRenderer,
    		options: {
    			width: 640,
            	height: 960
    		}
    	};

    	var render = Common.extend(defaults, options);

        return render;
    },

    world: function(engine) {

		var bodies = engine.world.bodies;
		for (var i = 0; i < bodies.length; i++) {
			if(bodies[i].velocity.x + bodies[i].velocity.y !== 0) {
				entities[i].x = bodies[i].position.x;
				entities[i].y = bodies[i].position.y;

				if( debug ) {
					entities[i]._debugBody.x = bodies[i].position.x;
					entities[i]._debugBody.y = bodies[i].position.y;
				}
			}
		}
    }
};