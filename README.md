# Threading.js
Class and Inline function based threading in Javascript. It utilizes Workers, Proxy, and JS6 Classes to provide a wonderful development experience to interact with Workers.

## Requires and Works In
This requires `Proxy()`, `Workers()` and `classes` in javascript to work. It will not work for NodeJS and it will probably never be supported either since it already has so many Asynchronous features and doesn't need more function call learning curves.
  
For the proxy class, you call probably use this polyfill for supporting non-es6 browsers: https://github.com/GoogleChrome/proxy-polyfill  
  
We have not tested it yet, but the Google guys tend to know what they're doing. Workers are not going to be possible to polyfill due to the way they work.
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
Threading.js has some helpers. Right now they are expirimental, but they are functional. The first helper in progress is the `dompackage`. It includes a virtual DOM (JSDOM), jQuery, and a MutationObserver. Just add the following above your .js sources:

```
<script src="helpers/dompackage.min.js"></script>
```
At this time, we're writing a toolkit that will automatically update the main window DOM and visa-versa, but in the meantime you can use the mutation observer included in the DOM package:
```
console.log('JSDOM MUTATION TEST');
var observer = new MutationObserver(function(mutations) {
	    console.log('JSDOM DOM MUTATION OBSERVED.');
	    console.log(mutations);
});

var observerConfig = {
	childList: true,
	attributes: true,
	characterData: true,
	subtree: true,
	attributeOldValue: true,
	characterDataOldValue: true
}; 
observer.observe(document.querySelector('html'), observerConfig);

$('body').append('Hi there');
$('body').append('<div>Hi there</div>');

console.log('JSDOM MUTATION TEST');
```
If you're worried about MutationObserver support on the browser-side, go get this and just slap it into your site. It checks to see if `window.MutationObserver` exists and fallsback to the virtual MutationObserver.
```
https://github.com/megawac/MutationObserver.js/tree/master/dist
```

## Final word
You should also still have access in that example to things like `somevar.terminate();` with the way Threading.js was implemented. You can read up on the worker api here: https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Using_web_workers
