// Example showing us how the framework creates an environment (sandbox) for
// appication runtime, load an application code and passes a sandbox into app
// as a global context and receives exported application interface

// The framework can require core libraries
var fs = require('fs'),
    os = require('os'),
    vm = require('vm'),
    util = require('util'),
    path = require('path'),
    async = require('async'),
    colors = require('colors');

// Array of console methods that should be logged
//
var loggedMethods = ['log', 'error', 'info', 'warn', 'require'];

// A hash of open logs.
// Keys are log names and values are file descriptors
//
var logs = {};

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
    },
    require: wrappedRequire,
    __filename: appName.endsWith('.js') ? appName : appName + '.js',
    __dirname: path.resolve(path.dirname(appName))
  };
  context.global = context;
  return vm.createContext(context);
}

// Prepare and open logs
//
function openLogs(callback) {
  var logsDir = path.join(__dirname, 'logs'),
      today = new Date().toISOString().slice(0, 10),
      todayLogsDir = path.join(logsDir, today);
  fs.mkdir(logsDir, function(err) {
    fs.mkdir(todayLogsDir, function(err) {
      for (var name of loggedMethods) {
        var fileName = path.join(todayLogsDir, name + '.txt');
        logs[name] = fs.createWriteStream(fileName, { flags: 'a' });
      }
      callback();
    });
  });  
}

// Write an entry to log
//
function log(logName, entry) {
  logs[logName].write(entry + os.EOL);
}

// Close logs
//
function closeLogs(callback) {
  for (var name of loggedMethods) {
    logs[name].end();
  }
}

// `require` for application code
//
function wrappedRequire(moduleName) {
  var time = new Date().toLocaleTimeString();
  log('require', [time, moduleName].join(' - '));
  return require(moduleName);
}

// Mixin that wraps methods of a specified console object
//
function applicationConsoleMixin(consoleWrapper, appName) {
  // Create a method wrapper
  function wrapMethod(name, originalFn) {
    return function() {
      var time = new Date().toLocaleTimeString(),
          userOutput = util.format.apply(util, arguments);
      originalFn(appName.yellow, time.magenta, userOutput);
      log(name, [appName, time, userOutput].join(' - '));
    };
  }
  
  // Wrap all own properties of consoleWrapper
  for (var key in consoleWrapper) {
    var value = consoleWrapper[key];
    if (!consoleWrapper.hasOwnProperty(key) || typeof(value) !== 'function') {
      continue;
    }
    if (loggedMethods.indexOf(key) != -1) {
      consoleWrapper[key] = wrapMethod(key, value);
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
openLogs(function() {
  runApplication(appName);
});
