# craftyMatter

> Crafty Wrapper for Matter.js physics library

**Try the [Demo](https://craftymatter.herokuapp.com/)!** 

## install 

Install the required packages:

```js
npm install craftyjs matter-js crafty-matter
```

**temporary fix** : Do to working with the edge build version of matter I had to make a couple fixes. So the 
recommended matter lib version is on the `libs` folder.

Load the script on your HTML file:

```html
<script type="text/javascript" src="../path/to/craftyjs"></script>
<script type="text/javascript" src="../path/to/matter-js"></script>
<script type="text/javascript" src="../path/to/crafty-matter"></script>
```
And you're ready to go!

## Usage

### Init matter

Launch `Crafty.Matter.Init` passing an options object [optional].

```js
Crafty.Matter.init({
	debug : true,
	gravity : {
		x : 0,
		y : 0.098
	}
});
```

Options suported:

*debug*: will create a debug body for each entity containing the `Matter` component. It will
also highlight the physic world with a light green color.

*gravity*: by default { x: 0, y: 0 }

*size*: matter world size. by default { x: Crafty.viewport.width, y: Crafty.viewport.height }

*hasBounds*: set the drawing view region to the bounds object.

### Component

```js
Crafty.e( '2D, DOM, Matter' )
	.attr({
		x : Crafty.viewport.width * 0.45,
		y : Crafty.viewport.height * 0.1,
		w : Crafty.viewport.width * 0.1,
		h : Crafty.viewport.width * 0.1,
		rotation : 15,
		matter : {
			isStatic : true
		}
	});
```

It will create a Matter rectangle body with the dimensions in the attr object. The matter sub-object allows you to set matter specific config to your entity body.

Objects rotation origin will automatically to center, to fit Matter-js. Changing the origin will give unexpected results.

### Circle

```js
Crafty.sprite(100, 100, 'path/to/image.extension', { circleSprite : [0, 0] } } );

Crafty.e('Actor, Matter, circleSprite')
	.attr({
		x : Crafty.viewport.width * 0.8625,
		y : Crafty.viewport.height * 0.1,
		w : 100,
		h : 100,
		matter : {
			shape : 'circle',
			radius : 50
		}
	});
```
If `radius` property is no specified. It will use the `w` property divided by 2.

### Modify matter directly

The matter body reference for an entity with the `Matter` component will be the property `_body`. Use it to apply matter changes directly.

```js
var entity = Crafty.e( '2D, DOM, Matter' )
	.attr({
		x : 300,
		y : 200,
		w : 100,
		h : 100,
	});

Matter.Body.setAngle( entity._body, Crafty.math.degToRad( 90 ) );
```

Also the `Crafty.Matter` contains a reference to `engine` and `world` matter components.

```js

Matter.World.add( 
	Crafty.Matter.world, 
	Matter.Constraint.create({
	    pointA: { x: 300, y: 100 },
	    bodyB: entity._body
	})
);
```

## TODO

- Finish Demo
- Bodies.polygon
- Bodies.trapezoid
- Bodies.fromVertices