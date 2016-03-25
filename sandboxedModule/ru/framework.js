// Файл, демонстрирующий то, как фреймворк создает среду (песочницу) для
// исполнения приложения, загружает приложение, передает ему песочницу в
// качестве глобального контекста и получает ссылу на экспортируемый
// приложением интерфейс. Читайте README.md в нем задания.

// Фреймворк может явно зависеть от библиотек через dependency lookup
var fs = require('fs'),
    vm = require('vm'),
    util = require('util');

// Запуск фреймворка с разными приложениями через командную строку
var applicationName = process.argv[2] || 'application';

//запись в файл для логирования
function putIntoLogFile(text) {
  fs.appendFile(('./' + applicationName + '.log'), (text + '\n'), function (err) {
    if (err) throw err;
  });
}
// Обертка для вызова console.log()
var sandboxConsole = {};
sandboxConsole.log = function() {
  var now = new Date();
  var this_log = applicationName + ' ' + now.toDateString() + ' ' + now.toLocaleTimeString() + ' ' + arguments[0];

  putIntoLogFile(this_log);

  console.log(this_log);
  }

// Обертка для вызова require
function wrappedRequire(lib){
  var now =new Date();
  var this_log = now.toDateString() + ' ' + now.toLocaleTimeString() + ' ' + lib;

  putIntoLogFile(this_log);

  return require(lib);
}

// Создаем контекст-песочницу, которая станет глобальным контекстом приложения
var context = { module: {},
  console: sandboxConsole,
  setTimeout: setTimeout,
  setInterval: setInterval,
  clearInterval: clearInterval,
  util: util,
  require: wrappedRequire
};
context.global = context;
var sandbox = vm.createContext(context);

var before = Object.keys(sandbox);

// Читаем исходный код приложения из файла
var fileName = './' + applicationName + '.js';

fs.readFile(fileName, function(err, src) {
  // Тут нужно обработать ошибки

  // Запускаем код приложения в песочнице
  var script = vm.createScript(src, fileName);
  script.runInNewContext(sandbox);
  
  // Забираем ссылку из sandbox.module.exports, можем ее исполнить,
  // сохранить в кеш, вывести на экран исходный код приложения и т.д.
  var fromSandbox = sandbox.module.exports;
      for(var key in fromSandbox){
            console.log(key + ' ' + typeof (fromSandbox[key]));
      }
  console.log('Exported function:\n'+
                      'text ' + fromSandbox.print.toString());

  var after = Object.keys(sandbox);

  console.log('Keys from framework befor start application:' +
                      before + '\nKeys from framework befor start application:' + after);

  var added = 0, finded = 0;
  for(var i in after){
    checked = false;
    for(var j in before){
      if(i==j){
        checked = true;
        break;
      }
    }
    if(checked){
      finded++;
    }
    else{
      added++;
    }
  }
  console.log('Added: ' + added + ', deleted: ' + (before.length - finded));
});
