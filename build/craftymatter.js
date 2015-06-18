/**
 * Crafty wrapper fot MatterJS
 * @author  DEMI - Alvaro Martinez de Miguel
 */
(function(Matter){
	'use strict';

	var engine;

	//Matter variables
	var World = Matter.World;
	var Engine = Matter.Engine;
	var Bodies = Matter.Bodies;
	var Common = Matter.Common;

	var debug = false;

	var entities = [];

	/* jshint ignore:start */
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

	/**
	 * Matter component, creates the bodies in the Matter world and links the to its entities.
	 * 
	 */
	Crafty.c('Matter', (function() {

		var _newBody = function _newBody( attr ) {

			entities.push(this);

			var options = {};
			if( !!attr.matter ) {
				options = attr.matter;
			}

			this._body = Bodies.rectangle(attr.x + (attr.w / 2), attr.y + (attr.h / 2), attr.w, attr.h, options);

			if(debug){
				this._debugBody = generateDebugBody( this._body );
			}


			World.addBody(engine.world, this._body);
		};

	    return {

			init: function () {
				this.bind("Change", function(attr) {
					if (!attr) {
						return;
					}
					if (attr.hasOwnProperty('x') && attr.hasOwnProperty('y')) {
						return _newBody.call(this, attr);
					}
				}.bind(this));

				this.bind("Move", function(oldAttr) {

					Matter.Body.setPosition (this._body, {
						x: this._x,
						y: this._y
					});

				}.bind(this));
			}
		};

	})());

	// Creates a rectangle filling the Matter world area
	function worldDebug() {
		
		if( debug ){
			Crafty.e('Actor, Color')
				.attr({
				x: 0,
				y: 0,
				w: engine.world.bounds.max.x,
				h: engine.world.bounds.max.y,
				alpha : 0.5,
				z: 200
			})
			.color('green');
		}
	}
		
	// generates a debug body from the matter body 
	function generateDebugBody( body ) {

		var frameUnit = 0.04;

		var debugBody 			= Crafty.e('Actor');
		var debugBodyBody 		= Crafty.e('Actor, Color');
		var debugBodyTopFrame 	= Crafty.e('Actor, Color');
		var debugBodyRightFrame = Crafty.e('Actor, Color');
		var debugBodyDownFrame 	= Crafty.e('Actor, Color');
		var debugBodyLeftFrame 	= Crafty.e('Actor, Color');

		debugBody.attach(debugBodyBody);
		debugBody.attach(debugBodyTopFrame);
		debugBody.attach(debugBodyRightFrame);
		debugBody.attach(debugBodyDownFrame);
		debugBody.attach(debugBodyLeftFrame);

		debugBody.attr({
			x: body.vertices[0].x,
			y: body.vertices[0].y,
			w: body.vertices[2].x - body.vertices[0].x,
			h: body.vertices[2].y - body.vertices[0].y,
		});

		debugBodyBody.color('blue');
		debugBodyBody.alpha = 0.5;
		debugBodyBody.z = debugBody._z + 1;

		debugBodyTopFrame.color('blue');
		debugBodyTopFrame.h = debugBodyBody._h * frameUnit;
		debugBodyTopFrame.z = debugBody._z + 1;

		debugBodyRightFrame.color('blue');
		debugBodyRightFrame.x = debugBodyBody._x + ( debugBodyBody._w * ( 1 - frameUnit) );
		debugBodyRightFrame.w = debugBodyBody._w * frameUnit;
		debugBodyRightFrame.z = debugBody._z + 1;

		debugBodyDownFrame.color('blue');
		debugBodyDownFrame.y = debugBodyBody._y + ( debugBodyBody._h * ( 1 - frameUnit) );
		debugBodyDownFrame.h = debugBodyBody._h * frameUnit;
		debugBodyDownFrame.z = debugBody._z + 1;

		debugBodyLeftFrame.color('blue');
		debugBodyLeftFrame.w = debugBodyBody._w * frameUnit;
		debugBodyLeftFrame.z = debugBody._z + 1;

		return debugBody;
	}
	/* jshint ignore:end */

})(Matter);