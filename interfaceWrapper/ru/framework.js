// Пример оборачивания функции в песочнице

var fs = require('fs'),
    vm = require('vm');

function wrapCallback(fn) {
  return function wrapper() {
    var args = [];
    Array.prototype.push.apply(args, arguments);
    console.log('Callback :');
    for (var i = 0; i < args.length; i++) {
      if (args[i] == null
        || args[i].length === 'undefined'
        || args[i].length < 100)
        console.dir(args[i]);
      else {
        console.dir(typeof args[i]);
      }
    }
    fn.apply(undefined, args);
  }
}

// Функция для оборачивания функции
function wrapFunction(fnName, fn) {
  return function wrapper() {
    var args = [];
    Array.prototype.push.apply(args, arguments);
    console.log('Call: ' + fnName);
    console.dir(args);
    if (typeof args[args.length - 1] == 'function') {
      args[args.length - 1] = wrapCallback(
        args[args.length - 1]
      );
    }
    fn.apply(undefined, args);
  }
}

// Функция клонирования интерфейса
function cloneInterface(anInterface) {
  var clone = {};
  for (var key in anInterface) {
    clone[key] = wrapFunction(key, anInterface[key]);
  }
  return clone;
}

// Клонируем fs
var fake_fs = cloneInterface(fs);

// Объявляем хеш из которого сделаем контекст-песочницу
var context = {
  module: {},
  console: console,
  // Помещаем ссылку на fs API в песочницу
  fs: fake_fs
};

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
