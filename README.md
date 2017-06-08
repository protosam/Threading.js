# Threading.js
Class and Inline function based threading in Javascript. You can now just use Workers for Threading. No need to care about browsers and origin policies. You write code and it just works as it should.

## The Examples
Some basic usage examples were included in the `examples` directory.  
  
- `example1.html` is a basic class-based usage of Threading.js
- `example2.html` is an in-line function based example of Threading.js
- `example3.html` need a Virtual DOM? you can have it in this example.
- `example4.html` want to keep a synced Virtual DOM between threads? Here ya go.

## Accessing Worker API Methods
You should also still have access in that example to things like `somevar.terminate();` with the way Threading.js was implemented. You can read up on the worker api here: https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Using_web_workers


## Compatability
Threading.js utilizes Workers, Proxy, and Classes to provide a wonderful development experience to interact with Workers. Essentially made in ES6, but with a Polyfill for Proxy and compiling code with the `Closure Compiler` Threading.js will work pre-ES6.  
  
A good polyfill for `Proxy()` was made by the Google guys here: https://github.com/GoogleChrome/proxy-polyfill  
  
In regards backwards compatability with classes, using Google Closure should backport classes to the older method of function based classes.

## Troubleshooting and Testing
We recommend testing in the Chromium browser, as it is one of the most strict of the lot. Threading.js creates URL objects from blobs of code. When errors occur, you will see references like `blob:null/91ae193a-306f-40b6-8341-52914d13ac35:5` which is referring to line 5 of some blobified code. Just click it from the Javascript console to see the actual snippet of relevant code.
