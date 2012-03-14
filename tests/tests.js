$(document).ready(function(){

	module("Subscribing");

	test("Should be able to subscribe", function() {
		Bus.UnsubscribeAll();
		Bus.Subscribe("name", function(){ });
		expect(0);
	});
	
	test("single subscription should fire on publish", function() {
		Bus.UnsubscribeAll();
		Bus.Subscribe("name", function(){ 
			ok(true, "it worked");
		});
		Bus.Publish("name");
		expect(1);
	});
	
	test("multiple subscriptions should fire on publish", function() {
		Bus.UnsubscribeAll();
		Bus.Subscribe("name", function(){ 
			ok(true, "it worked");
		});
		Bus.Subscribe("name", function(){ 
			ok(true, "it also worked");
		});
		Bus.Publish("name");
		expect(2);
	});
	
	test("multiple subscriptions should fire in order of subscription on publish", function() {
		Bus.UnsubscribeAll();
		var order = [];
		Bus.Subscribe("name", function(){ 
			order.push(0);
		});
		Bus.Subscribe("name", function(){ 
			order.push(1);
		});
		Bus.Publish("name");
		equal(0, order[0], "first fired first")
		equal(1, order[1], "second fired second")
	});
	
	module("Publishing");
	
	test("nested publishing should fire handlers in correct order", function() {
		Bus.UnsubscribeAll();
		var order = [];
		
		Bus.Subscribe("a", function(){ 
			order.push(0);
			Bus.Publish("b");
		});
		Bus.Subscribe("a", function(){ 
			order.push(1);
			Bus.Publish("c");
		});
		
		Bus.Subscribe("b", function(){ 
			order.push(2);
			Bus.Publish("d");
		});
		Bus.Subscribe("b", function(){ 
			order.push(3);
		});
		
		Bus.Subscribe("c", function(){ 
			order.push(4);
		});
		
		Bus.Subscribe("d", function(){ 
			order.push(5);
		});
		
		Bus.Publish("a");
		
		equal(0, order[0], "first fired first")
		equal(1, order[1], "second fired second")
		equal(2, order[2], "third fired third")
		equal(3, order[3], "fourth fired fourth")
		equal(4, order[4], "fifth fired fifth")
		equal(5, order[5], "sixth fired sixth")
	});
	
	test("arguments should be passed", function() {
		Bus.UnsubscribeAll();
		Bus.Subscribe("x", function(a, b, c, d){ 
			equal(1, a);
			equal(2, b);
			equal(3, c);
			equal(4, d);
		});
		Bus.Publish("x", 1, 2, 3, 4);
		expect(4);
	});
	
	
	module("Unsubscribing");

	test("unsubscribe all should remove all subscriptions", function() {
		Bus.UnsubscribeAll();
		Bus.Subscribe("x", function(){ 
			ok(false, "it didnt work");
		});
		Bus.Subscribe("y", function(){ 
			ok(false, "it also didnt work");
		});
		Bus.UnsubscribeAll();
		Bus.Publish("x");
		Bus.Publish("y");
		expect(0);
	});
	
	test("named unsubscribe should remove all subscriptions for that name", function() {
		Bus.UnsubscribeAll();
		Bus.Subscribe("x", function(){ 
			ok(false, "it didnt work");
		});
		Bus.Subscribe("y", function(){ 
			ok(true, "it worked");
		});
		Bus.UnsubscribeAll("x");
		Bus.Publish("x");
		Bus.Publish("y");
		expect(1);
	});
	
	test("specific unsubscribe should remove only that handler", function() {
		Bus.UnsubscribeAll();
		var xFunc = function(){ 
			ok(false, "it didnt work");
		};
		Bus.Subscribe("x", xFunc);
		Bus.Subscribe("y", function(){ 
			ok(true, "it worked");
		});
		
		Bus.Unsubscribe(xFunc);
		
		Bus.Publish("x");
		Bus.Publish("y");
		expect(1);
	});

});