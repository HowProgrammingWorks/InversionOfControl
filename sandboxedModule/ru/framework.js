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

var filelog = fs.createWriteStream(__dirname + '/debug.log', {flags: 'a'});

process.on('cleanup', function() { filelog.close();});
process.on('exit', function() { process.emit('cleanup'); });
process.on('uncaughtException', function(e) {
  console.log('Uncaught Exception...');
  console.log(e.stack);
  process.exit(2);
});

function newLog (fileName) {
  return function (message) {
    var timestamp = (new Date()).toISOString().replace(/T/, ' ').replace(/Z/, '');
    message = timestamp + " " + path.normalize(fileName) + " : " + message;
    console.log.call(console, message);
    filelog.write(message + "\n");
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
