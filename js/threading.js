// Threading class.
class Threading {
	constructor(makename) { // load in unchecked object
		/* initializing failreason as null.
		   If we have a failure to build a worker or proxy,
		   the developer needs reasonable console output and
		   the user needs a sane reason for shit not working
		*/
		this.failreason = null;
		
		// Doing check for window.
		if(typeof(window) == 'undefined'){
			console.log('Threading.js was made to work with the "window" variable. If you are using nodejs, you will need to seek something for Workers in npm.');
			this.failreason = "Not ran in a browser.";
			return undefined;
		}
		
		// Doing check for Worker()
		if(typeof(Worker) == 'undefined'){
			console.log('Worker is no supported by your JS engine. This may be due to an outdated browser.');
			this.failreason = "Worker not available.";
			return undefined;
		}
		
		// Doing check for Proxy()
		if(typeof(Proxy) == 'undefined'){
			console.log('Proxy is not supported by your JS engine. This may be due to an outdated browser.');
			this.failreason = "Proxy not available.";
			return undefined;
		}
	
		// We need an ID to track the window variable
		// that will be handling our worker.
		var wid = "worker" + (new Date().getTime());
		
		/* Determine if this is an inline Worker Function or if
		   we should assume it's a class. Any unsupported stuff
		   will default to failure.
		   
		   Upon success run Worker() and execute Worker().auto()
		   to initialize callback message processing
		*/
		if(typeof(makename) == typeof(function(){})){
			window[wid] = new Worker(this.buildblob_from_function(makename)).auto();
		}else if(typeof(makename) == "undefined"){
			window[wid] = new Worker(this.buildblob_from_class()).auto();
		}else{
			console.log('Threading.js was provided an unsupported input type. If you are trying to refernce a JS file as your worker, use the normal Worker() function. Threading.js does not support that because of problems between browsers and file location issues.');
			this.failreason = "Threading.js was provided an unsupported input type.";
			return undefined;
		}
		
		/* Once we have created the worker, let it know who it is.
		   The Worker().id is used internally to workaround traps not
		   working yet in Proxy() in firefox.
		*/
		window[wid]["id"] = wid;
		
		// return a proxy() that will manage Worker function calling.
		return new Proxy({ id: wid }, {
			// Used to handle anonymous function calling.
			get: function(target, name) {
				/* Check to see if Worker() has this function
				   if it does not, prepare to send a request to Worker()
				*/
				if (!(name in window[target['id']])) {
					// This allows Worker().sendToWorker() to know what function was requested.
					window[target['id']]["anonMethodName"] = name;
					// Return Worker().sendToWorker()
					return window[target['id']]["sendToWorker"];
				}
				
				// Return Worker().function_name
				return window[target['id']][name];
			},
			
			// Handles anonymous set calls. Might use this one day. TODO: needs evaluation
			set: function(target, name, value) {
				console.log("Setting things will not work in Threading.js yet.");
				/* maybe one day, Dave. | Example here just in case for later.
				if (!(name in target)) {
					console.log("Setting non-existant property '" + name + "', initial value: " + value);
				}
				target[name] = value;*/
			}
		});
	}
	
	
	/* helper_functions() is packed into your worker scripts.
	   It includes the magic that allows you to send requests
	   back to the window thread.
	*/
	helper_functions(){
		// Variable used in Proxy().get()<-return function(){} - More info there.
		var anonMethodName = null;
		
		// This is the listener that the Worker Thread uses to receive requests.
		self.addEventListener("message", function(event) {
			// It expects JSON formatted object data. { method: fn_name, args [...]}
			data = JSON.parse(event.data);
			
			// A check to ensure that the requested method is actually here.
			if(typeof(this[data.method]) != 'undefined'){
			
				// The call to the method here in the thread, we apply the argument array to it
				this[data.method].apply(this, data.args);
			}
		}, false);
		
		/* "window" variable is defined inside our worker to allow anonymous function callback
		   to the main thread. We use Proxy() for this witchcraft.
		*/
		var window = new Proxy({}, {
			// Used to handle anonymous function calling.
			get: function(target, name) {
				/* variable lives inside the Worker Thread's main scope. It is 
				   used to ensure we know what anonymous function to request from
				   the main thread (window). */
				anonMethodName = name;
				
				// wrap up the data and send a message back to the main thread (window).
				return function(){
					callback_details = JSON.stringify({ method: anonMethodName, args: Array.from(arguments) });
					postMessage(callback_details);
					return this;
				};
			},
			
			// Handles anonymous set calls. Might make this useful someday... TODO: needs evaluation
			set: function(target, name, value) {
				console.log("Setting things will not work in Threading.js yet.");
			}
		});
	}
	
	// Takes code in string format and creates a Blob() object and a URL object to use.
	blobify(codeout){
		var blob = new Blob([codeout]);
		var bloburl = window.URL.createObjectURL(blob);
		return bloburl;
	}
	
	/* Cleans up Worker Thread code to allow it to live inside the main scope of the thread.
	   Essentially takes function(){ // code here } and turns it into just // code here */
	blobfixer(method){
		if(typeof(method) == typeof(function(){})){
			var codeout = method.toString();
		}else{
			var codeout = this[method].toString();
		}
		codeout = codeout.substring(codeout.indexOf("{") + 1);
		codeout = codeout.substring(0, codeout.lastIndexOf("}"));
		return codeout;
	}
	
	// Called in constructor() for inline function intake and returns useful bloburl for our Worker() call
	buildblob_from_function(function_in){
		var codeout = this.blobfixer("helper_functions");
		codeout += "\n" + this.blobfixer(function_in);
		
		return this.blobify(codeout);
	}
	
	// Builds our code blob from an extended class. 
	buildblob_from_class(){
		// This allows us to actually see the class inside loops below... "this" wasn't useable in chromium.
		var self = this;
		
		// proto will contain a prototype of the class extension. We're not going too deep on this.
		var proto = Object.getPrototypeOf(this);
		// Extracting the method names from the class extension
		var methods = Object.getOwnPropertyNames(proto);
		// begin building and storing code to turn into a blob.
		var codeout = this.blobfixer("helper_functions");
		
		// iterates through every method in our class extension
		methods.forEach(function(name, fn){
			// ignores the constructor and main() functions of the class extension.
			if(name == 'constructor' || name == 'main'){return;}
			// temporary storage for code fixing.
			var code = self[name].toString();
			// so firefox auto-adds "function".. but chromium does not. wtf?.. check for it
			if(code.match(/^function/g) == null){
				// if we don't have "function" in front of our function declaration, put it there.
				code = "function "+code;
			}
			// add the code to `codeout` variable
			codeout += "\n" + code + "\n\n";
		});
		
		// if we have a "main" function in the class, we want this to be the main scope.
		if('main' in self){ codeout += "\n" + this.blobfixer("main"); }
		
		// blobify codeout and return the bloburl.
		return this.blobify(codeout);
	}
}


// The worker needs some utility stuff to function properly in Threading.js
Worker.prototype = {};
// An ID to know it's randomly generated variable name
Worker.prototype.id = null;
// A variable to know what method names are being requested
Worker.prototype.anonMethodName = null;


/* This is used to send requests to the Worker() thread. */
Worker.prototype.sendToWorker = function(){
	/* We figure out what method was asked of us from the Proxy() we're using that was
	    made in Threading().constructor() */
	anonMethodName = window[this.id]["anonMethodName"];
	/* Build a JSON string to pass to the thread */
	callback_details = JSON.stringify({ method: anonMethodName, args: Array.from(arguments) });
	/* Send the JSON formatted request */
	window[this.id].postMessage(callback_details);
	return this;
};

/* Processes requests from Worker() to run in the main thread (window)
   I'm leaving this in a function named auto() so that people can still
   rely on just common Worker() stuff as they would expect. */
Worker.prototype.auto = function(func){
	/* Listens for requests from the Worker() thread */
	this.onmessage = function(event){
		/* Turn the data from a JSON string to a useable object */
		data = JSON.parse(event.data);
		
		/* Determine if the main thread (window) actually has this method and it's a function */
		if(data.method in window && typeof(window[data.method]) == typeof(function(){})){
			/* method found and was a function, call it and apply arguments. */
			window[data.method].apply(this, data.args);
		}
	}
	
	return this;
}



