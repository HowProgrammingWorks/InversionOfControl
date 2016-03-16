// Example showing us how the framework creates an environment (sandbox) for
// appication runtime, load an application code and passes a sandbox into app
// as a global context and receives exported application interface

// The framework can require core libraries
var fs = require('fs'),
    vm = require('vm'),
    util = require('util'),
    path = require('path');

if (process.argv.length > 2) {
    var fileName = process.argv[2];
    if (!fileName.endsWith('.js')) {
        fileName += '.js';
    }
    var appName = path.basename(fileName, '.js');

    // Wrap console.log
    var oldLogger = console.log;
    console.log = function() {
        var msg = util.format.apply(util, arguments);
        msg = appName + ' ' + (new Date()).toTimeString() + ' ' + msg;
        oldLogger.call(console, msg);
        fs.appendFile(getLogFile(), msg + '\n');
    };

    // Wrap require
    var requireWithLogging = (moduleName) => {
        var msg = (new Date()).toTimeString() + ' ' + moduleName;
        fs.appendFile(getLogFile(), msg + '\n');
        return require(moduleName);
    };

    // Create a hash and turn it into the sandboxed context which will be
    // the global context of an application
    var context = {
        module: {},
        console: console,
        setInterval: setInterval,
        clearInterval: clearInterval,
        setTimeout: setTimeout,
        util: util,
        require: requireWithLogging
    };
    context.global = context;
    var sandbox = vm.createContext(context);

    runScript(fileName, sandbox, () => {
        // print list of exported functions and variables
        console.log('Exported functions and variables: \n%s\n', util.inspect(sandbox.module.exports));

        // print args and listing of some exported function
        var someExportedFunction = sandbox.module.exports.someFunc;
        console.log('someFunc description:\nParameters count: %d.\nBody: %s\n', someExportedFunction.length, someExportedFunction.toString());

        console.log('Application sanbox:\n%s', util.inspect(sandbox));
    });
} else {
    console.error("You must pass application file path as command line argument. E.g: node framework.js application[.js]");
}

function runScript(fileName, contex, callback) {
    // Read an application source code from the file
    fs.readFile(fileName, (err, src) => {
        if (!err) {
            // Run an application in sandboxed context
            var script = vm.createScript(src, fileName);
            script.runInNewContext(contex);
        } else {
            console.error(err.toString());
        }
        callback();
    });
}

function getLogFile() {
    return (new Date()).toDateString() + '.log';
}