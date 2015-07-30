Crafty.scene('load', function() {

	Crafty.paths({ audio: "./assets/", images: "./assets/" });

	var assetsObj = {
		"audio": {
            "player0" : ["player-0.mp3"],
            "player1" : ["player-1.mp3"],
            "player2" : ["player-2.mp3"],
            "player3" : ["player-3.mp3"]
		},
		"images": ['background.jpg', 'portero.png', 'ball.png' ],
		"sprites": {
		}
	};

	Crafty.load(assetsObj, // preload assets
	    function() { //when loaded

			Crafty.sprite(960, 640 , "assets/background.jpg", {
                background: [0,0]
			});

	    	Crafty.sprite(200, 200 , "assets/portero.png", {
			    PlayerSprite: [0,0]
			});

			Crafty.sprite(100, 100 , "assets/ball.png", {
			    BallSprite: [0,0]
			});

	        Crafty.scene("menu"); //go to main scene
	    },

	    function(e) { //progress
	    },

	    function(e) { //uh oh, error loading
	    }
	);
});

/*,
	            "map": { 
	            	"front": [0,0], 
	            	"movement1": [0,1], 
	            	"movement2": [0,2], 
	            	"movement3": [0,3], 
	            	"movement4": [0,4], 
	            	"attack1": [1,1], 
	            	"attack2": [1,2], 
	            	"attack3": [1,3], 
	            	"attack4": [1,4]
	            }*/