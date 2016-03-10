// Example showing us how the framework creates an environment (sandbox) for
// appication runtime, load an application code and passes a sandbox into app
// as a global context and receives exported application interface

// The framework can require core libraries
var fs = require('fs'),
    vm = require('vm'),
    util = require('util'),
    colors = require('colors');

// Create a hash and turn it into the sandboxed context which will be
// the global context of an application
//
function createSandbox(appName) {
  var context = {
    module: {},
    console: createConsole(appName),
    setInterval: setInterval,
    setTimeout: setTimeout,
    util: util
  };
  context.global = context;
  return vm.createContext(context);
}

// Console factory
//
function createConsole(appName) {
  var consoleWrapper = {};
  consoleWrapper.log = function() {
    var time = new Date().toLocaleTimeString(),
        userOutput = util.format.apply(util, arguments);
    console.log(appName.yellow, time.magenta, userOutput);
  };
  for (var key in console) {
    if (console.hasOwnProperty(key) && !consoleWrapper[key]) {
      consoleWrapper[key] = console[key];
    }
  }
  return consoleWrapper;
}

// Run an application in a new restricted sandbox
//
function runApplication(appName) {
  // Construct the application file name
  var fileName = appName;
  if (!fileName.endsWith('.js')) {
    fileName += '.js';
  }
  
  // Read an application source code from the file
  fs.readFile(fileName, function(err, src) {
    // We need to handle errors here
    if (err) {
      console.error(`Application "${appName}" does not exist.`.red.bold);
      return;
    }
    
    // Create a sandbox for the application
    var sandbox = createSandbox(appName);

    // Run an application in sandboxed context
    var script = vm.createScript(src, fileName);
    script.runInNewContext(sandbox);

    // We can access a link to exported interface from sandbox.module.exports
    // to execute, save to the cache, print to console, etc.
  });
}

// Retrieve the name of an application to run and then start it
var appName = process.argv[2] || 'application';
runApplication(appName);
