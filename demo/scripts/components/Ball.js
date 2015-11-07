Crafty.c( 'Ball', {

    init: function() {
        this.requires( 'Actor, Matter, BallSprite');
        this.attr({ // for the moment it requires of all the four pos parameters
            x : 0,
            y : 100,
            w : 50,
            h : 50,
            matter: {
                shape : 'circle',
                restitution : 0.8
            }
        });

        this._body.label = 'ball';
        //this.position = 'right';
        this.touchedByPlayer = false;

    },

    accelerate : function( x ) {
        Matter.Body.applyForce ( this._body,
            {
                x : 0,
                y : 0
            },
            {
                x : x,
                y : - 0.03
            }
        );
    }
});