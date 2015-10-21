/**
 * Extends crafty namespace to have a init function that sets the world properties
 */
Crafty.extend( {
	Matter: ( function() {

		return {
			/**
			 * Creates the matter world with our custom controller.
			 * @param  {object} _arg - game options such as debug mode or gravity
			 */
			init: function init( _arg ) {

				// Create a Matter.js engine
				engine = Engine.create( {
					render: {
						controller: CraftyRenderer,
						options: {
							width: Crafty.viewport.width,
							height: Crafty.viewport.height,
							hasBounds: _arg.hasBounds || false,
							showDebug: false
						}
					},
					world: {
						bounds: _arg.bounds || {
							min: { x: 0, y: 0},
							max: { x: Crafty.viewport.width, y: Crafty.viewport.height }
						}
					}
				} );

				runner = Runner.create();

				if ( !!_arg ) {

					if ( !!_arg.debug ) {
						debug.debugAllowed = _arg.debug;
					}

					if ( !!_arg.gravity ) {
						engine.world.gravity = _arg.gravity;
					}

					if ( !!_arg.size ) {
						engine.world.bounds.max = {
							x: _arg.size.x,
							y: _arg.size.y
						};
					}

					if ( !!_arg.renderingMode ) {
						if ( _arg.renderingMode === 'Canvas' ) {
							RenderingMode = '2D, Canvas';
						}
						else if ( _arg.renderingMode === 'WebGL' ) {
							RenderingMode = '2D, WebGL';
						}
					}
				}

				debug.worldDebug();

				event.propagateEvents();

				//Update engine every frame
				Crafty.bind( 'EnterFrame', function( data ) {
					Runner.tick(runner, engine, data.dt);
				} );

				this.engine = engine;
				this.world = engine.world;
				this.runner = runner;
			},

			destroy: function() {},

			engine: {},

			world: {}
		};
	} ) ()
} );
