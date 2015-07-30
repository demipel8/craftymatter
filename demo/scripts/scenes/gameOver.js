Crafty.scene('gameOver', function() {

	Crafty.background('#000000');
	Crafty.viewport.zoom(1, 400, 300, 0);

	var endText = Crafty.e('Actor, Text')
		.attr({
			x : 200,
			y : 260,
			w : 400,
			h : 100
		})
		.textFont({ size: '40px', weight: 'bold' })
		.textColor('white')
		.text('Game Over...')
		.css({'text-align' : 'left'});

	Crafty.e("Delay").delay(function() {
	  endText.text('Game Over... Ball WINS!'/*Bitch!'*/)
	}, 1500, 0);

	Crafty.e('Actor, Text')
		.attr({
			x : 50,
			y : 500,
			w : 700,
			h : 100
		})
		.textFont({ size: '50px', weight: 'bold' })
		.textColor('white')
		.text('Use craftymatter!')
		.css({'text-align' : 'center'});

	
	Crafty.e("Delay").delay(function() {
	  Crafty.background( '#'+Math.floor(Math.random()*16777215).toString(16) );
	}, 500, -1);
});