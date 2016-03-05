// Wrapping function and interface example

var fs = require('fs'),
    vm = require('vm');

// Create a hash for application sandbox
var context = {
  module: {},
  console: console,
  // Forward link to fs API into sandbox
  fs: fs,
  // Wrapper for setTimeout in sandbox
  setTimeout: function(callback, timeout) {
    // Logging all setTimeout calls
    console.log(
      'Call: setTimeout, ' +
      'callback function: ' + callback.name + ', ' +
      'timeout: ' + timeout
    );
    setTimeout(function() {
      // Logging timer events before application event
      console.log('Event: setTimeout, before callback');
      // Calling user-defined timer event
      callback();
      console.log('Event: setTimeout, after callback');
    }, timeout);
  }
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
