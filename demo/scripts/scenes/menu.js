/**
 * Created by demi on 7/29/15.
 */
Crafty.scene('menu', function() {
    var possiblePlayers = [
        {
            name : 'Los cabrones',
            color : 'yellow',
            audio : 'player0',
            controls : {
                left : 'A',
                right : 'D',
                jump : 'W'
            }
        },
        {
            name : 'Los champiñones',
            color : 'red',
            audio : 'player1',
            controls : {
                left : 'J',
                right : 'L',
                jump : 'I'
            }
        },
        {
            name : 'Los gilis',
            color : 'green',
            audio : 'player2',
            controls : {
                left : 'LEFT_ARROW',
                right : 'RIGHT_ARROW',
                jump : 'UP_ARROW'
            }
        },
        {
            name : 'Los Cañones',
            color : 'blue',
            audio : 'player3',
            controls : {
                left : 'NUMPAD_4',
                right : 'NUMPAD_6',
                jump : 'NUMPAD_8'
            }
        }
    ]

    Crafty.background('#EDC9AF'); //desert sand color

    Crafty.e('Actor, Text')
        .attr({
            x : Crafty.viewport.width * 0.2,
            y : Crafty.viewport.height * 0.1,
            w: Crafty.viewport.width * 0.6,
            h: 100
        })
        .textFont({ size: '20px', weight: 'bold' })
        .textColor('white')
        .css({ 'text-align' : 'center'})
        .unselectable()
        .text('Don\'t let the ball touch your gound!' );


    Crafty.e('Actor, Text')
        .attr({
            x : Crafty.viewport.width * 0.2,
            y : Crafty.viewport.height * 0.2,
            w: Crafty.viewport.width * 0.6,
            h: 100
        })
        .textFont({ size: '20px', weight: 'bold' })
        .textColor('white')
        .css({ 'text-align' : 'center'})
        .unselectable()
        .text('Number of players:' );

    Crafty.e('SelectableMenuItem')
        .attr({
            x : Crafty.viewport.width * 0.25 - 50,
            y : Crafty.viewport.height * 0.4
        })
        .setText( '2' );

    Crafty.e('SelectableMenuItem')
        .attr({
            x : Crafty.viewport.width * 0.5 - 50,
            y : Crafty.viewport.height * 0.4
        })
        .setText( '3' );

    Crafty.e('SelectableMenuItem')
        .attr({
            x : Crafty.viewport.width * 0.75 - 50,
            y : Crafty.viewport.height * 0.4
        })
        .setText( '4' );

    var playButton = Crafty.e('Actor, Text, Mouse')
        .attr({
            x : Crafty.viewport.width * 0.2,
            y : Crafty.viewport.height * 0.75,
            w: Crafty.viewport.width * 0.6,
            h: 100
        })
        .textFont({ size: '70px', weight: 'bold' })
        .textColor('white')
        .css({ 'text-align' : 'center'})
        .unselectable()
        .text('PLAY' )
        .bind( 'Click', function() {
            if( this.ready ) {
                Crafty.scene( 'play', possiblePlayers.slice(0, playButton.numberOfPlayers));
            }
        });

    playButton.ready = false;

    Crafty.bind( 'ready', function ( numberOfPlayers ) {
        playButton.numberOfPlayers = numberOfPlayers;
        playButton.ready = true;
    }.bind( this ) );

    Crafty.bind( 'unready', function ( ) {
        playButton.numberOfPlayers = 0;
        playButton.ready = false;
    } );

});
