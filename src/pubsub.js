var Bus = (function () {

	var me = {};
	var handlers = {};
	var queue = new Queue();

	me.Subscribe = function (type, func) {
		if (!handlers[type])
			handlers[type] = [];

		handlers[type].push(func);

		return this;
	};

	function processQueue() {
		while (!queue.isEmpty()) {
			var action = queue.dequeue();
			action.call(null);
		}
	};

	function enqueue(handler, args) {
		queue.enqueue(function () {
			handler.apply(null, args);
		});
	};

	me.Publish = function (type) {
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
	
	me.UnsubscribeAll = function(type){
		if(type)
			delete handlers[type]
		else
			handlers = {};
	};

	me.Unsubscribe = function(handler){
		for(var type in handlers){
			for(var i in handlers[type]){
				if(handlers[type][i] === handler){
					handlers[type].splice(i, 1);
					if(handlers[type].length == 0)
						delete handlers[type];
					return;
				}
			}
		}
	};
	
	return me;

})();