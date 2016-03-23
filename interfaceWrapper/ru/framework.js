// Пример оборачивания функции в песочнице

var fs = require('fs'),
    vm = require('vm');

// Статистика
var callbacks = 0,
    bytesRead = 0,
    bytesWritten = 0;

// Функция оборачивания callback'а
function wrapCallback(parentFnName, fn) {
  return function wrapper() {
    var args = [];
    Array.prototype.push.apply(args, arguments);

    // Подсчёт количества прочитанных байт
    if (parentFnName.indexOf('read') > -1) {
      bytesRead += args[1].length;
    }

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

    // Подсчёт количества записанных байт
    if (fnName.indexOf('write') > -1
      || fnName.indexOf('append') > -1) {
      bytesWritten += args[1].length;
    }

    console.log('Call: ' + fnName);
    console.dir(args);

    // Когда есть callback
    if (typeof args[args.length - 1] == 'function') {
      callbacks++;
      args[args.length - 1] = wrapCallback(
        fnName,
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
  fs: fake_fs,
  setInterval : setInterval
};

// Вывод статистики
setInterval(function() {
  console.log('Callbacks called : ' + callbacks
            + '\n Bytes read : ' + bytesRead
            + '\n Bytes written : ' + bytesWritten
            );
}, 30000);

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
