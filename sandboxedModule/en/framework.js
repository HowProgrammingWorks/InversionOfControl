// Example showing us how the framework creates an environment (sandbox) for
// appication runtime, load an application code and passes a sandbox into app
// as a global context and receives exported application interface

// The framework can require core libraries
var fs = require('fs'),
    vm = require('vm'),
    util = require('util');
    path = require('path');


// Create a hash and turn it into the sandboxed context which will be
// the global context of an application
var base_context = {
    module: {},
    console: console,
    setTimeout: setTimeout,
    setInterval: setInterval,
    clearInterval: clearInterval,
    util: util,
};


var stdout = process.stdout;
var logFile = fs.createWriteStream(__dirname + '/debug.log', {flags: 'a'});


function deepcopy(obj) {
    var orig_objects = [];
    var copy_objects = [];
   
    function deepcopy_(obj_) {
        if (!obj_ || typeof obj_ !== 'object') return obj_;

        var idx;
        if ((idx = orig_objects.indexOf(obj_)) !== -1) { 
            return copy_objects[idx];
        }

        var copy_ = obj_.constructor === Array ? [] : {};
        orig_objects.push(obj_);
        copy_objects.push(copy_);

        for (key in obj_) {
            copy_[key] = deepcopy_(obj_[key]);
        }
        return copy_;
    }
    return deepcopy_(obj);
}


function makeNewLog(filename, filestream) {
    var filename = path.normalize(filename);

    function _wrapped() {
        var timestamp = (new Date()).toISOString().replace(/T/, ' ').replace(/Z/, '');
        var message = util.format.apply(null, arguments);
        var log_message = util.format('%s %s: %s\n', filename, timestamp, message);
        logFile.write(log_message);
        stdout.write(log_message);
    }

    return _wrapped;
};


function loggedReuire(module_name) {
    var timestamp = (new Date()).toISOString().replace(/T/, ' ').replace(/Z/, '');
    var log_message = util.format('%s: %s\n', timestamp, module_name);
    logFile.write(log_message);
    return require(module_name);
}


// Start sandbox for each filename
process.argv.slice(2).forEach((fileName) => {

    // Finalize context preparations
    var ctx = deepcopy(base_context);
    ctx.console.log = makeNewLog(fileName);
    ctx.require = loggedReuire;

    ctx.__filename = fileName; 
    ctx.global = ctx;

    // Create a sandbox
    var sandbox = vm.createContext(ctx);
    fs.readFile(fileName, function(err, src) {
        var script = vm.createScript(src, fileName);
        script.runInNewContext(sandbox);
    });

});


// Close logfile on exit
process.on('cleanup', function() { logFile.close(); });
process.on('exit', function() { process.emit('cleanup'); });
process.on('SIGINT', function() {
    console.log('Ctrl-C...');
    process.exit(2);
});
process.on('uncaughtException', function() {
    console.log('Uncaught Exception...');
    console.log(e.stack);
    process.exit(42);
});
