/**
 * Crafty wrapper fot MatterJS
 * @author  DEMI - Alvaro Martinez de Miguel
 */

var Matter = ( typeof require !== 'undefined' ) ? require('matter-js') : window.Matter;

(function() {
	'use strict';

	var engine, runner;

	//Matter variables
	var Bodies		= Matter.Bodies;
	var Body		= Matter.Body;
	var Bounds		= Matter.Bounds;
	var Common		= Matter.Common;
	var Composite 	= Matter.Composite;
	var Engine 		= Matter.Engine;
	var Events 		= Matter.Events;
	var Mouse 		= Matter.Mouse;
	var Runner 		= Matter.Runner;
	var Vector 		= Matter.Vector;
	var World 		= Matter.World;

	var debug = generateDebug( false );

	var entities = [];
	var RenderingMode = '2D, DOM';

	/* jshint ignore:start */
	include "renderer.js"
	include "namespaceExtension.js"
	include "component.js"
	include "debug.js"
	include "event.js"
	/* jshint ignore:end */

})();