window.onload = function() {
	'use strict';

	var Game = {
	    _res: {},
	    start: function () {
	        Crafty.init( 800, 600, document.getElementById( 'game' ) );
	        Crafty.scene('load');
	    },

	    res : function () {
	        return this._res;
	    }
	};

	Game.start();

}