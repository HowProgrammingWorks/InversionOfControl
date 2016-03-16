// Example showing us how the framework creates an environment (sandbox) for
// appication runtime, load an application code and passes a sandbox into app
// as a global context and receives exported application interface

// The framework can require core libraries
var fs = require('fs'),
    vm = require('vm'),
    util = require('util');

// Create a hash and turn it into the sandboxed context which will be
// the global context of an application
var context = {
    module: {},
    console: console,
    setInterval: setInterval,
    setTimeout: setTimeout,
    util: util
};
context.global = context;
var sandbox = vm.createContext(context);

if (process.argv.length > 2) {
    var fileName = process.argv[2];
    if (!fileName.endsWith('js')) {
        fileName += '.js';
    }
    runScript(fileName);
} else {
    console.error("You must pass application file path as command line argument. E.g: node framework.js application[.js]");
}

function runScript(fileName) {
    // Read an application source code from the file
    fs.readFile(fileName, (err, src) => {
        if (!err) {
            // Run an application in sandboxed context
            var script = vm.createScript(src, fileName);
            script.runInNewContext(sandbox);

            // We can access a link to exported interface from sandbox.module.exports
            // to execute, save to the cache, print to console, etc.
        } else {
            console.error(err.toString());
        }
    });
}