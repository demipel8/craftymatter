Crafty.c('Floor', {
	init : function() {
		this.requires( 'Actor, Matter');

		this.attr({
			x: 0,
			y: Crafty.viewport.height,
			w: Crafty.viewport.width,
			h: 10,
			matter: {
				isStatic: true
			}
		});

		this._body.label = 'floor';
	}
})