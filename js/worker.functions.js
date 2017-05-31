var sendToFn = function(){
	if(typeof(wid) !== 'undefined'){
		anonMethodName = window[wid]["anonMethodName"];
	}

	callback_details = JSON.stringify({ method: anonMethodName, args: Array.from(arguments) });

	if(typeof(wid) !== 'undefined'){
		window[wid].postMessage(callback_details);
	}else{
		postMessage(callback_details);
	}
	return this;
}

if(typeof(window) !== 'undefined' && typeof(Worker) !== "undefined" && typeof(Proxy) !== 'undefined') {

	Worker.prototype = {};
	Worker.prototype.anonMethodName = null;
	
	// Calls a function in our worker and passes a payload of data to the worker
	Worker.prototype.sendToWorker = sendToFn;

	// auto receiver that handles running a function and passes an object of data to it.
	Worker.prototype.auto = function(func){
		this.onmessage = function(event){
			data = JSON.parse(event.data);
			if(data.method in window && typeof(window[data.method]) == typeof(function(){})){
				window[data.method].apply(this, data.args);
			}
		}

		return this;
	}
	
	function sWorker(jsfile){
		wid = "worker" + (new Date().getTime());
		window[wid] = new Worker(jsfile).auto();
		
		return new Proxy({ id: wid }, {
			get: function(target, name) {
				window[wid]["anonMethodName"] = name;
				
				if (!(name in window[wid])) {
					return window[wid]["sendToWorker"];
				}
				
				return window[wid][name];
			},
			set: function(target, name, value) {
				console.log("I'm sorry, I can not do that Dave.");
				/*if (!(name in target)) {
					console.log("Setting non-existant property '" + name + "', initial value: " + value);
				}
				target[name] = value;*/
			}
		});
	}

}else if(typeof(Worker) !== "undefined" && typeof(Proxy) !== 'undefined'){
	var anonMethodName = null;
	// the listener will automatically call functions by name
	self.addEventListener("message", function(event) {
		data = JSON.parse(event.data);
		this[data.method].apply(this, data.args);
	}, false);
	var req = new Proxy({}, {
		get: function(target, name) {
			anonMethodName = name;
			return sendToFn;
		},
		set: function(target, name, value) {
			console.log("Not implemented");
			/*
			if (!(name in target)) {
				console.log("Setting non-existant property '" + name + "', initial value: " + value);
			}
			target[name] = value;*/
		}
	});

}
