Crafty.c('FieldTransition', {
	
	init: function () {
		this.requires( '2D, Matter');

		this.attr({
			x: 400,
			y: -3000,
			w: 1,
			h: 3600
		});

		this._body.label = 'transition';
		
		Matter.Body.setDensity ( this._body, 0 );
	}
})