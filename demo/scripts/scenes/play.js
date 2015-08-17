Crafty.scene('play', function() {
	var ball;
	var leftFieldScore;
	var rightFieldScore;
	var players = [];
	var time = 5000;
	var net;


	Crafty.background('#EDC9AF'); //desert sand color
	var background = Crafty.e('Actor, Image').image('./assets/background.jpg');

	leftFieldScore = Crafty.e('Score');
	rightFieldScore = Crafty.e('Score')
		.attr({
			x: 740
		});

	Crafty.Matter.init({
		debug: true,
		gravity: {
			x: 0,
			y: 2.5
		}
	})

	Crafty.e( 'Floor' );
	Crafty.e( 'Wall' ); //leftWall
	Crafty.e( 'Wall' )  //rightWall
		.attr({
			x : Crafty.viewport.width
		});

	net = Crafty.e( 'Net' );


	players.push( Crafty.e( 'Player' )
		.attr({
			x : 100
		})
	);

	players.push( Crafty.e( 'Player' )
		.attr({
			x : 570
		})
	);

	ball = Crafty.e( 'Ball' );

	Crafty.bind('pointRight', function() {
		rightFieldScore.addPoint();
		net.x -=  ( rightFieldScore.value * 3 );
	});

	Crafty.bind('pointLeft', function() {
		leftFieldScore.addPoint();
		net.x +=  ( leftFieldScore.value * 3 );
	});

	/*Matter.Events.on(Crafty.Matter.engine, 'afterTick', function(event) { 

		if( ball.touchedByPlayer ) { console.log(net.transition._x)
			if( ball._x < net.transition._x && ball.position == 'right' ) {
				ball.position = 'left';
				ball.touchedByPlayer = false;
				Crafty.trigger('pointRight');
			} else if ( ball._x > net.transition._x && ball.position == 'left' ) {
				ball.position = 'right';
				ball.touchedByPlayer = false;
				Crafty.trigger('pointLeft');
			}
		}

	});*/  




	Matter.Events.on(Crafty.Matter.engine, 'collisionStart', function(event) { 
        var pairs = event.pairs;

        // change object colours to show those starting a collision
        for (var i = 0; i < pairs.length; i++) {
            var pair = pairs[i];

            var labels = pair.bodyA.label + ' : ' + pair.bodyB.label;

            if( ~labels.indexOf('player') && ~labels.indexOf('ball') ){
            	player_ballCollision();
            }

            if( ~labels.indexOf('floor') && ~labels.indexOf('ball') ){

            	if( ball._x < net._x ) {
					Crafty.trigger('pointRight');
				} else {
					Crafty.trigger('pointLeft');
				}

				//ball.destroy();
				ball.y = 100;
				ball.x = 400;
				Matter.Body.setVelocity( ball._body, {x : ball._body.velocity.x, y : 0 });
            	
            }

            function player_ballCollision() {
            	var playerBody;

            	if(~pair.bodyA.label.indexOf('player')) {
            		playerBody = pair.bodyA;
            	} else {
            		playerBody = pair.bodyB;
            	}
            	

            	if(playerBody.position.x > ball._body.position.x) {
            		accelerateBall( - 0.05 );
            	} else {
            		accelerateBall( 0.05 );
            	}

            	ball.touchedByPlayer = true;
            }

            function accelerateBall( x ) {
            	Matter.Body.applyForce ( ball._body,  
					{
						x : 0,
						y : 0 
					},
					{ 
						x : x, 
						y : - 0.08
					}
				);
            }

            function gameOver() {
            	for (var i = 0; i < players.length; i++) {
            		players[i].twoway( 0 );
            	}
            	//Matter.Engine.clear( Crafty.Matter.engine );
            	Matter.Body.setStatic(ball._body, true);

            	var glasses = Crafty.e( 'Actor, GlassesSprite, Tween' )
            		.attr({
            			x: ball._x,
            			y: 0 - ball._h / 5,
            			w: ball._w,
            			h: ball._h / 5
            		})
            		.tween({
            			y : ball._y - ball._h * 0.4
            		}, time);

            	var hat = Crafty.e( 'Actor, HatSprite, Tween' )
            		.attr({
            			x: ball._x * 0.99,
            			y: 0 - ball._h / 3,
            			w: ball._w,
            			h: ball._h / 2
            		})
            		.tween({
            			y : ball._y - ball._h *0.98
            		}, time);

            	var joint = Crafty.e( 'Actor, JointSprite, Tween' )
            		.attr({
            			x: Crafty.viewport.width + ball._w / 3,
            			y: ball._y - ball._h * 0.2,
            			w: ball._w,
            			h: ball._h / 5
            		})
            		.tween({
            			x : ball._x + ball._w / 2
            		}, time);

            	/*Crafty.audio.play('audioThug', 1);
            	Crafty.viewport.zoom(3, ball._x + ball._w, ball._y + ball._h, time);

            	Crafty.e("Delay").delay(function() {
				  Crafty.scene('gameOver');
				}, time + 1000, 0);*/
            }
        }
    })
});