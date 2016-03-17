// Example showing us how the framework creates an environment (sandbox) for
// application runtime, load an application code and passes a sandbox into app
// as a global context and receives exported application interface

// The framework can require core libraries
var fs = require('fs'),
    vm = require('vm'),
    util = require('util'),
    path = require('path'),
    os = require('os');

// parse command line arguments
var args = process.argv.slice(2);
var isFlag = (e) => e.startsWith('-');
var flags = args.filter(isFlag);
var apps = args.filter(e => !isFlag(e));
apps.forEach((filePath, num) => {
    if (!filePath.endsWith('.js')) {
        apps[num] += '.js';
    }
});

//run apps
if (flags.indexOf('-s') !== -1 || flags.indexOf('--sync') !== -1) {
    // process tasks synchronously
    runAppsSync();
} else {
    // process tasks asynchronously
    runApps();
}

function runApps() {
    apps.forEach((filePath) => {
        runApp(filePath, showAppWorkInfo);
    });
}

function runAppsSync() {
    runNextApp(0);
}

function runNextApp(appNum) {
    if (appNum >= apps.length) {
        return;
    }

    runApp(apps[appNum], (data) => {
        showAppWorkInfo(data);
        runNextApp(appNum + 1);
    });
}

function runApp(filePath, callback) {
    var appName = path.basename(filePath, '.js');

    // Create a hash and turn it into the sandboxed context which will be
    // the global context of an application
    var context = {
        module: {},
        console: getConsoleWithLogging(appName),
        setInterval: setInterval,
        clearInterval: clearInterval,
        setTimeout: setTimeout,
        util: util,
        require: getRequireWithLogging(appName),
        done: () => {} // app executes when work finished
    };
    context.global = context;
    var initialContext = Object.assign({}, context);
    context.done = () => callback({initialContext: initialContext, context: context});
    var sandbox = vm.createContext(context);

    fs.readFile(filePath, (err, src) => {
        if (!err) {
            // Run an application in sandboxed context
            var script = vm.createScript(src, filePath);
            script.runInNewContext(sandbox);
        } else {
            console.error(err.toString());
        }
    });
}

function getRequireWithLogging(appName) {
    return (moduleName) => {
        var msg = util.format('%s %s', new Date().toTimeString(), moduleName);
        fs.appendFile(getLogFile(appName), msg + os.EOL);
        return require(moduleName);
    };
}

function getConsoleWithLogging(appName) {
    // clone console interface
    var consoleWithLogging = {};
    for (key in console) {
        consoleWithLogging[key] = console[key];
    }

    // wrap log function
    consoleWithLogging.log = function () {
        var msg = util.format.apply(util, arguments);
        msg = util.format('%s %s %s', appName, new Date().toTimeString(), msg);
        console.log(msg);
        fs.appendFile(getLogFile(appName), msg + os.EOL);
    };
    return consoleWithLogging;
}

function getLogFile(appName) {
    return util.format('%s_%s.log', appName, new Date().toDateString());
}

function showAppWorkInfo(data) {
    // print list of exported functions and variables
    var log = data.initialContext.console.log;

    log('Exported functions and variables:');
    log(util.inspect(data.context.module.exports));

    // print args and listing of some exported function
    var someExportedFunction = data.context.module.exports.someFunc;
    log('someFunc description:');
    log('Parameters count: %d', someExportedFunction.length);
    log('Body: %s', someExportedFunction.toString());

    log('Application sanbox:');
    log(util.inspect(data.context));

    log('Context changes:');
    displayDifference(data.initialContext, data.context, log);
}

function displayDifference(before, after, log) {
    var keysBefore = Object.keys(before),
        keysAfter = Object.keys(after);

    var keysAdded = keysAfter.filter(e => keysBefore.indexOf(e) < 0);
    keysAdded.forEach(e => log('[+] %s', e));

    var keysRemoved = keysBefore.filter(e => keysAfter.indexOf(e) < 0);
    keysRemoved.forEach(e => log('[-] %s', e));
}
