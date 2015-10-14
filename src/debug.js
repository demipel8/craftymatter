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
