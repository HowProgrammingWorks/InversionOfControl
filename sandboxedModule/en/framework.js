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
    module: {
      exports: {}
    },
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
  context.exports = context.module.exports;
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
function runApplication(appName, callback) {
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
    
    // Save a copy of application context
    //
    var initialContext = Object.assign({}, sandbox.global);

    // Run an application in sandboxed context
    var script = vm.createScript(src, fileName);
    script.runInNewContext(sandbox);

    // We can access a link to exported interface from sandbox.module.exports
    // to execute, save to the cache, print to console, etc.
    inspectAppArtifacts(appName, sandbox, initialContext);
  });
}

// Inspect application's exported interface and globals
function inspectAppArtifacts(appName, sandbox, initialContext) {
  var interfaceMessage = `Introspection of ${appName}'s exported interface:`,
      globalsMessage = `Introspection of ${appName}'s globals:`,
      changeMessage = `Changes in ${appName}'s context:`,
      fatLine = '='.repeat(interfaceMessage.length),
      logColored = msg => console.log(msg.blue.bold);
  
  logColored(fatLine);
  logColored(interfaceMessage);
  inspectExportedInterface(sandbox.module.exports);
  logColored(fatLine);
  
  logColored(globalsMessage);
  inspectObject(sandbox.global);
  logColored(fatLine);
  
  logColored(changeMessage);
  inspectChanges(initialContext, sandbox.global);
  logColored(fatLine);
}

// Inspects application's exports
//
function inspectExportedInterface(interface) {
  var printers = {
        object: inspectObject,
        function: inspectFunction
      },
      print = printers[typeof(interface)];
  if (print) {
    print(interface);
  }
}

// Inspect an object
//
function inspectObject(obj) {
  var getConstructor = obj => obj.constructor ? obj.constructor.name : '-',
      row = (key, type, constructor) =>
              tableRow`25${key} 10${type} 15${constructor}`,
      header = row('Property', 'Type', 'Constructor'),
      thinLine = '-'.repeat(header.length);
  
  console.log(thinLine);
  console.log(header);
  console.log(thinLine);
  
  for (var key in obj) {
    var value = obj[key];
    if (!obj.hasOwnProperty(key)) {
      continue;
    }
    console.log(row(key, typeof(value), getConstructor(value)));
  }
}

// Simple table row formatter for ES6 template literals
//
function tableRow(fields) {
  var elements = [];
  for (var index = 0; index < fields.length - 1; index++) {
    var width = +fields[index],
        value = arguments[index + 1].toString(),
        padding = width - value.length;
    if (padding < 0) padding = 0;
    elements.push(value);
    elements.push(' '.repeat(padding));
  }
  return elements.join('');
}

// Inspect a function
//
function inspectFunction(fn) {
  var source = fn.toString(),
      parameters = parseParameters(source);
  console.log('Function name:'.blue, fn.name || '(anonymous)');
  console.log('Parameters:'.blue, parameters.length);
  for (var index = 0; index < parameters.length; index++) {
    console.log(`${index + 1}) ${parameters[index]}`);
  }
  console.log('Source:'.blue);
  console.log(highlightSyntax(source));
}

// Parse function parameters an return them as an array
//
function parseParameters(source) {
  var paramList = source.match(/\((.+)\)/)[1];
  return paramList.split(',').map(string => string.trim());
}

// Highlight JavaScript source code
//
function highlightSyntax(source) {
  var wordsToRegex = words =>
        new RegExp(words.map(word => '(\\b' + word + '\\b)').join('|')),
      keywordsList = ['await', 'break', 'case', 'catch', 'class', 'const',
                      'continue', 'debugger', 'default', 'delete', 'do',
                      'else', 'export', 'extends', 'finally', 'for',
                      'function', 'if', 'import', 'in', 'instanceof',
                      'let', 'new', 'return', 'super', 'switch', 'this',
                      'throw', 'try', 'typeof', 'var', 'void', 'while', 'with'],
      literalValuesList = ['false', 'true', 'null', 'NaN', 'undefined'],
      tokenTypes = {
        keyword: {
          regex: wordsToRegex(keywordsList),
          color: 'blue',
          modifier: 'bold'
        },
        literalValue: {
          regex: wordsToRegex(literalValuesList),
          color: 'cyan'
        },
        string: {
          regex: /('(\\.|[^'])*')|("(\\.|[^"])*")|(`(\\.|[^`])*`)/,
          color: 'yellow'
        },
        number: {
          regex: /(0x[\dabcdefABCDEF])|(\d+(\.\d*)?([eE][+-]?\d+)?)|((\.\d+)([eE][+-]?\d+)?)/,
          color: 'green'
        },
        regularExpression: {
          regex: /([^\/]|$)\/(\\.|[^\/])+\/[gmi]*/,
          color: 'yellow'
        },
        comment: {
          regex: /(\/\/.*)|(\/\*((\*(?!\/))|[^*]|\n)*\*\/)/,
          color: 'gray'
        }
      },
      highlighted = [];

  while (true) {
    var bestMatch = null,
        color,
        modifier;
    
    for (var key in tokenTypes) {
      if (!tokenTypes.hasOwnProperty(key)) continue;
      var tokenType = tokenTypes[key];
      var match = source.match(tokenType.regex);
      if (!match) continue;
      if (!bestMatch || match.index < bestMatch.index) {
        bestMatch = match;
        color = tokenType.color;
        modifier = tokenType.modifier;
      }
    }
    if (!bestMatch) break;
    
    var beforeMatch = source.slice(0, bestMatch.index);
    if (beforeMatch) highlighted.push(beforeMatch);
    
    var coloredToken = bestMatch[0][color];
    if (modifier) coloredToken = coloredToken[modifier];
    highlighted.push(coloredToken);
    
    source = source.slice(bestMatch.index + bestMatch[0].length);
  }
  if (source) highlighted.push(source);
  
  return highlighted.join('');
}

// Inspect changes in object after modification
//
function inspectChanges(before, after) {
  var beforeKeys = Object.keys(before),
      afterKeys = Object.keys(after),
      allKeys = new Set(beforeKeys.concat(afterKeys));
  for (var key of allKeys) {
    var presentInBefore = before[key] !== undefined,
        presentInAfter = after[key] !== undefined,
        status;
    if (presentInBefore && presentInAfter) continue;
    if (presentInBefore) status = 'deleted'.red;
    if (presentInAfter)  status = 'added'.green;
    console.log(tableRow`25${key} 10${status}`);
  }
}

// Retrieve the name of an application to run and then start it
var appName = process.argv[2] || 'application';
openLogs(function() {
  runApplication(appName);
});
