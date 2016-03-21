// Пример оборачивания функции в песочнице

var fs = require('fs'),
    vm = require('vm');
var util = require('util');

// Объявляем хеш из которого сделаем контекст-песочницу
var context = {
  module: {},
  console: console,
  // Помещаем ссылку на fs API в песочницу
  fs: wrapAll(fs),
  // Оборачиваем функцию setTimeout в песочнице
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

/**
 * Utility functions 
 */

function cloneInterface(anInterface) {
 var clone = {};
   for (var key in anInterface) {
      clone[key] = anInterface[key];
   }
      return clone;
}

function wrapFunction(fnName, fn) {
 return function wrapper() {
     var args = [];
     Array.prototype.push.apply(args, arguments);
     
     console.log('Call: ' + fnName);
     console.log(args);
     
     if(typeof args[args.length - 1] === 'function' ) {
         args[args.length - 1] = wrapFunction('callback',
                 args[args.length - 1]);
     }

     fn.apply(undefined, args);
 }
}

function wrapAll(api) {
 var preparedApi = cloneInterface(api);
 for(var key in preparedApi) {
    if(typeof preparedApi[key] === 'function') {
        preparedApi[key] = wrapFunction(key, preparedApi[key]);
    }
 }
 return preparedApi;
}

/**
 * Framework logic 
 */

