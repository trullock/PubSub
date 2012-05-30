var Bus = (function () {
	"use strict";
	
	/*
	A function to represent a queue
	Created by Stephen Morley - http://code.stephenmorley.org/ - and released under the terms of the CC0 1.0 Universal legal code: http://creativecommons.org/publicdomain/zero/1.0/legalcode
	*/
	var Queue = function () {
		var queue = [];
		var offset = 0;
		var me = {};
		
		function getLength() {
			return (queue.length - offset);
		}

		me.isEmpty = function () {
			return (queue.length === 0);
		};
		
		me.enqueue = function (item) {
			queue.push(item);
		};

		me.dequeue = function () {
			if (queue.length === 0)
				return undefined;

			var item = queue[offset];

			if (++offset * 2 >= queue.length) {
				queue = queue.slice(offset);
				offset = 0;
			}

			return item;
		};
		
		me.peek = function () {
			return (queue.length > 0 ? queue[offset] : undefined);
		};
		
		return me;
	};


	var me = {};
	var handlers = {};
	var queue = new Queue();

	function processQueue() {
		while (!queue.isEmpty()) {
			var action = queue.dequeue();
			action.call(null);
		}
	}

	function enqueue(handler, args) {
		queue.enqueue(function () {
			handler.apply(null, args);
		});
	}

	me.subscribe = function (type, func) {
		if (!handlers[type])
			handlers[type] = [];

		for (var i = 0; i < handlers[type].length; i++)
			if(handlers[type][i] === func)
				throw "Handler already subscribed to this message";
		
		handlers[type].push(func);

		return this;
	};
	
	me.publish = function (type) {
		if (!handlers[type])
			return;

		for (var i in handlers[type]) {
			var args = [];
			for (var j = 1; j < arguments.length; j++) {
				args.push(arguments[j]);
			}

			enqueue(handlers[type][i], args);
		}

		while (!queue.isEmpty())
			processQueue();

		return this;
	};
	
	me.unsubscribeAll = function(type){
		if(type)
			delete handlers[type]
		else
			handlers = {};
	};

	me.unsubscribe = function(handler){
		for(var type in handlers){
			for(var i in handlers[type]){
				if(handlers[type][i] === handler){
					handlers[type].splice(i, 1);
					if(handlers[type].length === 0)
						delete handlers[type];
					return;
				}
			}
		}
	};
	
	return me;

});