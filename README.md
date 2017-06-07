# Threading.js
Class and Inline function based threading in Javascript. It utilizes Workers, Proxy, and Classes to provide a wonderful development experience to interact with Workers. Essentially made for ES6, but with a Polyfill for Proxy, can work for older versions of ES.  
  
A good polyfill for `Proxy()` was made by the Google guys here: https://github.com/GoogleChrome/proxy-polyfill  
  
In regards to classes, a backwards compatible version that uses an older way to build a class will be built later. Right now we like the ES6 spec, so we are following that. 

## Usage
The script that does the heavy lifting is `threading.js`. You include it in your html like so:
```
<script src="js/threading.js"></script>
```
For an in-depth explanation for usage, check out example.html. Below we will simply cover two ways to use Threading.js.

### Class Based Usage
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

### Inline Function Based Usage
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

### Want a DOM in your thread?
Threading.js has some helpers. Right now they are expirimental, but they are functional. The first helper in progress is the `dompackage`. It includes a virtual DOM (JSDOM), jQuery, and a DOM sync tool. Just add the following above your .js sources:

```
<script src="helpers/dompackage.min.js"></script>
```
For jQuery, we didn't set `$`. You will need to either do `jQuery('selector').things...` or you can just do `$ = jQuery;` and begin working as per normal.  
  
The DOM package also supports syncing DOMs between the thread and window. To use this tool, you need to do some of the following.  
  
In the main thread, you can send changes for the entire html tag by doing the following:
```
syncDOM('html', 'worker_var_name_here'); // begin sending synchronizations to the worker thread for the selector 'html'
```
If you want to update the worker thread, to have the current HTML, you would do so as follows:
```
html = JSON.stringify(document.querySelector('html').outerHTML); // cleanly escape html.
mainW.setDOM('html', html);
```
In the worker, thread, we also need to let it know to send things back to the window thread. From the thread, we make requests to the window with `root`, so we have to pass a string named `"root"`.
```
syncDOM('html', 'root'); // we could do this inside the worker
// OR!!!
worker_var_name_here.syncDOM('html', 'root'); // we could do this right under the main window setup.
```

## Final word
You should also still have access in that example to things like `somevar.terminate();` with the way Threading.js was implemented. You can read up on the worker api here: https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Using_web_workers
