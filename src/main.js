/**
 * Crafty wrapper fot MatterJS
 * @author  DEMI - Alvaro Martinez de Miguel
 */
(function(Matter){
	'use strict';

	var engine;

	//Matter variables
	var Bodies		= Matter.Bodies;
	var Body		= Matter.Body;
	var Bounds		= Matter.Bounds;
	var Common		= Matter.Common;
	var Composite 	= Matter.Composite;
	var Engine 		= Matter.Engine;
	var Events 		= Matter.Events;
	var Mouse 		= Matter.Mouse;
	var Vector 		= Matter.Vector;
	var World 		= Matter.World;

	var debug = generateDebug( false );

	var entities = [];
	var RenderingMode = '2D, Canvas';

	/* jshint ignore:start */
	include "engine.js"
	include "renderer.js"
	include "namespaceExtension.js"
	include "component.js"
	include "debug.js"
	/* jshint ignore:end */

})(Matter);