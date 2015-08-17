Crafty.scene('load', function() {

	Crafty.paths({ audio: "./assets/", images: "./assets/" });

	var assetsObj = {
		"audio": {
			"audioThug" : ["audioThug.mp3"]
		},
		"images": ['background.jpg', 'ghost.png', 'ball.png', 'net.jpg', 'glasses.png', 'joint.png', 'hat.png'],
		"sprites": {
		}
	};

	Crafty.load(assetsObj, // preload assets
	    function() { //when loaded

	    	Crafty.sprite(100, 130 , "assets/ghost.png", {
			    PlayerSprite: [0,0]
			});

			Crafty.sprite(99, 96 , "assets/ball.png", {
			    BallSprite: [0,0]
			});

			Crafty.sprite(191, 200 , "assets/net.jpg", {
			    NetSprite: [0,0]
			});

			Crafty.sprite(400, 80 , "assets/glasses.png", {
			    GlassesSprite: [0,0]
			});

			Crafty.sprite(400, 117 , "assets/joint.png", {
			    JointSprite: [0,0]
			});

			Crafty.sprite(539, 338 , "assets/hat.png", {
			    HatSprite: [0,0]
			});

	        Crafty.scene("play"); //go to main scene
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