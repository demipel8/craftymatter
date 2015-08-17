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
		this.textFont({ size: '40px', weight: 'bold' })
		this.textColor('white');

		this.updateDisplay();
	},

	addPoint: function() {
		this.value++;
		this.updateDisplay();
	},

	updateDisplay: function() {
		this.text( this.value );
	}
})