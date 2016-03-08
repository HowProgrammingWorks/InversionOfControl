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
var outputFile = 'output.txt';

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

// прибавляет к строке <applicationName> <time>
function add_applicationName_time(str) {
  var date = new Date();
  var time = [date.getHours(), date.getMinutes(), date.getSeconds()].join(':');
  var applicationName = fileName;
  str = applicationName + " " + time + " " + str;
  return str;
}

// меняет аргумент функции с помощью функции change_input
function decorate_input(func, change_input) {
  return function(massage) {
    massage = change_input(massage);
    func.call(this, massage);
  }
}

// записывает аргумент вызова функции в файл fileName
// меняет вывод с помощью функции change_output
function decorate_logging(func, fileName, change_output) {
  return function(massage) {
    var output = massage;
    if (change_output) {
      output = change_output(massage);
    }
    output += '\n';
    fs.appendFile(fileName, output, {flag: 'a'}, (err)=> {
      if(err) {
        throw err;
      }
    })
    func.call(this, massage);
  }
}

myConsole.log = decorate_input(myConsole.log, add_applicationName_time);
myConsole.log = decorate_logging(myConsole.log, outputFile, add_applicationName_time);

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
