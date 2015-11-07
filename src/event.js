//Propagate engine events onto targets 

var event = (function () {
	var propagateEvents = function() {
		['collisionStart', 'collisionEnd', 'collisionActive'].forEach(function (collisionEvent) {
			Events.on(engine, collisionEvent, function (e) {
			    var pairs = e.pairs;

			    for (var i = 0; i < pairs.length; i++) {
			        var pair = pairs[i];
			        var craftyEvent = collisionEvent.charAt(0).toUpperCase() + collisionEvent.slice(1);

			        pair.bodyA.entity.trigger(craftyEvent, {
			            target: pair.bodyB.entity,
			            event: e
			        });
			        pair.bodyB.entity.trigger(craftyEvent, {
			            target: pair.bodyA.entity,
			            event: e
			        });
			    }
			});
		});
	};

	return {
		propagateEvents: propagateEvents
	};
})();