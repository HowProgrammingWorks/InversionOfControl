## Description

Purpose: learn how to wrap the interfaces and make wrapper flexible enough to
wrap unknown interface with just one assumption that callbacks should be last
argument of asynchronous functions. As an example, we have `setTimeout` wrapped
and as a result we will wrap a whole interface of the file system `fs`.

## Files

* `framework.js` - small piece of the framework, just to demonstrate wrapper
* `application.js` - small piece of the application for wrapper demonstration

## How to execute

From the command line, type: `node application` then `node framework`, compare
output, read code in `framework.js` and `application.js`, try to understand
how wrapper works for `setTimeout`.

## Tasks

1. Learn how `setTimeout` is wrapped in example: `framework.js`. Now we will
try to wrap module fs. We can iterat all of its functions by following code:
`for (var key in fs) {...}` and replace its function with wrapped ones. We need
a closure function and it should be universal to wrap any function in fs
interface. The purpose of this example wrapper is to log all calls to the file
system in a file indicating the time, a function name, its arguments, and if
the function has also callback, it is necessary to intercept it too and wrap
this callback, logging callback calls.  
This task can be divided into a few steps.
2. Remove `setTimeout` example from `application.js` and replace it with the
following code:

  ```JavaScript
  var fileName = './README.md';
  console.log('Application going to read ' + fileName);
  fs.readFile(fileName, function(err, src) {
    console.log('File ' + fileName + ' size ' + src.length);
  });
  ```
This example contains a call to `fs.readFile`. In next steps we will change the
behavior of the code changing `framework.js` and wrapping all `fs` functions.
Let`s run `node framework` and make sure that it reads th file displays its
length.
3. Next step is preparing function `cloneInterface(interfaceName)` for cloning
all keys from given library into new interface. So we can pass its result
(cloned `fs`) to sandbox instead of `fs`. Clonning function example:

  ```JavaScript
  function cloneInterface(anInterface) {
    var clone = {};
    for (var key in anInterface) {
      clone[key] = anInterface[key];
    }
    return clone;
  }
  ```
4. After that we can add wrapper `wrapFunction(fnName, fn)` with 2 arguments:
name of the function and link to a function itself. It returns `wrapper` -
closure function. Closure `wrapper` is a newly created function with the help
of functional inheritance, so it will see `fnName`, `fn` in its context. Thus
we can pass all arguments from wrapper into original function as you see in
example:

  ```JavaScript
  function wrapFunction(fnName, fn) {
    return function wrapper() {
      var args = [];
      Array.prototype.push.apply(args, arguments);
      console.log('Call: ' + fnName);
      console.dir(args);
      fn.apply(undefined, args);
    }
  }
  ```

5. Now should detect do we have `callback` argument as a last argument of
function call, we can do that by `typeof()` comparing to `function`. If we have
`callback`, we need to wrap it too, so pass ours function instead of `callback`
and then call ariginal `callback` from this function.
6. Then we can call other functions of `fs` interface from `application.js` and
try to run wrapped code.
7. Add timers in `application.js` and make multiple calls working with files. So
we will model a real application random file system access. Then we can collect
some statistics from `framework.js` and print it every 30 seconds. For example,
you can collect following parameters:
  - number of function calls,
  - number of callbacks,
  - average function completion speed,
  - average return rate of callbacks,
  - total amount of data read from the disk,
  - total amount of recorded data,
  - average read and write speed,
  etc.

Save your results to github, we will need it in next labs, for example we can
transfer overriden wrapped calls (fs operations) to another process and another
server. In such a way we can create distributed application.

## Additional tasks
