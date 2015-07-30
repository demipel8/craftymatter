Crafty.c('Wall', {
	init : function() {
		this.requires( 'Actor, Matter');

		this.attr({
			x: -30,
			y: - Crafty.viewport.height,
			w: 30,
			h: Crafty.viewport.height * 2,
			matter: {
				isStatic: true
			}
		});

		this._body.label = 'wall';
	}
})