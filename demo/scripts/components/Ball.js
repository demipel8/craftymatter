Crafty.c( 'Ball', {

	init: function() {
		this.requires( 'Actor, Matter, BallSprite');
		this.attr({
			x : 450,
			y : 100,
			w : 50,
			h : 50,
			matter: {
				shape : 'circle',
				restitution : 0.8
			}
		});

		this._body.label = 'ball';
		//this.position = 'right';
		this.touchedByPlayer = false;
			
	}
});