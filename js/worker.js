importScripts('worker.functions.js');

var i = 0;

function timedCount() {
	i = i + 1;

	payload = { message: i }
	this.send("say", payload)

	setTimeout("timedCount()",500);
}

function add(payload){
	i += payload.amount
}
