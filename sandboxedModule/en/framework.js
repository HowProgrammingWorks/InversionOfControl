'use strict';

// Example showing us how the framework creates an environment (sandbox) for
// appication runtime, load an application code and passes a sandbox into app
// as a global context and receives exported application interface

// The framework can require core libraries
global.api = {};
api.fs = require('fs');
api.vm = require('vm');

// Create a hash and turn it into the sandboxed context which will be
// the global context of an application
const context = { module: {}, console };
context.global = context;
const sandbox = api.vm.createContext(context);

// Read an application source code from the file
const fileName = './application.js';
api.fs.readFile(fileName, 'utf8', (err, src) => {
  // We need to handle errors here

  // Run an application in sandboxed context
  const script = api.vm.createScript(src, fileName);
  script.runInNewContext(sandbox);

  // We can access a link to exported interface from sandbox.module.exports
  // to execute, save to the cache, print to console, etc.
});
