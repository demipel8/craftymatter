Crafty.c('Player', {

	init: function() {
		this.requires( 'Actor,  SpriteAnimation, PlayerSprite, Matter, Twoway, Keyboard' );

		this.reel('PlayerMoving', 500, 1, 0, 4)
		this.sprite( 1, 0 );
		this.twoway( 10 );
		this.flying = false;

		this.attr({
			x : 100,
			y : 470,
			w : 100,
			h : 130,
			matter : {
				friction : 0
			}
		})

		this.bind('KeyDown', function () { 
			if ( this.isDown('LEFT_ARROW') || this.isDown('RIGHT_ARROW') ) {
				this.animate('PlayerMoving', -1); 
			}

			if( this.isDown('UP_ARROW') && !this.flying) {
				this.flying = true;

				Matter.Body.applyForce ( this._body,  
					{
						x : 0,
						y : 0 
					},
					{ 
						x : 0, 
						y : - 0.5
					}
				);
			}
		}.bind( this ));

		this.bind('KeyUp', function () { 
			this.pauseAnimation();
		}.bind( this ));
		//this.animate('PlayerMoving', -1);
		
		this._body.label = 'player';

		Matter.Events.on(Crafty.Matter.engine, 'collisionStart', function(event) { 
	        var pairs = event.pairs;

	        for (var i = 0; i < pairs.length; i++) {
	            var labels = pairs[i].bodyA.label + ' : ' + pairs[i].bodyB.label;

	            if( ~labels.indexOf('player') && ~labels.indexOf('floor') ){
	            	this.flying = false;
	            }
	        }
	    }.bind( this) );
	}
})