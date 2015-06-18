#craftyMatter

> Crafty Wrapper for Matter.js physics library

##install 

##Usage

###Init matter

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

###Component

```js
Crafty.e('2D, DOM, Matter')
	.attr({
		x : Crafty.viewport.width * 0.45,
		y : Crafty.viewport.height * 0.1,
		w : Crafty.viewport.width * 0.1,
		h : Crafty.viewport.width * 0.1
	});
```

It will create a Matter rectangle body with the dimensions in the attr object