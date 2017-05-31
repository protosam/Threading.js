# JavascriptWorkerFramework
Simple framework for my worker communications.

#### Workers have never been so easy
The script that does the heavy lifting is `worker.functions.js`. You include it in your html like so:
```
<script src="js/worker.functions.js"></script>
```
You make a script that will talk to the worker and include that too. We'll use `sWorker` to initiate a worker thread using `background_worker.js`, like example.js in this repo:
```
w = new sWorker("js/background_worker.js.js");

w.some_function_in_the_worker("some", "arguments", "here");

function some_function_for_the_worker_to_call(){
	console.log("Do something here...");
}
```
Then you make a worker script that has functions to use in the background.
```
importScripts('worker.functions.js');

function some_function_in_the_worker(arg1, arg2, arg3){
	console.log("Arguments: ", arg1, arg2, arg3);
	req.tothewalls();
}

```

Then you're done. It's super simple and easy to use.
