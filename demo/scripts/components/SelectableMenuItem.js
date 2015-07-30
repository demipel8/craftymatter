/**
 * Created by demi on 7/29/15.
 */
Crafty.c( 'SelectableMenuItem', {

    init: function() {

        this.requires( 'Actor, Color, Mouse' );

        this.attr({
            w: 100,
            h: 100
        });

        this.text = Crafty.e('Actor, Text')
            .attr({
                y: 5,
                w: 100,
                h: 100
            })
            .textFont({ size: '80px', weight: 'bold' })
            .textColor('white')
            .css({ 'text-align' : 'center'})
            .unselectable();

        this.attach( this.text );
        this.selected = false;

        this.css({'border-radius' : '7px'});
        this.color('blue');
        this.alpha = 0;

        this.bind('MouseOver', mouseEnter.bind( this ) );
        this.bind('MouseOut', mouseLeave.bind( this ) );
        this.bind('Click', click.bind( this ) );

        function mouseEnter() {
            this.alpha = 0.6;
        }

        function mouseLeave() {
            this.alpha = 0;
        }

        this.bind('unselect', function() {
            if ( this.selected ) {
                click.call( this );
            }
        });

        function click() {
            if ( !this.selected ) {
                Crafty.trigger('unselect');
                this.color( 'red' );
                this.selected = true;
                this.unbind('MouseOver');
                this.unbind('MouseOut');
                Crafty.trigger( 'ready', this.text._text );
            } else {
                this.color( 'blue' );
                mouseLeave.call( this );
                this.selected = false;
                this.bind('MouseOver', mouseEnter.bind( this ) );
                this.bind('MouseOut', mouseLeave.bind( this ) );
                Crafty.trigger( 'unready' );
            }
        }
    },

    setText : function( text ) {
        this.text.text( text );
        return this;
    }
});