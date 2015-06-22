/**
 * CraftyJS custom Matter-js renderer. adapted from their standard renderer
 */

var CraftyRenderer = {};

(function(Render) {
    
    /**
     * Creates a new renderer. The options parameter is an object that specifies any properties you wish to override the defaults.
     * All properties have default values, and many are pre-calculated automatically based on other properties.
     * See the properties section below for detailed information on what you can pass via the `options` object.
     * @method create
     * @param {object} [options]
     * @return {render} A new renderer
     */
    Render.create = function(options) {
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

        var render = Common.extend(defaults, options);

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
    Render.world = function(engine) {
        var render = engine.render;
        var world = engine.world;
        var options = render.options;
        var allBodies = Composite.allBodies(world);
        var allConstraints = Composite.allConstraints(world);
        var bodies = [];
        var constraints = [];
        var boundsWidth;
        var boundsHeight;
        var boundsScaleX;
        var boundsScaleY;
        var body;
        var constraint;
        var bodyA;
        var bodyB;
        var pointAWorld;
        var pointBWorld;
        var i;

        // handle bounds
        if ( options.hasBounds ) {
            boundsWidth = render.bounds.max.x - render.bounds.min.x;
            boundsHeight = render.bounds.max.y - render.bounds.min.y;
            boundsScaleX = boundsWidth / options.width;
            boundsScaleY = boundsHeight / options.height;

            // filter out bodies that are not in view
            for ( i = 0; i < allBodies.length; i++ ) {
                body = allBodies[i];
                if ( Bounds.overlaps( body.bounds, render.bounds ) ){
                    bodies.push(body);
                }
            }

            // filter out constraints that are not in view
            for ( i = 0; i < allConstraints.length; i++ ) {
                constraint = allConstraints[i];
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

        //move bodies
        Render.bodies( engine, bodies );

        //Render.constraints(constraints);

        if (options.showDebug) {
            Render.debug(engine);
        }
    };

    /**
     * Description
     * @private
     * @method debug
     * @param {engine} engine
     * @param {RenderingContext} context
     */
    Render.debug = function( engine ) {
        var canvas = _createCanvas( engine.world.bounds.max.x, engine.world.bounds.max.y);
        canvas.width = engine.world.bounds.max.x;
        canvas.height = engine.world.bounds.max.y;
        canvas.style.zIndex   = 8;
        canvas.style.position = "absolute";

        var c = canvas.getContext('2d');
        var world = engine.world;
        var render = engine.render;
        var options = render.options;
        var bodies = Composite.allBodies(world);
        var space = "    ";

        document.body.appendChild(canvas);

        if (engine.timing.timestamp - (render.debugTimestamp || 0) >= 500) {
            var text = "";
            text += "fps: " + Math.round(engine.timing.fps) + space;

            // @if DEBUG
            if (engine.metrics.extended) {
                text += "delta: " + engine.timing.delta.toFixed(3) + space;
                text += "correction: " + engine.timing.correction.toFixed(3) + space;
                text += "bodies: " + bodies.length + space;

                if (engine.broadphase.controller === Grid)
                    text += "buckets: " + engine.metrics.buckets + space;

                text += "\n";

                text += "collisions: " + engine.metrics.collisions + space;
                text += "pairs: " + engine.pairs.list.length + space;
                text += "broad: " + engine.metrics.broadEff + space;
                text += "mid: " + engine.metrics.midEff + space;
                text += "narrow: " + engine.metrics.narrowEff + space;
            }
            // @endif            

            render.debugString = text;
            render.debugTimestamp = engine.timing.timestamp;
        }

        if (render.debugString) {
            c.font = "12px Arial";

            if (options.wireframes) {
                c.fillStyle = 'rgba(255,255,255,0.5)';
            } else {
                c.fillStyle = 'rgba(0,0,0,0.5)';
            }

            var split = render.debugString.split('\n');

            for (var i = 0; i < split.length; i++) {
                c.fillText(split[i], 50, 50 + i * 18);
            }
        }
    };

    /**
     * Description
     * @private
     * @method constraints
     * @param {constraint[]} constraints
     * @param {RenderingContext} context
     */
    Render.constraints = function(constraints, context) {
        var c = context;

        for (var i = 0; i < constraints.length; i++) {
            var constraint = constraints[i];

            if (!constraint.render.visible || !constraint.pointA || !constraint.pointB)
                continue;

            var bodyA = constraint.bodyA,
                bodyB = constraint.bodyB;

            if (bodyA) {
                c.beginPath();
                c.moveTo(bodyA.position.x + constraint.pointA.x, bodyA.position.y + constraint.pointA.y);
            } else {
                c.beginPath();
                c.moveTo(constraint.pointA.x, constraint.pointA.y);
            }

            if (bodyB) {
                c.lineTo(bodyB.position.x + constraint.pointB.x, bodyB.position.y + constraint.pointB.y);
            } else {
                c.lineTo(constraint.pointB.x, constraint.pointB.y);
            }

            c.lineWidth = constraint.render.lineWidth;
            c.strokeStyle = constraint.render.strokeStyle;
            c.stroke();
        }
    };
    
    /**
     * Description
     * @private
     * @method bodies
     * @param {engine} engine
     * @param {body[]} bodies
     */
    Render.bodies = function(engine, bodies) {
        var render = engine.render;
        var options = render.options;
        var body;
        var entity;
        var i;
        var moveEntity;

        for ( i = 0; i < bodies.length; i++ ) {
            body = bodies[i];
            entity = body.entity;

            if ( !body.render.visible ) {
                continue;
            }

            if ( !body.parts ) {
                _moveEntity(options, body, body.isSleeping); 
            } else {
                // handle compound parts
                for ( k = body.parts.length > 1 ? 1 : 0; k < body.parts.length; k++ ) {
                    _moveEntity(options, body.parts[k], body.isSleeping);                
                }
            }
        }
    };


    /**
     * Description
     * @method _createCanvas
     * @private
     * @param {} width
     * @param {} height
     * @return canvas
     */
    var _createCanvas = function( width, height ) {
        var canvas = document.createElement('canvas');
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

        entity.matterMoved = true;
        entity.x = part.position.x - ( entity._w / 2 );

        entity.matterMoved = true;
        entity.y = part.position.y - ( entity._h / 2 );

        debug.moveEntity( entity );

        _rotateEntity( entity,  part.angle );

    };

    //initial support only for top left origin
    var _rotateEntity = function( entity, angle ) {
        entity.rotation = 0;

        if(angle === 0) {
            return;
        }
            
        entity.rotation = Crafty.math.radToDeg( angle );

        debug.rotateEntity( [ entity, angle] );
    };

})(CraftyRenderer);