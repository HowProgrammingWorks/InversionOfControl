// Пример оборачивания функции в песочнице

var fs = require('fs'),
    vm = require('vm');

// Объявляем хеш из которого сделаем контекст-песочницу
var context = {
  module: {},
  console: console,
  // Помещаем ссылку на fs API в песочницу
  fs: cloneInterface(fs)
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

function cloneInterface(interfaceName) {
    var clone = {};
    for (var key in interfaceName) {
        clone[key] = wrapFunction(key, interfaceName[key]);
    }
    return clone;
}

function wrapFunction(fnName, fn) {
    return function wrapper() {
        var args = [];
        var this_log = '';
        Array.prototype.push.apply(args, arguments);
        this_log  = this_log + 'Call: ' + fnName + '\nParameters  [ ';
        for(var i = 0; i < args.length; i++){
            if (args[i] instanceof Buffer) {
                this_log = this_log + i + ': Buffer length: ' + args[i].length + ' '; 
            } else if(typeof (args[i]) === 'function') {
                this_log = this_log + i + ': Function ';
                args[i] = wrapFunction('callback', args[i]);
            } else {
                this_log = this_log + i + ': ' + args[i] + ' ';
            }
        }
        this_log = this_log + ']';
        console.log(this_log);
        fs.appendFile('./application.log', (this_log + '\n'), function(err){});
        return fn.apply(undefined, args);
    }
}
