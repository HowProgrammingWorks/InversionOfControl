// Пример оборачивания функции в песочнице

var fs = require('fs'),
    vm = require('vm');

// Объявляем хеш из которого сделаем контекст-песочницу
var context = {
  module: {},
  console: console,
  // Помещаем ссылку на fs API в песочницу
  fs: wrapAll(fs),
  // Оборачиваем функцию setTimeout в песочнице
  printStats: printStats,
  setTimeout: setTimeout,
  setInterval: setInterval
};

// Преобразовываем хеш в контекст
context.global = context;
var sandbox = vm.createContext(context);
var callCount = 0;
var avgTime = 0; 
var virtualFs = {
    rootDir: "", 
    fs: {}
}

function VirtualFile() {
    this.cached = false;
    this.content = '';
}

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
     callCount++;
     Array.prototype.push.apply(args, arguments);
     
     console.log('Call: ' + fnName);
     console.log(args);

     if(typeof args[args.length - 1] === 'function' ) {
         args[args.length - 1] = wrapFunction(fnName + ' -> callback',
                 args[args.length - 1]);
     }

     var beginMeasure = process.hrtime();
     fn.apply(undefined, args);
     var endMeasure = process.hrtime();
     var elapsedTimeMs = (endMeasure[1] - beginMeasure[0]) / 1000000;
     avgTime = (callCount*avgTime + elapsedTimeMs) / (callCount + 1); 
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

function printStats() {
    console.log('*******************************');
    console.log('Calls made to fs: ' + callCount);
    console.log('Avg function execution time: ' + avgTime + ' ms');
    console.log('*******************************');
}

