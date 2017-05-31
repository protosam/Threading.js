// Initiate the worker, it will setup a receiver to run commands arbitrarily
w = new sWorker("js/worker.js");

w.fromthewindows("Say it!"); // calls fromthewindows("Say it!") in worker.js


function tothewalls(){
	console.log("... to the walls!");
}
