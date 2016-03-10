// Пример оборачивания функции в песочнице

var fs = require('fs'),
    vm = require('vm');

var statistics = {
  count:0,
  times: []
};

function grabStatistics() {
  var avg = statistics.times.reduce(function(a,b){return a+b;}, 0)/statistics.count;
  console.log('Average: '+avg);
  console.log('Total calls: '+statistics.count);
}

function wrapFunction(fnName, fn) {
  return function wrapper() {
    var args = [];
    Array.prototype.push.apply(args, arguments);
    var callback = args[args.length-1];
    
    if(typeof(callback) === 'function') {
      args[args.length-1] = wrapFunction(callback.name, args[args.length-1]);
    }  
    console.log('Call: ' + fnName);
    //console.dir(args);

    var start = (new Date()).now();
    var data = fn.apply(undefined, args);
    var end = (new Date()).now() - start;
    statistics.times.push(end);
    statistics.count++;
    return data;
  }
}

function cloneInterface(anInterface) {
  var clone = {};
  for (var key in anInterface) {
    if(typeof(anInterface[key])==='function')
      clone[key] = wrapFunction(key,anInterface[key]);
  }
  return clone;
}

// Объявляем хеш из которого сделаем контекст-песочницу
var context = {
  module: {},
  console: console,
  // Помещаем ссылку на fs API в песочницу
  fs: cloneInterface(fs),
  setTimeout: setTimeout,
  setInterval: setInterval
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
  setInterval(grabStatistics, 30000)
});
