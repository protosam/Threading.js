importScripts('worker.functions.js');


// functions are just called magicly from your window level script
// and will be called via the receiver in worker.functions.js
function fromthewindows(message){
	console.log(message);
	console.log("FROM THE WINDOWS!");
	req.tothewalls(); // this makes tothewalls() run in example.js
}
