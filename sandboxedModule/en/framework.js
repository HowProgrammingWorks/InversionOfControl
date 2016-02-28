// Example showing us how the framework creates an environment (sandbox) for
// appication runtime, load an application code and passes a sandbox into app
// as a global context and receives exported application interface

// The framework can require core libraries
var fs = require('fs'),
    vm = require('vm');

var injections = {};
var apis = {
    local: [],
    global: []
};
var configurations = {};
var mainScriptFile;
var frameworkLoaded = false;

// Create a hash and turn it into the sandboxed context which will be
// the global context of an application
var context = { module: {}, console: {log: console.log} };
    context.global = context;
var sandbox = vm.createContext(context);


// Read an application source code from the file
var fileName = './'
if(process.argv[2] != undefined) {
    fileName += process.argv[2]
} else {
    fileName += 'application.js'
}



function Api( api ) {
    if(typeof(api) === 'object') {
        if(api.name.startsWith('./')) {
            apis.local[api.name] = api;
            api.resolved = false;
        } else {
            apis.global.push(api);
            api.resolved = false;
        }
    }
}

function Main ( path ) {
    if(typeof(path) === 'string') {
            mainScriptFile = path;
    }
}

function copy(dest, src) {
    if(typeof(src) === 'object' && typeof(dest) == 'object') {
        for(key in src) {
            dest[key] = src[key];
        }
    }
}

function decorate(f, before, after) {
  return function() {
    if(before != undefined) {
      before.apply(this, arguments);
    }
    f.apply(arguments);
    if(after != undefined) {
      after.apply(this, arguments);
    }
  }
}

function resolveApi( api ) {
   var apiObj = apis.local [ api ];
   if(!apiObj) {
     apiObj = apis.local [api] = {};
   }
   var resolvedContext = {};
  
   var resolvedImport = apiObj.imports ? apiObj.imports : {};
   copy(resolvedContext, resolvedImport);
   delete apiObj.imports; 

   resolvedContext.module = {};
   resolvedContext.global = resolvedContext;
   
   apiObj.resolvedContext = resolvedContext;

   return apiObj;
}

function configure () {
      if( !mainScriptFile ) {
        return;
      }

    fs.readFile(mainScriptFile, function(err, src) {
      // We need to handle errors here
      if(err) {
        console.log(err);
      }
      // Run an application in sandboxed context

      var script = vm.createScript(src, mainScriptFile);
      var sandbox = vm.createContext(resolveApi(mainScriptFile).resolvedContext);
      script.runInNewContext(sandbox);

      // We can access a link to exported interface from sandbox.module.exports
      // to execute, save to the cache, print to console, etc.
    });
}

function load() {
  if(!frameworkLoaded) {
    copy(global, module.exports);
    frameworkLoaded  = true;
  } 
}

/*
*/

module.exports = {
    load: load,
    configure: configure,
    Api: Api,
    Main: Main
}
