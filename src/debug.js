// Creates a rectangle filling the Matter world area
function worldDebug() {
	
	if( debug ){
		Crafty.e('Actor, Color')
			.attr({
			x: 0,
			y: 0,
			w: engine.world.bounds.max.x,
			h: engine.world.bounds.max.y,
			alpha : 0.5
		})
		.color('green');
	}
}
	
// generates a debug body from the matter body 
function generateDebugBody( body ) {

	var frameUnit = 2;// in pixels

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
		h: body.vertices[2].y - body.vertices[0].y
	});

	debugBody.origin( 'center' );

	debugBodyBody.color('blue');
	debugBodyBody.alpha = 0.5;
	debugBodyBody.z = debugBody._z + 1;
	debugBodyBody.origin( 'center' );

	debugBodyTopFrame.color('blue');
	debugBodyTopFrame.h = frameUnit;
	debugBodyTopFrame.z = debugBody._z + 1;
	debugBodyTopFrame.origin( 'center' );

	debugBodyRightFrame.color('blue');
	debugBodyRightFrame.x = debugBodyBody._x + ( debugBodyBody._w - frameUnit );
	debugBodyRightFrame.w = frameUnit;
	debugBodyRightFrame.z = debugBody._z + 1;
	debugBodyRightFrame.origin( 'center' );

	debugBodyDownFrame.color('blue');
	debugBodyDownFrame.y = debugBodyBody._y + ( debugBodyBody._h - frameUnit );
	debugBodyDownFrame.h = frameUnit;
	debugBodyDownFrame.z = debugBody._z + 1;
	debugBodyDownFrame.origin( 'center' );

	debugBodyLeftFrame.color('blue');
	debugBodyLeftFrame.w = frameUnit;
	debugBodyLeftFrame.z = debugBody._z + 1;
	debugBodyLeftFrame.origin( 'center' );

	return debugBody;
}