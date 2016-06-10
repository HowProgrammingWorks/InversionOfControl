// Wrapping function and interface example

var fs = require('fs'),
    vm = require('vm');

var stat = {
  functions: {
    calls: 0,
    callbacks: {}
  },
  fs: {
    read: 0
  }
};

function printStat() {
  console.log("Function calls: %d", stat.functions.calls);
  console.log("Functions with callbacks: %d", Object.keys(stat.functions.callbacks).length);
  console.log("Read data: %d", stat.fs.read);
  setTimeout(printStat, 3000);
}

function wrapReadFunction(fnName, fn) {
  return function() {
    var args = [];
    Array.prototype.push.apply(args, arguments);
    stat.fs.read += args[1].length;
    console.log('Call: ' + fnName);
    console.dir(args);
    return fn.apply(undefined, args);
  }
}

function wrapFunction(fnName, fn) {
  return function() {
    stat.functions.calls++;
    var args = [];
    Array.prototype.push.apply(args, arguments);
    if (args.length != 0 && typeof args[args.length - 1] === 'function') {
      if (fnName === 'readFile') {
        args[args.length - 1] = wrapReadFunction('callback', args[args.length - 1]);
      } else {
        args[args.length - 1] = wrapFunction('callback', args[args.length - 1]);
      }
      stat.functions.callbacks[fnName] = args[args.length - 1];
    }
    console.log('Call: ' + fnName);
    console.dir(args);
    return fn.apply(undefined, args);
  }
}


function wrapInterface(anInterface) {
  var clone = {};
  for (var key in anInterface) {
    clone[key] = wrapFunction(key, anInterface[key]);
  }
  return clone;
}

// Create a hash for application sandbox
var context = {
  module: {},
  console: console,
  // Forward link to fs API into sandbox
  fs: wrapInterface(fs),
  // Wrapper for setTimeout in sandbox
  setTimeout: setTimeout,
  setInterval: setInterval
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

setTimeout(printStat, 0);