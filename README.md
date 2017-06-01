# Threading.js
Class and Inline function based threading in Javascript. It utilizes Workers, Proxy, and JS6 Classes to provide a wonderful development experience to interact with Workers.

#### Straight to the Point
The script that does the heavy lifting is `threading.js`. You include it in your html like so:
```
<script src="js/threading.js"></script>
```
For an in-depth explanation for usage, check out example.html. Below we will simply cover two ways to use Threading.js.

#### Class Based Usage
The class based workflow is designed to be clean, concise, and simple. To use Threading.js, you just have to extend the Threading class.
```
class WorkerNameHere extends Threading {
	main(){
		// the main scope of your worker here
	}
	somefunctionstoo(args, args1, args2){
		// whatever functions you want
	}
}
```
To use the worker, you would just do the following somewhere:
```
// This starts the thread
somevar = new WorkerNameHere();
// this calls somefunctionstoo() inside the worker thread.
somevar.somefunctionstoo(val, val, val);
```
Pretty simple and it just works.

#### Inline Function Based Usage
To do the same thing we did in the class, we just do the following. However, it is not recommended to use Threading.js this way unless absolutely neccessary. It is not as clean to read through as the class method.
```
// This defines the worker code and builds the thread 
somevar = new Threading(function(){
	function somefunctionstoo(args, args1, args2){
		// whatever functions you want
	}
	// main scope is wherever
});

// this calls somefunctionstoo() inside the worker thread.
somevar.somefunctionstoo(val, val, val);
```

#### Final word
You should also still have access in that example to things like `somevar.terminate();` with the way Threading.js was implemented. You can read up on the worker api here: https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Using_web_workers
