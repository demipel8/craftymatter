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
