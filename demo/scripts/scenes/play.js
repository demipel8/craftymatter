/**
 * Created by demi on 7/28/15.
 */
Crafty.scene('play', function( config ) {
    var ball;
    var players = [];
    var time = 5000;
    var teams = [];
    var LOSE_PERCENTAGE = 75 / config.length;

    Crafty.background('#EDC9AF'); //desert sand color
    var background = Crafty.e('Actor, background').attr( { w: Crafty.viewport.width, h: Crafty.viewport.height});

    Crafty.Matter.init({
        debug: false,
        gravity: {
            x: 0,
            y: 2.5
        }
    });

    Crafty.e( 'Floor' );
    Crafty.e( 'Wall' ); //leftWall
    Crafty.e( 'Wall' )  //rightWall
        .attr({
            x : Crafty.viewport.width
        });

    config.forEach( function( team, index, array ) {
        teams.push( Crafty.e('Team')
            .color( team.color )
            .name( team.name )
            .attr({
                x: ( Crafty.viewport.width / array.length ) * index,
                w: ( Crafty.viewport.width / array.length )
            })
        );

        players.push( Crafty.e( 'Player' )
            .attr({
                x : teams[ index ]._x
            })
            .controls( team.controls.left, team.controls.right, team.controls.jump )
            .team( team.color )
            .audio( team.audio )
        );
    });

    Crafty.trigger('updateScores');

    ball = Crafty.e( 'Ball' );

    Matter.Events.on(Crafty.Matter.engine, 'collisionStart', function(event) {
        var pairs = event.pairs;

        for (var i = 0; i < pairs.length; i++) {
            var pair = pairs[i];
            var labels = pair.bodyA.label + ' : ' + pair.bodyB.label;

            if (~labels.indexOf('player') && ~labels.indexOf('ball')) {
                player_ballCollision( pair );
            }
        }

        if( ~labels.indexOf('floor') && ~labels.indexOf('ball') ){

            var teamsFloorCollision = teams.map( function( team ) {
                return ( ball._x >= team._x && ball._x <= team._x + team._w ) || ( ball._x + ball._w >= team._x && ball._x + ball._w <= team._x + team._w );
            });

            if( teamsFloorCollision.reduce(function( prev, cur ) { return prev + cur; })  === 1 ) {
                teams.forEach( function( team, index ) {
                    if( teamsFloorCollision[index] ) {
                        if(teams.length === 2) {
                            collapseOn2Teams( team, index, 0.1 );
                        } else {
                            collapseTeam( team, index, 0.1 );

                        }

                        if( team.score.value < LOSE_PERCENTAGE ) {
                            killTeam( index );
                        }
                    }
                });
            }

            ball.y = 100;
            ball.x = Math.floor( ( Math.random() * Crafty.viewport.height * 0.9 ) + Crafty.viewport.height * 0.1 );
            Matter.Body.setVelocity( ball._body, {x : ball._body.velocity.x, y : 0 });

        }
    });

    function player_ballCollision( pair ) {
        var playerBody = pair.bodyB;
        var acceleration = 0.05;

        if(~pair.bodyA.label.indexOf('player')) {
            playerBody = pair.bodyA;
        }

        if(playerBody.position.x > ball._body.position.x) {
            acceleration = - 0.05;
        }

        Crafty.audio.play( playerBody.entity.audio );
        ball.accelerate( acceleration );
        ball.touchedByPlayer = true;
    }

    function collapseTeam( team, index, percentageToErease ) {
        var percentage = team._w * percentageToErease;

        team.w = team._w - percentage;

        //expands neighbors
        [ ( index - 1 + teams.length) % teams.length, (index + 1) % teams.length].forEach( function( value ) {
            teams[ value ].w = teams[ value ]._w + percentage/2 ;
        });

        reorderTeams();
    }

    function collapseOn2Teams( team, index, percentageToErease ) {
        var percentage = team._w * percentageToErease;

        team.w = team._w - percentage;
        teams[ (index + 1) % teams.length ].w = teams[ (index + 1) % teams.length  ]._w + percentage;

        reorderTeams();

        Crafty.trigger('updateScores');

    }

    function reorderTeams() {
        teams.forEach( function( value, index ) {
            if( !index ) {
                teams[ index ].x = 0
            } else {
                teams[ index ].x = teams[ index - 1 ]._x + teams[ index - 1 ]._w ;
            }
        });
        Crafty.trigger('updateScores');
    }

    function killTeam( index ) {
        collapseTeam( teams[index], index, 1 );

        players[ index ].destroy();
        players.splice(index, 1);

        teams[ index ].destroy();
        teams.splice(index, 1);


        if( teams.length === 1){
            teams[0].x = 0;
            endGame();
        }
    }

    function endGame() {

        ball.x = ( Crafty.viewport.width / 2 ) - ( ball._w / 2 );
        players[0].x = ( Crafty.viewport.width / 2 ) - ( players[0]._w / 2 );
        Matter.Body.setStatic( ball._body, true );
        Matter.Body.setStatic( players[0]._body, true );

        Crafty.e('Actor, Text')
            .attr({
                x : Crafty.viewport.width * 0.2,
                y : Crafty.viewport.height * 0.4,
                w: Crafty.viewport.width * 0.6,
                h: 100
            })
            .textFont({ size: '70px', weight: 'bold' })
            .textColor('white')
            .css({ 'text-align' : 'center'})
            .unselectable()
            .text('WINNER');
    }
});