// Пример оборачивания функции в песочнице

var fs = require('fs'),
    vm = require('vm');


// Запуск фреймворка с разными приложениями через командную строку
var applicationName = process.argv[2] || 'application';

//запись в файл для логирования
function putIntoLogFile(text) {
    fs.appendFile(('./' + applicationName + '.log'), (text + '\n'), function (err) {
        if (err) throw err;
    });
}
// Обертка для callback
function wrapperCallback(parentFnName, fname) {
  return function wrapper() {
    var array = [];
    Array.prototype.push.apply(array, arguments);

    var tmp='Callback list :';
      putIntoLogFile(tmp);
      console.log(tmp);
    for (var i = 0; i < array.length; i++) {
      if (array[i] == null
          || array[i].length === 'undefined'
          || array[i].length < 100)
      {
          putIntoLogFile(array[i]);
          console.dir(array[i]);
      }
      else {
          putIntoLogFile(typeof array[i]);
          console.dir(typeof array[i]);
      }
    }
    fname.apply(undefined, array);
  }
}

// Обертка функций
function wrapperFunction(newName, fname) {
  return function wrapper() {
    var array = [];
    Array.prototype.push.apply(array, arguments);
      var now=new Date();
      var tmp= now.toDateString() + ' ' + now.toLocaleTimeString() + ' \n' + 'Call list: ' + newName;
      putIntoLogFile(tmp);
      console.log(tmp);
      putIntoLogFile(array);
      console.dir(array);

    // Когда есть callback
    if (typeof array[array.length - 1] == 'function') {

      array[array.length - 1] = wrapperCallback(
          newName,
          array[array.length - 1]
      );
    }
    fname.apply(undefined, array);
  }
}

// Функция клонирования интерфейса
function newInterface(oldInterface) {
  var clone = {};
  for (var key in oldInterface) {
    clone[key] = wrapperFunction(key, oldInterface[key]);
  }
  return clone;
}

// Клонируем fs
var mod_fs = newInterface(fs);

// Объявляем хеш из которого сделаем контекст-песочницу
var context = {
  module: {},
  console: console,
  // Помещаем ссылку на обертку к fs в песочницу
  fs: mod_fs,
  // Оборачиваем функцию setTimeout в песочнице
  setTimeout: setTimeout
    /*function(callback, timeout) {
    // Добавляем поведение при вызове setTimeout
    console.log(
      'Call: setTimeout, ' +
      'callback function: ' + callback.name + ', ' +
      'timeout: ' + timeout
    );
    setTimeout(function() {
      // Добавляем поведение при срабатывании таймера
      console.log('Event: setTimeout, before callback');
      // Вызываем функцию пользователя на событии таймера
      callback();
      console.log('Event: setTimeout, after callback');
    }, timeout);
  }*/
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
