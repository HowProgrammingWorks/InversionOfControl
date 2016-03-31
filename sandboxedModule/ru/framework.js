// Файл, демонстрирующий то, как фреймворк создает среду (песочницу) для
// исполнения приложения, загружает приложение, передает ему песочницу в
// качестве глобального контекста и получает ссылу на экспортируемый
// приложением интерфейс. Читайте README.md в нем задания.

// Фреймворк может явно зависеть от библиотек через dependency lookup
var fs = require('fs'),
    vm = require('vm'),
    path = require('path');

// Создаем контекст-песочницу, которая станет глобальным контекстом приложения
var newConsole = {};

function newLog (filename) {
  return function (message) {
    var timestamp = (new Date()).toISOString().replace(/T/, ' ').replace(/Z/, '');
    message = timestamp + " " + path.normalize(filename) + " : " + message;
    console.log.call(console, message);
  }
}

var context = {
  module: {},
  console: newConsole,
  setInterval : setInterval,
  setTimeout : setTimeout,
  clearInterval : clearInterval,
  util : require("util")
};

context.global = context;
var sandbox = vm.createContext(context);

// Читаем исходный код приложения из файла
var fileName = process.argv[2] || './application.js';
context.console.log = newLog(fileName);
fs.readFile(fileName, function(err, src) {
  // Тут нужно обработать ошибки
  
  // Запускаем код приложения в песочнице
  var script = vm.createScript(src, fileName);
  script.runInNewContext(sandbox);
  
  // Забираем ссылку из sandbox.module.exports, можем ее исполнить,
  // сохранить в кеш, вывести на экран исходный код приложения и т.д.
});
