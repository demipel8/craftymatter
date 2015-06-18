/**
 * Matter component, creates the bodies in the Matter world and links the to its entities.
 * 
 */
Crafty.c('Matter', (function() {

	var _newBody = function _newBody( attr ) {

		entities.push(this);

		var options = {};
		if( !!attr.matter ) {
			options = attr.matter;
		}

		this._body = Bodies.rectangle(attr.x + (attr.w / 2), attr.y + (attr.h / 2), attr.w, attr.h, options);

		if(debug){
			this._debugBody = generateDebugBody( this._body );
		}


		World.addBody(engine.world, this._body);
	};

    return {

		init: function () {
			this.bind("Change", function(attr) {
				if (!attr) {
					return;
				}
				if (attr.hasOwnProperty('x') && attr.hasOwnProperty('y')) {
					return _newBody.call(this, attr);
				}
			}.bind(this));

			this.bind("Move", function(oldAttr) {

				Matter.Body.setPosition (this._body, {
					x: this._x,
					y: this._y
				});

			}.bind(this));
		}
	};

})());
