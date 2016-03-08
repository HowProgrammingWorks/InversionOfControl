// Файл, демонстрирующий то, как фреймворк создает среду (песочницу) для
// исполнения приложения, загружает приложение, передает ему песочницу в
// качестве глобального контекста и получает ссылу на экспортируемый
// приложением интерфейс. Читайте README.md в нем задания.

// Фреймворк может явно зависеть от библиотек через dependency lookup
var fs = require('fs'),
    vm = require('vm'),
    util = require('util');


// Читаем исходный код приложения из файла
var fileName = process.argv[2] || './application.js';

function createClone(dest, src) {
  if (!dest || !src || typeof dest != 'object' || typeof src != 'object')  {
    return;
  }
  for (key in src) {
    dest[key] = src[key];
  }
}

var myConsole = {};
createClone(myConsole, console);

// меняет аргумунт функции, прибавляя к нему <applicationName> <time>
function change_input_decorator(func) {
  return function(massage) {
    var date = new Date();
    var time = [date.getHours(), date.getMinutes(), date.getSeconds()].join(':');
    var applicationName = fileName;
    massage = applicationName + " " + time + " " + massage;
    func.call(this, massage);
  }
}

myConsole.log = change_input_decorator(myConsole.log);


// Создаем контекст-песочницу, которая станет глобальным контекстом приложения
var context = {
  module: {},
  console: myConsole,
  setTimeout: setTimeout,
  setinterval: setInterval,
  clearTimeout: clearTimeout,
  clearInterval: clearInterval,
  util: util
};
context.global = context;
var sandbox = vm.createContext(context);


fs.readFile(fileName, function(err, src) {
  // Тут нужно обработать ошибки
  if(err) throw err;
  // Запускаем код приложения в песочнице
  var script = vm.createScript(src, fileName);
  script.runInNewContext(sandbox);

  // Забираем ссылку из sandbox.module.exports, можем ее исполнить,
  // сохранить в кеш, вывести на экран исходный код приложения и т.д.
});
