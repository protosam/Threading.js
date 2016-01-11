# JavascriptWorkerFramework
Simple framework for my worker communications.

#### The example
Download the repo and open up example.html in your browser. You'll see that it's just a number counting up and that 100 was added to the number pretty quickly. What's happening is as follows:
- Your web browser forks a separate process called a worker that has it's own thread.
- The separate thread is setup to just count up every 0.5 seconds and tell the main thread (the web browser) what the new number is
- The main thread tells the process to add 100 to the number
- Then the separate thread tells the main process what the new number is, the main thread updates the html content of `<div id="hello">`  
Hopefully this super simple example is useful for other people. The worker and the initiation script have some helper functions that make it a bit easier to just deal with worker communications. Everything is assumed to be an object when sent and received. JSON is automatically translated to objects with the helpers. Also, functions are just called atonomously by the worker and main process. 
