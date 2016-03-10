// Файл, демонстрирующий то, как фреймворк создает среду (песочницу) для
// исполнения приложения, загружает приложение, передает ему песочницу в
// качестве глобального контекста и получает ссылу на экспортируемый
// приложением интерфейс. Читайте README.md в нем задания.

// Фреймворк может явно зависеть от библиотек через dependency lookup
var fs = require('fs'),
    vm = require('vm');
    util = require('util');
    path = require('path');

// Writable stream for tasks 5 and 6
var stream = fs.createWriteStream('log.txt', {flags: 'a'});

// Context factory
function contextFactory(filename) {
  var context = {
    module: {},
    console: clone(console),
    setInterval: setInterval,
    setTimeout: setTimeout,
    clearInterval: clearInterval,
    util: util
  };
  context.global = context;
  var sandbox = vm.createContext(context);

  // Task 4: wrapping console.log()
  context.console.log = function(msg) {
    var date = new Date().toLocaleTimeString();
    console.log('['+date+'] '+filename+' >> '+msg);

    // Task 5: logging console output into a file
    stream.write('['+date+'] '+filename+' >> '+msg+'\n');
  };

  // Task 6: wrapping require function for logging to a file
  sandbox.require = function(moduleName) {
    var date = new Date().toLocaleTimeString();
    stream.write('['+date+'] '+moduleName+' is required.\n');
    return require(moduleName);
  }

  return sandbox;
};

function clone(obj) {
  var res = {};
  for (var key in obj) res[key] = obj[key];
  return res;
}


// Task 3: runs different applications using command line option
process.argv.slice(2).forEach((filename) => {
  var sandbox = contextFactory(filename);

  var oldKeys = {};
  for (var key in sandbox.global) {
    oldKeys[key] = sandbox.global[key];
  }

  fs.readFile(filename, (err, src) => {
    var script = vm.createScript(src, filename);
    script.runInNewContext(sandbox);
    console.log('-----'+filename+':-----');

    // Task 10: Compare an application sandboxed context keys before 
    // application loaded and after, print it from the framework 
    // and find a difference (keys added / deleted)
    console.log('-----Task 10: comparing keys-----')
    var newKeys = {};
    for (var key in sandbox.global) {
      newKeys[key] = sandbox.global[key];
    }
    console.log('Added keys:');
    for (var key in newKeys) {
      if (!(key in oldKeys)) {
        console.log(key);
      }
    }
    console.log('Deleted keys:');
    for (var key in oldKeys) {
      if (!(key in newKeys)) {
        console.log(key);
      }
    }

    // Task 7: print the list of exports with types
    console.log('-----Task 7: list of exports-----')
    for (var key in sandbox.module.exports)
      console.log(key + ': ' + typeof sandbox.module.exports[key]);

    // Task 8: Export a function from application.js
    // and print its parameter count and source code
    if (filename == 'application.js') {
      console.log('-----Task 8-----')
      console.log('Source code for function "printString":');
      console.log(sandbox.module.exports.printString.toString());
      console.log('Parameter count for function "printString": '+
        sandbox.module.exports.printString.toString().
        replace(/.+\(/, '').replace(/\)[^]+/, '').split(/, +/).length);
    }
  });  
});

process.on('exit', () => {
  stream.close();
});