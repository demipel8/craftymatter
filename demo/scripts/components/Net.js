Crafty.c('Net', {
	init : function () {
		this.requires( 'Actor, Matter, NetSprite');

		this.attr({
			x: 390,
			y: 300,
			w: 20,
			h: 300,
			matter: {
				isStatic: true
			}
		})

		this.transition = Crafty.e('FieldTransition');
		this.attach( this.transition );

		this._body.restitution = 1;
	}
});