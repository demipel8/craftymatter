Crafty.c( 'Team', {

	init: function() {

		this.requires( 'Actor, Color' );

        this.y = 0;
        this.h = Crafty.viewport.height;
        this.z = 0;
        this.alpha = 0.7;

        this.score = Crafty.e( 'Score' );
        this.score.z = this._z +1;

        this.attach( this.score );
	},

    name: function( name ) {
        this._name = name;
        return this;
    }
});