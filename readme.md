# PubSub

Simple publisher-subscriber bus with handler invokation queuing and unlimited argument support.

## Subscribing

<pre>
Bus.Subscribe("message name", function(){
	// do stuff
});
</pre>


## Publishing

<pre>
Bus.Publish("message name");
</pre>


## Passing Arguments

You can pass unlimited arguments:

<pre>
Bus.Publish("message name", x, y, z);

Bus.Subscribe("message name", function(arg1, arg2, arg3){
	// do stuff
});
</pre>

## Queuing

When a message is published, all handlers for that message fire in the order they were subscribed.

If any of the handlers publish new messages, the handlers for this message will not be executed until the original set of handlers have been executed. This rule is obeyed recursively. Handler executions are continuously enqueued.

## Unsubscribing

You can remove all handlers for all messages:

<pre>
Bus.UnsubscribeAll();
</pre>

You can remove all handlers for a given message:

<pre>
Bus.UnsubscribeAll("message name");
</pre>

You can remove a specific handler:

<pre>
var handlerFunc = function() { };
Bus.Subscribe("message name", handlerFunc);

Bus.Unsubscribe(handlerFunc);
</pre>