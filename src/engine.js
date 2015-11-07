Engine.run = function( engine, time ) {

	if ( !engine.enabled ) {
        return;
	}

	Events.trigger( engine, 'beforeTick', event );
	Events.trigger( engine, 'tick', event );
    Engine.update( engine, time.dt, 1 );

    // Trigger events that may have occurred during the step
    _triggerCollisionEvents( engine );
    _triggerMouseEvents( engine );

    //Render
	Engine.render( engine );

	Events.trigger( engine, 'afterTick', event );
};

/**
     * Triggers mouse events
     * @method _triggerMouseEvents
     * @private
     * @param {engine} engine
     */
    var _triggerMouseEvents = function( engine ) {
        var mouse = engine.input.mouse,
            mouseEvents = mouse.sourceEvents;

        if ( mouseEvents.mousemove ) {
            Events.trigger( engine, 'mousemove', {
                mouse: mouse
            } );
        }

        if ( mouseEvents.mousedown ) {
            Events.trigger( engine, 'mousedown', {
                mouse: mouse
            } );
        }

        if ( mouseEvents.mouseup ) {
            Events.trigger( engine, 'mouseup', {
                mouse: mouse
            } );
        }

        // Reset the mouse state ready for the next step
        Mouse.clearSourceEvents( mouse );
    };

    /**
     * Triggers collision events
     * @method _triggerMouseEvents
     * @private
     * @param {engine} engine
     */
    var _triggerCollisionEvents = function( engine ) {
        var pairs = engine.pairs;

        if ( pairs.collisionStart.length > 0 ) {
            Events.trigger( engine, 'collisionStart', {
                pairs: pairs.collisionStart
            } );
        }

        if ( pairs.collisionActive.length > 0 ) {
            Events.trigger( engine, 'collisionActive', {
                pairs: pairs.collisionActive
            } );
        }

        if ( pairs.collisionEnd.length > 0 ) {
            Events.trigger( engine, 'collisionEnd', {
                pairs: pairs.collisionEnd
            } );
        }
    };
