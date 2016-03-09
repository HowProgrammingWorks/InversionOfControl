// Файл, демонстрирующий то, как фреймворк создает среду (песочницу) для
// исполнения приложения, загружает приложение, передает ему песочницу в
// качестве глобального контекста и получает ссылу на экспортируемый
// приложением интерфейс. Читайте README.md в нем задания.

// Фреймворк может явно зависеть от библиотек через dependency lookup
var fs = require('fs'),
    vm = require('vm'),
    util = require('util');

var fileName = './application.js';
var applicationConsole = {};
applicationConsole.log = function(str) { 
	console.log(fileName + " " + (new Date()) + " " + str); 
	console.log(str);
};
// applicationConsole.log = function(str) {
// 	console.log(console.log.toString());
// 	console.log(fileName + " " + (new Date()) + " " + str);
// 	console.log(str);
// }
// Создаем контекст-песочницу, которая станет глобальным контекстом приложения
var context = { module: {}, console: applicationConsole };
context.global = context;
var sandbox = vm.createContext(context);

// Читаем исходный код приложения из файла
fs.readFile(fileName, function(err, src) {
  // Тут нужно обработать ошибки
  
  // Запускаем код приложения в песочнице
  var script = vm.createScript(src, fileName);
  script.runInNewContext(sandbox);

  sandbox.module.exports();
 
  // Забираем ссылку из sandbox.module.exports, можем ее исполнить,
  // сохранить в кеш, вывести на экран исходный код приложения и т.д.
});
