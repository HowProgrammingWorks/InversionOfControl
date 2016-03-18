// Example showing us how the framework creates an environment (sandbox) for
// application runtime, load an application code and passes a sandbox into app
// as a global context and receives exported application interface

// The framework can require core libraries
var fs = require('fs'),
    vm = require('vm'),
    util = require('util'),
    path = require('path'),
    os = require('os');

var logDir = "logs/";
var flags = [];
var apps = [];
var runAppSyncModeOn = false;

function runApps() {
    apps.forEach((filePath) => {
        runApp(filePath, displayAppWorkInfo);
    });
}

function runAppsSync() {
    runNextApp(0);
}

function runNextApp(appNum) {
    if (appNum < apps.length) {
        runApp(apps[appNum], (data) => {
            displayAppWorkInfo(data);
            runNextApp(appNum + 1);
        });
    }
}

function runApp(filePath, callback) {
    var appName = path.basename(filePath, '.js');
    fs.readFile(filePath, (err, src) => {
        if (!err) {
            // Run an application in sandboxed context
            var script = vm.createScript(src, filePath);
            script.runInNewContext(createAppContext(appName, callback));
        } else {
            console.error(err.toString());
        }
    });
}

function createAppContext(appName, appFinishCallback) {
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
    context.done = () => appFinishCallback({initialContext: initialContext, context: context});
    return vm.createContext(context);
}

function getConsoleWithLogging(appName) {
    // clone console interface
    var consoleWithLogging = {};
    Object.keys(console).forEach(key => consoleWithLogging[key] = console[key]);

    // wrap log function
    consoleWithLogging.log = function () {
        var msg = util.format.apply(util.format, arguments);
        msg = util.format('%s %s %s', appName, getCurrentTime(), msg);
        console.log(msg);
        fs.appendFile(getLogFile(appName), msg + os.EOL);
    };
    return consoleWithLogging;
}

function getRequireWithLogging(appName) {
    return (moduleName) => {
        var msg = util.format('%s %s', getCurrentTime(), moduleName);
        fs.appendFile(getLogFile(appName), msg + os.EOL);
        return require(moduleName);
    };
}

function getCurrentTime() {
    return new Date().toTimeString().substr(0, 8);
}

function getLogFile(appName) {
    return util.format('%s%s_%s.log', logDir, appName, new Date().toLocaleDateString());
}

function displayAppWorkInfo(data) {
    var context = data.context;
    var log = data.initialContext.console.log;

    // print list of exported functions and variables
    log('Exported functions and variables:');
    log(getObjectInfo(context.module.exports));

    // print args and listing of some exported function
    var someExportedFunction = findAnyFunction(context.module.exports);
    if (someExportedFunction) {
        log('Function "%s" description:', someExportedFunction.name);
        log('Parameters count: %d', someExportedFunction.length);
        log('Body: %s', someExportedFunction.toString());
    }

    log('Application context:');
    log(getObjectInfo(context.module.exports));

    log('Context changes:');
    log(getDifference(data.initialContext, data.context));
}

function getObjectInfo(obj) {
    if (!obj) return;
    return Object.keys(obj)
        .map(key => util.format('%s: [%s]', key, typeof obj[key]))
        .join(os.EOL);
}

function findAnyFunction(obj) {
    for (key in obj) {
        if (typeof(obj[key]) === 'function') {
            return obj[key];
        }
    }
}

function getDifference(before, after) {
    before = before || {};
    after = after || {};

    var differenceString = '',
        keysBefore = Object.keys(before),
        keysAfter = Object.keys(after);

    var keysAdded = keysAfter.filter(e => keysBefore.indexOf(e) < 0);
    keysAdded.forEach(e => differenceString += util.format('[+] %s', e + os.EOL));

    var keysRemoved = keysBefore.filter(e => keysAfter.indexOf(e) < 0);
    keysRemoved.forEach((e, i) => differenceString += util.format('[-] %s', e + (i + 1 < keysRemoved.length ? os.EOL : '')));
    return differenceString.length ? differenceString : 'N\\A';
}

function createLogDir() {
    fs.mkdir(logDir, (err) => {
        if (err && err.code !== 'EEXIST') {
            console.error('Can\'t create dir for logs. Error: %s. Logs dir: %s', err.toString(), logDir);
        }
    });
}

function parseCmdArgs() {
    var args = process.argv.slice(2);
    var isFlag = e => e.startsWith('-');
    flags = args.filter(isFlag);
    apps = args.filter(e => !isFlag(e));
    apps.forEach((filePath, num) => {
        if (!filePath.endsWith('.js')) {
            apps[num] += '.js';
        }
    });
}

function processFlags() {
    var userLogDir = '';
    flags.forEach(flag => {
        if (flag.startsWith('-ld') || flag.startsWith('--log-dir')) {
            userLogDir = flag.split('=')[1];
        }
    });
    if (userLogDir) {
        logDir = userLogDir + (userLogDir.endsWith(path.sep) ? '': path.sep);
    }

    runAppSyncModeOn = flags.indexOf('-s') !== -1 || flags.indexOf('--sync') !== -1;
}

parseCmdArgs();
processFlags();
createLogDir();

// run apps
if (runAppSyncModeOn) {
    runAppsSync();
} else {
    runApps();
}
