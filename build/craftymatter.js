/**
 * Crafty wrapper fot MatterJS
 * @author  DEMI - Alvaro Martinez de Miguel
 */

var Matter = ( typeof require !== 'undefined' ) ? require('matter-js') : window.Matter;

(function() {
	'use strict';

	var engine, runner;

	//Matter variables
	var Bodies		= Matter.Bodies;
	var Body		= Matter.Body;
	var Bounds		= Matter.Bounds;
	var Common		= Matter.Common;
	var Composite 	= Matter.Composite;
	var Engine 		= Matter.Engine;
	var Events 		= Matter.Events;
	var Mouse 		= Matter.Mouse;
	var Runner 		= Matter.Runner;
	var Vector 		= Matter.Vector;
	var World 		= Matter.World;

	var debug = generateDebug( false );

	var entities = [];
	var RenderingMode = '2D, DOM';

	/* jshint ignore:start */
	/**
	 * CraftyJS custom Matter-js renderer. adapted from their standard renderer
	 */

	var CraftyRenderer = {};

	( function( Render ) {

	    /**
	     * Creates a new renderer. The options parameter is an object that specifies any properties you wish to override
	     * the defaults. All properties have default values, and many are pre-calculated automatically based on other
	     * properties. See the properties section below for detailed information on what you can pass via the `options`
	     * object.
	     * @method create
	     * @param {object} [options]
	     * @return {render} A new renderer
	     */
	    Render.create = function( options ) {
	        var defaults = {
	            controller: Render,
	            element: null,
	            options: {
	                width: 640,
	                height: 960,
	                wireframeBackground: '#222',
	                hasBounds: false,
	                enabled: true,
	                wireframes: false,
	                showSleeping: true,
	                showDebug: false,
	                showBroadphase: false,
	                showBounds: false,
	                showVelocity: false,
	                showCollisions: false,
	                showSeparations: false,
	                showAxes: false,
	                showPositions: false,
	                showAngleIndicator: false,
	                showIds: false,
	                showShadows: false,
	                showVertexNumbers: false,
	                showConvexHulls: false,
	                showInternalEdges: false
	            }
	        };

	        var render = Common.extend( defaults, options );

	        render.textures = {};

	        render.bounds = render.bounds || {
	                min: {
	                    x: 0,
	                    y: 0
	                },
	                max: {
	                    x: render.options.width,
	                    y: render.options.height
	                }
	            };

	        return render;
	    };

	    /**
	     * Renders the given `engine`'s `Matter.World` object.
	     * This is the entry point for all rendering and should be called every time the scene changes.
	     * @method world
	     * @param {engine} engine
	     */
	    Render.world = function( engine ) {
	        var render = engine.render;
	        var world = engine.world;
	        var options = render.options;
	        var allBodies = Composite.allBodies( world );
	        var allConstraints = Composite.allConstraints( world );
	        var bodies = [];
	        var constraints = [];
	        var body;
	        var constraint;
	        var bodyA;
	        var bodyB;
	        var pointAWorld;
	        var pointBWorld;
	        var i;

	        // Handle bounds
	        if ( options.hasBounds ) {

	            // Filter out bodies that are not in view
	            for ( i = 0; i < allBodies.length; i++ ) {
	                body = allBodies[ i ];
	                if ( Bounds.overlaps( body.bounds, render.bounds ) ) {
	                    bodies.push( body );
	                }
	            }

	            // Filter out constraints that are not in view
	            for ( i = 0; i < allConstraints.length; i++ ) {
	                constraint = allConstraints[ i ];
	                bodyA = constraint.bodyA;
	                bodyB = constraint.bodyB;
	                pointAWorld = constraint.pointA;
	                pointBWorld = constraint.pointB;

	                if ( bodyA ) {
	                    pointAWorld = Vector.add( bodyA.position, constraint.pointA );
	                }

	                if ( bodyB ) {
	                    pointBWorld = Vector.add( bodyB.position, constraint.pointB );
	                }

	                if ( !pointAWorld || !pointBWorld ) {
	                    continue;
	                }

	                if ( Bounds.contains( render.bounds, pointAWorld ) || Bounds.contains( render.bounds, pointBWorld ) ) {
	                    constraints.push( constraint );
	                }
	            }

	        } else {
	            constraints = allConstraints;
	            bodies = allBodies;
	        }

	        // Move bodies
	        Render.bodies( engine, bodies );

	        //Only show constraints when debug is active
	        if ( debug.debugAllowed ) {
	            Render.constraints( constraints );
	        }

	        if ( options.showDebug ) {
	            Render.debug( engine );
	        }
	    };

	    /**
	     * Description
	     * @private
	     * @method debug
	     * @param {engine} engine
	     */
	    Render.debug = function( engine ) {
	        var canvas = _createCanvas( engine.world.bounds.max.x, engine.world.bounds.max.y );
	        canvas.width = engine.world.bounds.max.x;
	        canvas.height = engine.world.bounds.max.y;
	        canvas.style.zIndex   = 8;
	        canvas.style.position = 'absolute';

	        var c = canvas.getContext( '2d' );
	        var world = engine.world;
	        var render = engine.render;
	        var options = render.options;
	        var bodies = Composite.allBodies( world );
	        var space = '    ';

	        document.body.appendChild( canvas );

	        if ( engine.timing.timestamp - ( render.debugTimestamp || 0 ) >= 500 ) {
	            var text = '';
	            text += 'fps: ' + Math.round( engine.timing.fps ) + space;

	            // @if DEBUG
	            if ( engine.metrics.extended ) {
	                text += 'delta: ' + engine.timing.delta.toFixed( 3 ) + space;
	                text += 'correction: ' + engine.timing.correction.toFixed( 3 ) + space;
	                text += 'bodies: ' + bodies.length + space;

	                if ( engine.broadphase.controller === Grid ) {
	                    text += 'buckets: ' + engine.metrics.buckets + space;
	                }

	                text += '\n';

	                text += 'collisions: ' + engine.metrics.collisions + space;
	                text += 'pairs: ' + engine.pairs.list.length + space;
	                text += 'broad: ' + engine.metrics.broadEff + space;
	                text += 'mid: ' + engine.metrics.midEff + space;
	                text += 'narrow: ' + engine.metrics.narrowEff + space;
	            }

	            // @endif
	            render.debugString = text;
	            render.debugTimestamp = engine.timing.timestamp;
	        }

	        if ( render.debugString ) {
	            c.font = '12px Arial';

	            if ( options.wireframes ) {
	                c.fillStyle = 'rgba(255,255,255,0.5)';
	            } else {
	                c.fillStyle = 'rgba(0,0,0,0.5)';
	            }

	            var split = render.debugString.split( '\n' );

	            for ( var i = 0; i < split.length; i++ ) {
	                c.fillText( split[ i ], 50, 50 + i * 18 );
	            }
	        }
	    };

	    /**
	     * Description
	     * @private
	     * @method constraints
	     * @param {constraint[]} constraints
	     */
	    Render.constraints = function( constraints ) {
	        var constraint;
	        var bodyA;
	        var bodyB;
	        var pointToGo;

	        for ( var i = 0; i < constraints.length; i++ ) {
	            constraint = constraints[ i ];

	            if ( !constraint.render.visible || !constraint.pointA || !constraint.pointB ) {
	                continue;
	            }

	            if ( !constraint.entity ) {
	                constraint.entity = Crafty.e( RenderingMode + ', Color' )
	                    .color( 'white' );
	            }

	            constraint.entity.h = Crafty.viewport.height * 0.005;

	            bodyA = constraint.bodyA;
	            bodyB = constraint.bodyB;

	            if ( bodyA ) {
	                constraint.entity.x = bodyA.position.x + constraint.pointA.x;
	                constraint.entity.y = bodyA.position.y + constraint.pointA.y;
	            } else {
	                constraint.entity.x = constraint.pointA.x;
	                constraint.entity.y = constraint.pointA.y;
	            }

	            if ( bodyB ) {
	                pointToGo = {
	                    x: bodyB.position.x + constraint.pointB.x,
	                    y: bodyB.position.y + constraint.pointB.y
	                };
	            } else {
	                pointToGo = {
	                    x: constraint.pointB.x,
	                    y: constraint.pointB.y
	                };
	            }

	            constraint.entity.w = _getWidth( {
	                x: constraint.entity._x,
	                y: constraint.entity._y
	            }, pointToGo );

	            constraint.entity.rotation = _getAngle( {
	                x: constraint.entity._x,
	                y: constraint.entity._y
	            }, pointToGo );
	        }
	    };

	    /**
	     * Description
	     * @private
	     * @method bodies
	     * @param {engine} engine
	     * @param {body[]} bodies
	     */
	    Render.bodies = function( engine, bodies ) {
	        var render = engine.render;
	        var options = render.options;
	        var body;
	        var entity;
	        var i;
	        var k;

	        for ( i = 0; i < bodies.length; i++ ) {
	            body = bodies[ i ];
	            entity = body.entity;

	            if ( !body.render.visible ) {
	                continue;
	            }

	            if ( !body.parts ) {
	                _moveEntity( options, body, body.isSleeping );
	            } else {

	                // Handle compound parts
	                for ( k = body.parts.length > 1 ? 1 : 0; k < body.parts.length; k++ ) {
	                    _moveEntity( options, body.parts[ k ], body.isSleeping );
	                }
	            }
	        }
	    };

	    /**
	     * Description
	     * @method _createCanvas
	     * @private
	     * @param {number} width
	     * @param {number} height
	     * @return canvas
	     */
	    var _createCanvas = function( width, height ) {
	        var canvas = document.createElement( 'canvas' );
	        canvas.width = width;
	        canvas.height = height;

	        canvas.oncontextmenu = function() {
	            return false;
	        };
	        canvas.onselectstart = function() {
	            return false;
	        };

	        return canvas;
	    };

	    /**
	     * Moves an entity according to matter calculations
	     * @param  {object}  options    engine.options
	     * @param  {object}  part       part to be moved
	     * @param  {Boolean} isSleeping
	     */
	    var _moveEntity = function( options, part, isSleeping ) {
	        var entity = part.entity;

	        if ( options.showSleeping && isSleeping ) {
	            entity.alpha = 0.5;
	        }

	        if ( entity._x !== part.position.x - ( entity._w / 2 ) ) {
	            entity.matterMoved = true;
	            entity.x = part.position.x - ( entity._w / 2 );
	        }

	        if ( entity._y !== part.position.y - ( entity._h / 2 ) ) {
	            entity.matterMoved = true;
	            entity.y = part.position.y - ( entity._h / 2 );
	        }

	        debug.moveEntity( entity );

	        _rotateEntity( entity,  part.angle );

	    };

	    // Initial support only for center origin
	    var _rotateEntity = function( entity, angle ) {

	        var angleFixed = Crafty.math.radToDeg( angle ).toFixed( 3 );

	        if ( angle === 0 || entity._rotation === angleFixed ) {
	            return;
	        }

	        entity.matterMoved = true;
	        entity.rotation = angleFixed;

	        debug.rotateEntity( [ entity, angleFixed ] );
	    };

	    /**
	     * Calculate the distance between two points
	     * @param  {Vector} pointA
	     * @param  {Vector} pointB
	     * @return {number}        distance between two points
	     */
	    var _getWidth = function( pointA, pointB ) {

	        var vector = _getVector( pointA, pointB );
	        return Vector.magnitude( vector );
	    };

	    /**
	     * Calculate the angle between a vector and the x axis
	     * @param  {Vector} pointA - vector origin
	     * @param  {Vector} pointB - vector point
	     * @return {number}        angle between the vector and the x axis
	     */
	    var _getAngle = function( pointA, pointB ) {

	        var vector = _getVector( pointA, pointB );
	        return -Crafty.math.radToDeg( Math.atan2( vector.y, vector.x ) ).toFixed( 3 );
	    };

	    /**
	     * Creates a vector given its origin and destiny points
	     * @param  {Vector} pointA - vector origin
	     * @param  {Vector} pointB - vector point
	     * @return {Vector}        Resulting vector
	     */
	    var _getVector = function( pointA, pointB ) {

	        return { x: pointB.x - pointA.x, y: -( pointB.y - pointA.y ) };
	    };

	} )( CraftyRenderer );

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

	/**
	 * Matter component, creates the bodies in the Matter world and links the to its entities.
	 */
	Crafty.c( 'Matter', ( function() {

		var _newBody = function _newBody( attr ) {

	        var coords = {
	            x: attr.x || 0,
	            y: attr.y || 0,
	            w: attr.w || 0,
	            h: attr.h || 0
	        };

			this.origin( ( coords.w / 2 ), ( coords.h / 2 ) );

			entities.push( this );

			var options = {};
			if ( !!attr.matter ) {
				options = attr.matter;
			}

			Common.extend(options, this._matter, true);

			if ( !!options.shape && options.shape === 'circle' ) {
				var radius = coords.w / 2;

				if ( !!attr.matter.radius ) {
					radius = attr.matter.radius;
				}

				this._body = Bodies.circle( coords.x + ( coords.w / 2 ), coords.y + ( coords.h / 2 ), radius, options );

			} else {

				this._body = Bodies.rectangle( coords.x + ( coords.w / 2 ), coords.y + ( coords.h / 2 ), coords.w, coords.h,
					options );
			}

			this._body.entity = this;

			this.matterMoved = false;

			this._debugBody = debug.generateDebugBody( this._body );

			if ( !!attr.rotation ) {
				Body.setAngle( this._body, Crafty.math.degToRad( attr.rotation ) );
			}

			World.addBody( engine.world, this._body );
		};

	    return {

			init: function() {
				this._matter = {};

				this.requires( '2D' );

				this.bind( 'Change', function( attr ) {
					if ( !attr ) {
						return;
					}
					if ( attr.hasOwnProperty( 'x' ) && attr.hasOwnProperty( 'y' ) ) {
						return _newBody.call( this, attr );
					}
				}.bind( this ) );

				this.bind( 'Move', function( ) {

					if ( !this.matterMoved && typeof this._body !== 'undefined' ) {
						Body.setPosition ( this._body, {
							x: this._x + this._w / 2,
							y: this._y + this._h / 2
						} );

					} else {
						this.matterMoved = false;
					}

				}.bind( this ) );

				this.bind( 'Rotate', function( ) {

					if ( !this.matterMoved ) {

						Body.setAngle ( this._body, Crafty.math.degToRad( this.rotation ) );

					} else {
						this.matterMoved = false;
					}
				}.bind( this ) );
			},

			remove: function( ) {
		        World.remove( engine.world, this._body, true );

				if ( typeof this._debugBody !== 'undefined' ) {
					this._debugBody.destroy();
				}
		    },

	    	matter: function (options) {
	    		Common.extend(this._matter, options, true);

	    		return this;
	    	}
		};

	} ) () );

	function generateDebug( debugAllowed ) {

		var debug = debugAllowed || false;

		// Creates a rectangle filling the Matter world area
		function worldDebug() {
			Crafty.e( RenderingMode + ', Color' )
				.attr( {
				x: engine.world.bounds.min.x,
				y: engine.world.bounds.min.y,
				w: engine.world.bounds.max.x - engine.world.bounds.min.x,
				h: engine.world.bounds.max.y - engine.world.bounds.min.y,
				alpha: 0.5
			} )
			.color( 'green' );
		}

		// Generates a debug body from the matter body
		function generateDebugBody( body ) {

			var frameUnit           = 2;// In pixels
			var debugBody           = Crafty.e( RenderingMode );
	        var debugBodyBody       = Crafty.e( RenderingMode + ', Color' );
	        var debugBodyTopFrame   = Crafty.e( RenderingMode + ', Color' );
			var debugBodyRightFrame = Crafty.e( RenderingMode + ', Color' );
	        var debugBodyDownFrame  = Crafty.e( RenderingMode + ', Color' );
	        var debugBodyLeftFrame  = Crafty.e( RenderingMode + ', Color' );

			debugBody.attach( debugBodyBody );
			debugBody.attach( debugBodyTopFrame );
			debugBody.attach( debugBodyRightFrame );
			debugBody.attach( debugBodyDownFrame );
			debugBody.attach( debugBodyLeftFrame );

			// TODO cleaner code.
			var attr = {
				x: body.vertices[ 0 ].x,
				y: body.vertices[ 0 ].y,
				w: body.vertices[ 0 ].x,
				h: body.vertices[ 0 ].y
			};

			//We iterate to have a square shape for circles and polygons/
			for ( var i = 1; i < body.vertices.length; i++ ) {
				if ( body.vertices[ i ].x < attr.x ) {
					attr.x = body.vertices[ i ].x;
				}

				if ( body.vertices[ i ].y < attr.y ) {
					attr.y = body.vertices[ i ].y;
				}

				if ( body.vertices[ i ].x > attr.w ) {
					attr.w = body.vertices[ i ].x;
				}

				if ( body.vertices[ i ].y > attr.h ) {
					attr.h = body.vertices[ i ].y;
				}
			}

			debugBody.attr( {
				x: attr.x,
				y: attr.y,
				w: Math.abs( attr.w - attr.x ),
				h: Math.abs( attr.h - attr.y )
			} );

			debugBody.origin( 'center' );

			debugBodyBody.color( 'blue' );
			debugBodyBody.alpha = 0.5;
			debugBodyBody.z = debugBody._z + 1;
			debugBodyBody.origin( 'center' );

			debugBodyTopFrame.color( 'blue' );
			debugBodyTopFrame.h = frameUnit;
			debugBodyTopFrame.z = debugBody._z + 1;
			debugBodyTopFrame.origin( 'center' );

			debugBodyRightFrame.color( 'blue' );
			debugBodyRightFrame.x = debugBodyBody._x + ( debugBodyBody._w - frameUnit );
			debugBodyRightFrame.w = frameUnit;
			debugBodyRightFrame.z = debugBody._z + 1;
			debugBodyRightFrame.origin( 'center' );

			debugBodyDownFrame.color( 'blue' );
			debugBodyDownFrame.y = debugBodyBody._y + ( debugBodyBody._h - frameUnit );
			debugBodyDownFrame.h = frameUnit;
			debugBodyDownFrame.z = debugBody._z + 1;
			debugBodyDownFrame.origin( 'center' );

			debugBodyLeftFrame.color( 'blue' );
			debugBodyLeftFrame.w = frameUnit;
			debugBodyLeftFrame.z = debugBody._z + 1;
			debugBodyLeftFrame.origin( 'center' );

			return debugBody;
		}

		function moveEntity( entity ) {

			entity._debugBody.x = entity._x;
	        entity._debugBody.y = entity._y;
		}

		function rotateEntity( params ) { //Params[0] -> entity, params[1] -> angle

	        params[ 0 ]._debugBody.rotation =  params[ 1 ];
		}

		//Check if debug is active before launching a debug related function
		function isDebugAllowed( name, params ) {

			if ( !this.debugAllowed ) {
				return;
			}

			return this[ name ]( params );
		}

		var publicAPI = {
			debugAllowed: debug
		};

		publicAPI.worldDebug = isDebugAllowed.bind( publicAPI, 'worldDebugAllowed' );
		publicAPI.generateDebugBody = isDebugAllowed.bind( publicAPI, 'generateDebugBodyAllowed' );
		publicAPI.moveEntity = isDebugAllowed.bind( publicAPI, 'moveEntityAllowed' );
		publicAPI.rotateEntity = isDebugAllowed.bind( publicAPI, 'rotateEntityAllowed' );

		publicAPI.worldDebugAllowed = worldDebug;
		publicAPI.generateDebugBodyAllowed = generateDebugBody;
		publicAPI.moveEntityAllowed = moveEntity;
		publicAPI.rotateEntityAllowed = rotateEntity;

		return publicAPI;
	}

	//Propagate engine events onto targets 

	var event = (function () {
		var propagateEvents = function() {
			['collisionStart', 'collisionEnd', 'collisionActive'].forEach(function (collisionEvent) {
				Events.on(engine, collisionEvent, function (e) {
				    var pairs = e.pairs;

				    for (var i = 0; i < pairs.length; i++) {
				        var pair = pairs[i];
				        var craftyEvent = collisionEvent.charAt(0).toUpperCase() + collisionEvent.slice(1);

				        pair.bodyA.entity.trigger(craftyEvent, {
				            target: pair.bodyB.entity,
				            event: e
				        });
				        pair.bodyB.entity.trigger(craftyEvent, {
				            target: pair.bodyA.entity,
				            event: e
				        });
				    }
				});
			});
		};

		return {
			propagateEvents: propagateEvents
		};
	})();
	/* jshint ignore:end */

})();