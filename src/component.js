/**
 * Matter component, creates the bodies in the Matter world and links the to its entities.
 */
Crafty.c( 'Matter', ( function() {

	var _newBody = function _newBody( attr ) {

        var coords = {
            x: attr.x || 0,
            y: attr.y || 0,
            w: attr.w || 0,
            h: attr.h || 0
        };

		this.origin( ( coords.w / 2 ), ( coords.h / 2 ) );

		entities.push( this );

		var options = {};
		if ( !!attr.matter ) {
			options = attr.matter;
		}

		Common.extend(options, this._matter, true);

		if ( !!options.shape && options.shape === 'circle' ) {
			var radius = coords.w / 2;

			if ( !!attr.matter.radius ) {
				radius = attr.matter.radius;
			}

			this._body = Bodies.circle( coords.x + ( coords.w / 2 ), coords.y + ( coords.h / 2 ), radius, options );

		} else {

			this._body = Bodies.rectangle( coords.x + ( coords.w / 2 ), coords.y + ( coords.h / 2 ), coords.w, coords.h,
				options );
		}

		this._body.entity = this;

		this.matterMoved = false;

		this._debugBody = debug.generateDebugBody( this._body );

		if ( !!attr.rotation ) {
			Body.setAngle( this._body, Crafty.math.degToRad( attr.rotation ) );
		}

		World.addBody( engine.world, this._body );
	};

    return {

		init: function() {
			this._matter = {};

			this.requires( '2D' );

			this.bind( 'Change', function( attr ) {
				if ( !attr ) {
					return;
				}
				if ( attr.hasOwnProperty( 'x' ) && attr.hasOwnProperty( 'y' ) ) {
					return _newBody.call( this, attr );
				}
			}.bind( this ) );

			this.bind( 'Move', function( ) {

				if ( !this.matterMoved && typeof this._body !== 'undefined' ) {
					Body.setPosition ( this._body, {
						x: this._x + this._w / 2,
						y: this._y + this._h / 2
					} );

				} else {
					this.matterMoved = false;
				}

			}.bind( this ) );

			this.bind( 'Rotate', function( ) {

				if ( !this.matterMoved ) {

					Body.setAngle ( this._body, Crafty.math.degToRad( this.rotation ) );

				} else {
					this.matterMoved = false;
				}
			}.bind( this ) );
		},

		remove: function( ) {
	        World.remove( engine.world, this._body, true );

			if ( typeof this._debugBody !== 'undefined' ) {
				this._debugBody.destroy();
			}
	    },

    	matter: function (options) {
    		Common.extend(this._matter, options, true);

    		return this;
    	}
	};

} ) () );
