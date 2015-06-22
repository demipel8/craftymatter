/**
 * Matter component, creates the bodies in the Matter world and links the to its entities.
 * 
 */
Crafty.c('Matter', (function() {

	var _newBody = function _newBody( attr ) {

		this.origin( ( attr.w / 2 ), ( attr.h / 2 ) );

		entities.push(this);

		var options = {};
		if( !!attr.matter ) {
			options = attr.matter;
		}

		this._body = Bodies.rectangle( attr.x + ( attr.w / 2 ), attr.y + ( attr.h / 2 ), attr.w, attr.h, options );
		this._body.entity = this;

		this.matterMoved = false;

		if(debug){
			this._debugBody = generateDebugBody( this._body );
		}


		if ( !!attr.rotation ) {
			Body.setAngle( this._body, Crafty.math.degToRad( attr.rotation ) );
			//this.matterMoved = true;
		}

		World.addBody( engine.world, this._body );
	};

    return {

		init: function () {

			this.requires( '2D' );

			this.bind('Change', function(attr) {
				if ( !attr ) {
					return;
				}
				if ( attr.hasOwnProperty('x') && attr.hasOwnProperty('y') ) {
					return _newBody.call(this, attr);
				}
			}.bind(this));

			this.bind('Move', function( oldAttr ) {

				if( !this.matterMoved ) {
					Matter.Body.setPosition (this._body, {
						x: this._x + this._w / 2,
						y: this._y + this._h / 2
					});
				} else {
					this.matterMoved = false;
				}
				

			}.bind(this));
		},

		remove: function ( entityDestroyed ) {
	        World.remove( engine.world, this._body, true );

			if( debug ) {
				this._debugBody.destroy();
			}
	    }
	};

})());
