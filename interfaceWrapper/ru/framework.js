// Пример оборачивания функции в песочнице

var fs = require('fs'),
    vm = require('vm');

var fstatistics = {
	num:0;
	fileTime:[];
}

function statisticsOfFile(){
	

}

function wrapFunction(fnName, fn) {
    return function wrapper() {
      var start = new Data();
      var args = [];
      Array.prototype.push.apply(args, arguments);
      var callback = args[args.length-1];
      if (typeof(callback) === "function")
		args[args.length-1] = wrapFunction(callback.name, callback);
      console.log('Call: ' + fnName);
      console.dir(args);
      var data = fs.apply(undefined, args);
      var fin = new Data();
      return fn.apply(undefined, args);
    }
}

function cloneInterface(anInterface){ var clone = {};
    for (var key in anInterface) {
      clone[key] = wrapFunction(key, anInterface[key]);
    }
    return clone;
}
// Объявляем хеш из которого сделаем контекст-песочницу
var context = {
  module: {},
  console: console,
  // Помещаем ссылку на fs API в песочницу
  fs: cloneInterface(fs),
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
