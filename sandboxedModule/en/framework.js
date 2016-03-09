// Example showing us how the framework creates an environment (sandbox) for
// appication runtime, load an application code and passes a sandbox into app
// as a global context and receives exported application interface

// The framework can require core libraries
var fs = require('fs'),
    vm = require('vm');
    di = require('./DiClasses');
    path = require('path');

var injections = {};
var apis = {};
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

// Declaration functions
var diDecl = {};
diDecl.Api = function( api ) {
    if(typeof(api) === 'object') {
        var apiObj = new di.Api(api.name, api.imports, api.apis);
        if(api.options) {
            apiObj.options = api.options;
        }
        apis[apiObj.name] = apiObj;
    }
}

diDecl.Main = function Main ( path ) {
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

    return dest;
}

function resolveApi( api ) {
  var apiObj = apis[api];
  
  // resolve already resolved global api
  if(apiObj && apiObj.lookup === 'GLOBAL') {
     return apiObj;
  } 

  // resolve not resolved global api
  if(!apiObj && di.lookupType(api) === 'GLOBAL') {
      try {
        var resolvedRequire = require(api);
      }catch(e) {
        return new di.Api(api);
      }

      apiObj = new di.Api(api);

      if(resolvedRequire) {
        apiObj.resolvedContext[api] = resolvedRequire;
        return apiObj;
      }

      return new di.Api(api);
  } 
    
  // return a stab if cannot resolve
  if(!apiObj) {
    return new di.Api(api);
  }  

  // resolve a local api
   if(apiObj.resolved) {
        return apiObj;
   }

   copy(apiObj.resolvedContext, apiObj.imports);
   apiObj.imports = {};
   
   for(var i = 0; i < apiObj.injectedApis.length; i++) {
     var depend = resolveApi(apiObj.injectedApis[i]);
     copy(apiObj.resolvedContext, depend.resolvedContext);
   }
   
   apiObj.resolved = true;

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
      var apiObj = resolveApi(mainScriptFile);
      var sandbox = vm.createContext(copy({}, apiObj.resolvedContext));
      script.runInNewContext(sandbox);
      if(apiObj.options.debugPrintCache === true) {
        console.log(apiObj.name + ' cache:');
        console.log(sandbox);
      }
      if(apiObj.options.debugPrintModuleCache === true) {
        if(sandbox.module.exports) {
            for(key in sandbox.module.exports) {
                console.log(key + "\t\t" + typeof(sandbox.module.exports[key])); 
            }
        }
      }

      // We can access a link to exported interface from sandbox.module.exports
      // to execute, save to the cache, print to console, etc.
    });
}

function load() {
  process.chdir(path.dirname(process.argv[1]));
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
    Api: diDecl.Api,
    Main: diDecl.Main
}
