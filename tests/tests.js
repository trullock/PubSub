$(document).ready(function(){

	module("Instances");
	
	test("multiple instances shouldnt conflict", function() {
		var bus1 = new Bus();
		bus1.subscribe("name", function(){ 
			ok(true, "it worked");
		});
		
		var bus2 = new Bus();
		bus2.subscribe("name", function(){ 
			ok(false, "it didnt work");
		});
		
		bus1.publish("name");
		expect(1);
	});
	
	
	module("Subscribing");

	test("single subscription should fire on publish", function() {
		var bus = new Bus();
		bus.subscribe("name", function(){ 
			ok(true, "it worked");
		});
		bus.publish("name");
		expect(1);
	});
	
	test("multiple subscriptions should fire on publish", function() {
		var bus = new Bus();
		bus.subscribe("name", function(){ 
			ok(true, "it worked");
		});
		bus.subscribe("name", function(){ 
			ok(true, "it also worked");
		});
		bus.publish("name");
		expect(2);
	});
	
	test("multiple subscriptions should fire in order of subscription", function() {
		var bus = new Bus();
		var order = [];
		bus.subscribe("name", function(){ 
			order.push(0);
		});
		bus.subscribe("name", function(){ 
			order.push(1);
		});
		bus.publish("name");
		equal(0, order[0], "first fired first")
		equal(1, order[1], "second fired second")
	});
	
	module("publishing");
	
	test("nested publishing should fire handlers in correct order", function() {
		var bus = new Bus();
		var order = [];
		
		bus.subscribe("a", function(){ 
			order.push(0);
			bus.publish("b");
		});
		bus.subscribe("a", function(){ 
			order.push(1);
			bus.publish("c");
		});
		
		bus.subscribe("b", function(){ 
			order.push(2);
			bus.publish("d");
		});
		bus.subscribe("b", function(){ 
			order.push(3);
		});
		
		bus.subscribe("c", function(){ 
			order.push(4);
		});
		
		bus.subscribe("d", function(){ 
			order.push(5);
		});
		
		bus.publish("a");
		
		equal(0, order[0], "first fired first")
		equal(1, order[1], "second fired second")
		equal(2, order[2], "third fired third")
		equal(3, order[3], "fourth fired fourth")
		equal(4, order[4], "fifth fired fifth")
		equal(5, order[5], "sixth fired sixth")
	});
	
	test("arguments should be passed", function() {
		var bus = new Bus();
		bus.subscribe("x", function(a, b, c, d){ 
			equal(1, a);
			equal(2, b);
			equal(3, c);
			equal(4, d);
		});
		bus.publish("x", 1, 2, 3, 4);
		expect(4);
	});
	
	
	module("unsubscribing");

	test("unsubscribe all should remove all subscriptions", function() {
		var bus = new Bus();
		bus.subscribe("x", function(){ 
			ok(false, "it didnt work");
		});
		bus.subscribe("y", function(){ 
			ok(false, "it also didnt work");
		});
		bus.unsubscribeAll();
		bus.publish("x");
		bus.publish("y");
		expect(0);
	});
	
	test("named unsubscribe should remove all subscriptions for that name", function() {
		var bus = new Bus();
		bus.subscribe("x", function(){ 
			ok(false, "it didnt work");
		});
		bus.subscribe("y", function(){ 
			ok(true, "it worked");
		});
		bus.unsubscribeAll("x");
		bus.publish("x");
		bus.publish("y");
		expect(1);
	});
	
	test("specific unsubscribe should remove only that handler", function() {
		var bus = new Bus();
		var xFunc = function(){ 
			ok(false, "it didnt work");
		};
		bus.subscribe("x", xFunc);
		bus.subscribe("y", function(){ 
			ok(true, "it worked");
		});
		
		bus.unsubscribe(xFunc);
		
		bus.publish("x");
		bus.publish("y");
		expect(1);
	});

});