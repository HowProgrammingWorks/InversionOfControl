// Wrapping function and interface example

var fs = require('fs'),
    vm = require('vm');
    functionCallsCounter = 0;
    callbackCallsCounter = 0;
    dataReadVol = 0; // bytes
    dataReadTime = 0; // milliseconds

// Create a hash for application sandbox
var context = {
  module: {},
  console: console,
  // Forward link to fs API into sandbox
  fs: cloneInterface(fs),
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
  	if (fnName === 'readFile') var startTimestamp = process.hrtime();
    var args = [];
    functionCallsCounter++;
    Array.prototype.push.apply(args, arguments);
    console.log('Call: ' + fnName);
    if (typeof (args[args.length - 1]) === 'function') {
    	callbackCallsCounter++;
    	var cb = args[args.length - 1];
    	console.log('Callback: ' + cb.name);
      args[args.length - 1] = function() {

      	var args = [];
      	Array.prototype.push.apply(args, arguments);
        if (fnName === 'readFile') {
          dataReadVol += args[1].length;
        }
        return cb.apply(undefined, args);
      };
    }
    var result =  fn.apply(undefined, args);
    if (fnName === 'readFile') {
      var endTimestamp = process.hrtime();
      dataReadTime += ((endTimestamp[0] - startTimestamp[0]) * 1e3 +
        (endTimestamp[1] - startTimestamp[1]) / 1e6);
    }
    return result;
  }
}

setInterval(function() {
  console.log('Function calls count: ' + functionCallsCounter);
  console.log('Callback calls count: ' + callbackCallsCounter);
  console.log('Data reading speed: ' + 
    Math.round(dataReadVol / dataReadTime) + ' bytes / ms');
  }, 10000);
