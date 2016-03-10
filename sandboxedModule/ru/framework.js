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
var outputFile_require = 'require_output.txt';

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
  str = add_time(str);
  var applicationName = fileName;
  str = applicationName + " " + str;
  return str;
}

// прибавляет к строке <time>
function add_time(str) {
  var date = new Date();
  var time = [date.getHours(), date.getMinutes(), date.getSeconds()].join(':');
  str = time + " " + str;
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
    fs.appendFile(fileName, output, {flag: 'a'}, (err) => {
      if(err) {
        throw err;
      }
    })
    func.call(this, massage);
  }
}

myConsole.log = decorate_input(myConsole.log, add_applicationName_time);
myConsole.log = decorate_logging(myConsole.log, outputFile, add_applicationName_time);
var myRequire = decorate_logging(require, outputFile_require, add_time);
// Создаем контекст-песочницу, которая станет глобальным контекстом приложения
var context = {
  module: {},
  console: myConsole,
  setTimeout: setTimeout,
  setInterval: setInterval,
  clearTimeout: clearTimeout,
  clearInterval: clearInterval,
  util: util,
  require : myRequire
};
context.global = context;
var sandbox = vm.createContext(context);


fs.readFile(fileName, function(err, src) {
  // Тут нужно обработать ошибки
  if(err) throw err;
  // Запускаем код приложения в песочнице
  var script = vm.createScript(src, fileName);
  script.runInNewContext(sandbox);


  var module_exports = sandbox.module.exports;


  // Task 7 распечатать експорт
  for (var k in module_exports) {
    console.log(k + " - " + typeof module_exports[k]);
  }

  // Task 8 распечатать список аргументов функции
  var func2_str = module_exports.func2.toString();
  console.log(func2_str);
  var func2_args_str = func2_str.slice(func2_str.indexOf('(') + 1, func2_str.indexOf(')'));
  console.log('arguments : ' + func2_args_str);
  console.log('num of args: ' + func2_args_str.split(',').length);

  // сохранить в кеш, вывести на экран исходный код приложения и т.д.
});
