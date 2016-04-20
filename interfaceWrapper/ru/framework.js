// Пример оборачивания функции в песочнице

var fs = require('fs'),
    vm = require('vm');

// Объявляем хеш из которого сделаем контекст-песочницу

var Statistics={
  callbacks:0,
  fnCalls:0,
  callbacksWorkTime:0
};
//Клонування інтерфейсу
function cloneInterface(interfaceName){
  function DeepClone(obj,res) {
        for (var key in obj) {
            if (typeof obj[key] === 'object') {
                res[key] = {};
                DeepClone(obj[key], res[key]);
            } else {
                res[key] = wrapFunction(key, obj[key]);
            }
          }
    }
    var NewInterface={};
    DeepClone(interfaceName,NewInterface);
    return NewInterface;
}
//Обгортка навколо fn
function wrapFunction(fnName, fn) {
  return function wrapper() {
    var args = [];
    Array.prototype.push.apply(args, arguments);

    console.log('--------------------------------------------------------------------');
    console.log('Call: ' + fnName);
    console.dir(args);
    console.log('--------------------------------------------------------------------');

    if (typeof args[args.length - 1] == 'function') {
      args[args.length - 1] = wrapCallback(
        fnName,
        args[args.length - 1]
      );
    }
    Statistics.fnCalls++;
    fn.apply(undefined, args);
  }
}
//Новий callback
function wrapCallback(parentFnName, fn) {
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
    Statistics.callbacks++;
    var s = Date.now();
    fn.apply(undefined, args);
    Statistics.callbacksWorkTime+= Date.now() - s;
  }
}
var context = {
  module: {},
  console: console,
  setInterval:setInterval,
  // Помещаем ссылку на fs API в песочницу
  fs: cloneInterface(fs),
};
setInterval(function() {
  console.log('Callbacks called : ' + Statistics.callbacks
            + (Statistics.callbacks ? '\nAverage callback work time : ' + (1.0 * Statistics.callbacksWorkTime / Statistics.callbacks) + 'ms' : '')
            + '\n Fn called : ' + Statistics.fnCalls
            );
}, 10000);
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
