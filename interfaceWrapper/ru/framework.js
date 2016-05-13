// Пример оборачивания функции в песочнице

var fs = require('fs'),
vm = require('vm');

var callbacks = 0;
// Объявляем хеш из которого сделаем контекст-песочницу
var context = {
  module: {},
  console: console,
  // Помещаем ссылку на fs API в песочницу
  fs: wrap(fs),
  setInterval: setInterval,
  setTimeout: setTimeout,
  clearInterval: clearInterval
};

setInterval(function() {
  console.log("=========== Callbacks: " + callbacks + "==========");
}, 5000);

// Преобразовываем хеш в контекст
context.global = context;
var sandbox = vm.createContext(context);

// Читаем исходный код приложения из файла
var fileName = './application.js';
fs.readFile(fileName, function(err, src) {
  // Запускаем код приложения в песочнице
  var script = vm.createScript(src, fileName);
  script.runInNewContext(sandbox);
});

function cloneInterface(anInterface) {
  var clone = {};
  for (var key in anInterface) {
    clone[key] = anInterface[key];
    //clone[key] = wrapFunction(key, anInterface[key]);
  }
  return clone;
}

function wrapFunction(fnName, fn) {
  return function wrapper() {
    var args = [];
    Array.prototype.push.apply(args, arguments);
    console.log('Call: ' + fnName);
    //console.log('Args length: ' +  args.length);
    console.dir(args);

    if (typeof args[args.length - 1] == "function") {
        callbacks++;
        args[args.length - 1] = wrapFunction('callback', args[args.length - 1]);
      }

      return fn.apply(undefined, args);
    }
  }

  function wrap(module) {
    var wrappedModule = cloneInterface(module);
    for(var i in wrappedModule) {
      if(typeof wrappedModule[i] === 'function') {
        wrappedModule[i] = wrapFunction(i, wrappedModule[i]);
      }
    }
    return wrappedModule;
  }