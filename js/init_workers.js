// define some worker helpers... do not remove these
if(typeof(Worker) !== "undefined") {
	Worker.prototype = {};
	// Calls a function in our worker and passes a payload of data to the worker
	Worker.prototype.request = function(func, payload){
		data = { function: func, payload: payload }
		this.postMessage(JSON.stringify(data))
		return this;
	}
	// auto receiver that handles running a function and passes an object of data to it.
	Worker.prototype.auto = function(func){
		this.onmessage = function(event){
			data = JSON.parse(event.data)
			window[data.function](data.payload)
		}
		return this;
	}
}
/////////////////////////////////////////////////////////////////////
// Edit below as neccessary

$(document).ready(function(){
  // make sure workers are supported.
	if(typeof(Worker) == "undefined") {
		$("body").html("You're using an outdated browser. Get a newer one that supports workers.");
		return;
	}



	// Initiate the worker and an auto receiver
  w = new Worker("js/worker.js").auto();
	w.request("timedCount")

  // send some data to it
	payload = {
			amount: 100
	}
	w.request("add", payload)
});

// functions that get called by our workers on return
function say(payload){
	$("#hello").html(payload.message);
}
