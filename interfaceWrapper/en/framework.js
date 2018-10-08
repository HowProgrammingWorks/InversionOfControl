'use strict';

// Wrapping function and interface example

global.api = {};
api.fs = require('fs');
api.vm = require('vm');

// Create a hash for application sandbox
const context = {
  module: {},
  console,
  // Forward link to fs API into sandbox
  fs: api.fs,
  // Wrapper for setTimeout in sandbox
  setTimeout: (callback, timeout) => {
    // Logging all setTimeout calls
    console.log(
      'Call: setTimeout, ' +
      'callback function: ' + callback.name + ', ' +
      'timeout: ' + timeout
    );
    setTimeout(() => {
      // Logging timer events before application event
      console.log('Event: setTimeout, before callback');
      // Calling user-defined timer event
      callback();
      console.log('Event: setTimeout, after callback');
    }, timeout);
  }
};

// Turn hash into context
context.global = context;
const sandbox = api.vm.createContext(context);

// Read an application source code from the file
const fileName = './application.js';
api.fs.readFile(fileName, 'utf8', (err, src) => {
  // Run an application in sandboxed context
  const script = api.vm.createScript(src, fileName);
  script.runInNewContext(sandbox);
});
