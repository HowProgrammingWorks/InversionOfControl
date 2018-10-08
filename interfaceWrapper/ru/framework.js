'use strict';

global.api = {};
api.fs = require('fs');
api.vm = require('vm');

const wrapFunction = (fnName, fn) => (...args) => {
  if (args.length > 0) {
    let callback = args[args.length - 1];
    if (typeof callback === 'function') {
      args[args.length - 1] = (...pars) => {
        console.log(`Callback: ${fnName}`);
        callback(...pars);
      };
    } else {
      callback = null;
    }
  }
  console.log(`Call: ${fnName}`);
  console.dir(args);
  fn(...args);
};

const cloneInterface = anInterface => {
  const clone = {};
  for (const key in anInterface) {
    const fn = anInterface[key];
    clone[key] = wrapFunction(key, fn);
  }
  return clone;
};

const context = { module: {}, console, fs: cloneInterface(api.fs) };

context.global = context;
const sandbox = api.vm.createContext(context);

const fileName = './application.js';
api.fs.readFile(fileName, 'utf8', (err, src) => {
  const script = api.vm.createScript(src, fileName);
  script.runInNewContext(sandbox);
});
