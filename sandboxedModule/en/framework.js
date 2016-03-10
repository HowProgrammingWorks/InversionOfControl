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
    console: createConsoleModule(appName),
    setInterval: setInterval,
    setTimeout: setTimeout,
    util: util,
    process: {
      stdin: process.stdin,
      stdout: process.stdout,
      stderr: process.stderr
    }
  };
  context.global = context;
  return vm.createContext(context);
}

// Mixin that wraps methods of a specified console object
//
function applicationConsoleMixin(consoleWrapper, appName) {
  // Define which methods should be wrapped
  var methodsToWrap = ['log', 'error', 'info', 'warn'];
  
  // Create a method wrapper
  function wrapMethod(originalFn) {
    return function() {
      var time = new Date().toLocaleTimeString(),
          userOutput = util.format.apply(util, arguments);
      originalFn(appName.yellow, time.magenta, userOutput);
    };
  }
  
  // Wrap all own properties of consoleWrapper
  for (var key in consoleWrapper) {
    var value = consoleWrapper[key];
    if (/*!consoleWrapper.hasOwnProperty(key) ||*/ typeof(value) !== 'function') {
      continue;
    }
    if (methodsToWrap.indexOf(key) != -1) {
      consoleWrapper[key] = wrapMethod(value);
    }
  }
}

// Console factory
//
function createConsole(appName) {
  // Create a new Console instance
  var consoleWrapper = new console.Console(process.stdout, process.stderr);
  applicationConsoleMixin(consoleWrapper, appName);
  return consoleWrapper;
}

// Console module factory
//
function createConsoleModule(appName) {
  var consoleModule = createConsole(appName),
      stdStreams = [process.stdout, process.stderr];
  // Wrap Console constructor
  consoleModule.Console = function(outStream, errStream) {
    Object.setPrototypeOf(this, console.Console.prototype);
    console.Console.apply(this, arguments);
    if (stdStreams.indexOf(outStream) != -1 &&
        (stdStreams.indexOf(errStream) != -1 || !errStream)) {
      applicationConsoleMixin(this, appName);
    }
  };
  
  return consoleModule;
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
