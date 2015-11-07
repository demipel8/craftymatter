Crafty.c('Player', {

    init: function() {
        this.requires( 'Actor, SpriteAnimation, PlayerSprite, Matter, Multiway, Keyboard' );

        this.attr({  // for the moment it requires of all the four pos parameters
            x : 0,
            y : 470,
            w : 100,
            h : 130,
            z :2,
            matter : {
                friction : 0,
                density : 0.5,
                label : 'player'
            }
        });

        this.base = Crafty.e( 'Actor, Color' )
            .attr({
                x : 0,
                y : 580,
                w : 100,
                h : 20,
                z : 2
            });

        this.attach( this.base );
        this.z = this._z + 1;

        this._body.label = 'player';
    },

    controls : function ( left , right, jump ) {
        var controlsObject = {};
        controlsObject[ left ] = 180;
        controlsObject[ right ] = 0;
        controlsObject[ jump ] = 270;

        this.multiway( 15, controlsObject );
        return this;

    },

    team : function ( color ) {
        this.base.color( color );
        return this;
    },

    audio : function ( audio ) {
        this.audio = audio;
        return this;
    }
});