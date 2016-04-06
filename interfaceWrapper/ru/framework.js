// Пример оборачивания функции в песочнице

var fs = require('fs'),
    vm = require('vm');

var writtenBytes = 0,
    callbacks = 0;

function cloneInterface(anInterface) {
  var clone = {};
  for (var key in anInterface) {
    clone[key] = wrapFunction(key, anInterface[key]);
  }
  return clone;
}

function wrapFunction(fnName, fn, flag) {
  return function wrapper() {
    var args = [];
    Array.prototype.push.apply(args, arguments);

    if (fnName != undefined && (
      fnName.indexOf('append') > -1
       || fnName.indexOf('write') > -1)
      ) {
      writtenBytes += args[1].length;
    } 

    for (var i = 0; i < args.length; i++) {
      if (args[i] == null || args[i].length === 'undefined' || args[i].length < 100) {
        console.log('Call: ' + fnName);
        console.dir(args[i]);
      } else {
        console.log(typeof args);
      }
    }

    if (typeof args[args.length - 1] == "function") {
        callbacks++;
        args[args.length - 1] = wrapFunction(undefined, args[args.length - 1]);
    }

    fn.apply(undefined, args);
  }
}

var new_fs = cloneInterface(fs);

// Объявляем хеш из которого сделаем контекст-песочницу
var context = {
  module: {},
  console: console,
  // Помещаем ссылку на fs API в песочницу
  fs: new_fs,
  setInterval: setInterval
};

setInterval(function () {
  console.log("Bytes are written: " + writtenBytes);
  console.log("Callbacks: " + callbacks);
  }, 20000);

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
