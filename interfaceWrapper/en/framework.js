// Wrapping function and interface example

var fs = require('fs'),
    vm = require('vm');
    functionCallsCount = 0;

// Create a hash for application sandbox
var context = {
  module: {},
  console: console,
  // Forward link to fs API into sandbox
  fs: cloneInterface(fs),
  getFunctionCallsCount: getFunctionCallsCount,
  setInterval: setInterval,
  setTimeout: setTimeout
};

// Turn hash into context
context.global = context;
var sandbox = vm.createContext(context);

// Read an application source code from the file
var fileName = './application.js';
fs.readFile(fileName, function(err, src) {
  // Run an application in sandboxed context
  var script = vm.createScript(src, fileName);
  script.runInNewContext(sandbox);
});

function cloneInterface(anInterface) {
  var clone = {};
  for (var key in anInterface) {
    if (typeof (anInterface[key]) === 'function') {
      clone[key] = wrapFunction(key, anInterface[key]);
    } else {
      clone[key] = anInterface[key];
    }
  }
  return clone;
}

function wrapFunction(fnName, fn) {
  return function wrapper() {
    var args = [];
    Array.prototype.push.apply(args, arguments);
    functionCallsCount++;
    console.log('Call Count: ' + functionCallsCount);
    console.log('Call: ' + fnName);
    console.dir(args);
    if (typeof (args[args.length - 1]) === 'function') {
      args[args.length - 1] = wrapFunction(args[args.length - 1].name, args[args.length - 1]);
    }
    return fn.apply(undefined, args);
  }
}

function getFunctionCallsCount() {
	return functionCallsCount;
}