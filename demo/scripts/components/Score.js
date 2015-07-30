Crafty.c('Score', {

	init: function() {
		this.requires('Actor, Text');
		this.value = 0;
		this.attr({
			x : 40,
			y : 20,
			w: 100,
			h: 100
		});
		this.textFont({ size: '40px', weight: 'bold' });
		this.textColor('white');
		this.unselectable();

		this.updateDisplay();
		this.bind( 'updateScores', this.updateScore)
	},

	updateScore: function() {
		this.value = Math.round( (this._parent._w / Crafty.viewport.width ) * 100 );
		this.updateDisplay();

        return this;
	},

	updateDisplay: function() {
		this.text( this.value + '%' );
	}
})