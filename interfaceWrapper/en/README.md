## Description

The objective of this exercise is to learn about creating wrappers by
implementing a universal, interface-independent wrapper. The `setTimeout`
function was wrapped as an example. The task for the exercise is to wrap a
node.js interface for the file system interaction - the `fs` library.

## Files

* `framework.js` - a part of the sample framework for wrapper demonstration
* `application.js` - a part of the sample application for wrapper demonstration

## How to execute
1. From the command line, type: `node application` then `node framework`;
2. Compare the output of both commands;
3. Examine the code in `framework.js` and `application.js` files. Try to figure
out how the `setTimeout` wrapper works.

## Tasks
1. You need to understand the implementation of the `setTimeout` wrapper.
Following that example you need to implement a wrapper for the `fs` module.
You need to iterate over its functions (`for (var key in fs) { ... }`) and
replace them with your own function. You need to make this function a universal
wrapper for all of the `fs` module functions using closures.
The wrapper should log all calls to the file system into a file. A log record
should contain the time of the call, the called function's name and arguments.
If the called function has a callback, you need to intercept the callback as well.
The call to a callback should also be logged.
You can break this task into several steps.

2. Remove calls to the timer from `application.js`. This is what your 
`application.js` should look like:

  ```JavaScript
  var fileName = './README.md';
  console.log('Application going to read ' + fileName);
  fs.readFile(fileName, function(err, src) {
    console.log('File ' + fileName + ' size ' + src.length);
  });
  ```  
This is an example of interaction with the file system. You're going to change
the behavior of this code. Remove the timer wrapper from `framework.js` and 
forward a link to the `fs` module to your application. Then run the framework
by typing `node framework` in the console. Make sure an application reads the
file and prints its length.

## Additional tasks
