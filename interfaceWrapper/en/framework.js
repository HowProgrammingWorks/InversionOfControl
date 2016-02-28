// Example: function wrapper in sandboxed context

var fs = require('fs'),
    vm = require('vm');

// Declare dictionary to convert it into sandboxed context
var context = {
  module: {},
  console: console,
  // Declare wrapper function for setTimeout
  setTimeout: function(callback, timeout) {
    // Add some behaviour for setTimeout
    console.log(
      'Call: setTimeout, ' +
      'callback function: ' + callback.name + ', ' +
      'timeout: ' + timeout
    );
    setTimeout(function() {
      // Add some behaviour on event
      console.log('Event: setTimeout, before callback');
      // Call of orignal user-defined callback, passed to wrapper
      callback();
      console.log('Event: setTimeout, after callback');
    }, timeout);
  }
};

// Convert collection into sandboxed context
context.global = context;
var sandbox = vm.createContext(context);

// Read an application source code from the file
var fileName = './application.js';
fs.readFile(fileName, function(err, src) {
  // Run an application in sandboxed context
  var script = vm.createScript(src, fileName);
  script.runInNewContext(sandbox);
});
