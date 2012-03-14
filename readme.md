# PubSub

Simple publisher-subscriber bus with handler invokation queuing and unlimited argument support.

## Subscribing

<pre>
bus.subscribe("message name", function(){
	// do stuff
});
</pre>


## Publishing

<pre>
bus.publish("message name");
</pre>


## Passing Arguments

You can pass unlimited arguments:

<pre>
bus.publish("message name", x, y, z);

bus.subscribe("message name", function(arg1, arg2, arg3){
	// do stuff
});
</pre>

## Queuing

When a message is published, all handlers for that message fire in the order they were subscribed.

If any of the handlers publish new messages, the handlers for this message will not be executed until the original set of handlers have been executed. This rule is obeyed recursively. Handler executions are continuously enqueued.

## Unsubscribing

You can remove all handlers for all messages:

<pre>
bus.unsubscribeAll();
</pre>

You can remove all handlers for a given message:

<pre>
bus.unsubscribeAll("message name");
</pre>

You can remove a specific handler:

<pre>
var bus = new Bus();

var handlerFunc = function() { };
bus.subscribe("message name", handlerFunc);

bus.unsubscribe(handlerFunc);
</pre>

## Complete Example

<pre>
var bus = new Bus();

bus.subscribe("welcome", function(name){
	alert('Welcome ' + name);
});

bus.subscribe("welcome", function(name){
	if(window.console)
		console.log('Welcome ' + name);
});

bus.publish("welcome", "Zuul");
</pre>