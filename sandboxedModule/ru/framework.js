// Файл, демонстрирующий то, как фреймворк создает среду (песочницу) для
// исполнения приложения, загружает приложение, передает ему песочницу в
// качестве глобального контекста и получает ссылу на экспортируемый
// приложением интерфейс. Читайте README.md в нем задания.

// Фреймворк может явно зависеть от библиотек через dependency lookup
var fs = require('fs'),
    vm = require('vm');
    util = require('util');
    path = require('path');

// Создаем контекст-песочницу, которая станет глобальным контекстом приложения
var context = {
    module: {},
    console: console,
    setInterval: setInterval,
    setTimeout: setTimeout,
    clearInterval: clearInterval,
    util: util
  };

context.global = context;

// Wrapper for console.log
function wrapped(filename) {
  if(console.log) {
    var oldConsoleLog = console.log;

    var date = new Date();
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var day = date.getDate();

    console.log = function(){
      Array.prototype.unshift.call(arguments, '[', day, month, year, filename, ']:');
      oldConsoleLog.apply(this, arguments);
    }
  }
};
process.argv.slice(2).forEach((filename) => {
  var sandbox = vm.createContext(context);

  wrapped(filename);

  // Читаем исходный код приложения из файла
  fs.readFile(filename, function(err, src) {
    // Тут нужно обработать ошибки

    // Запускаем код приложения в песочнице
    var script = vm.createScript(src, filename);
    script.runInNewContext(sandbox);

    // Забираем ссылку из sandbox.module.exports, можем ее исполнить,
    // сохранить в кеш, вывести на экран исходный код приложения и т.д.
  });
});
