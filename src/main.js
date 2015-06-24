/**
 * Crafty wrapper fot MatterJS
 * @author  DEMI - Alvaro Martinez de Miguel
 */
(function(Matter){
	'use strict';

	var engine;

	//Matter variables
	var World = Matter.World;
	var Engine = Matter.Engine;
	var Bodies = Matter.Bodies;
	var Body = Matter.Body;
	var Common = Matter.Common;
	var Composite = Matter.Composite;
	var Vector = Matter.Vector;

	var debug = generateDebug( false );

	var entities = [];
	var RenderingMode = '2D, DOM';

	/* jshint ignore:start */
	include "renderer.js"
	include "namespaceExtension.js"
	include "component.js"
	include "debug.js"
	/* jshint ignore:end */

})(Matter);