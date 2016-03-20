// Файл, демонстрирующий то, как фреймворк создает среду (песочницу) для
// исполнения приложения, загружает приложение, передает ему песочницу в
// качестве глобального контекста и получает ссылу на экспортируемый
// приложением интерфейс. Читайте README.md в нем задания.

// Фреймворк может явно зависеть от библиотек через dependency lookup
var fs = require('fs'),
    vm = require('vm');
    util = require ('util');

// Задание 4
var newConsole = {};
newConsole.log = function(message) {
	console.log(fileName + " " + new Date() + " " + message);
}

// Создаем контекст-песочницу, которая станет глобальным контекстом приложения
var context = { module: {}, console: newConsole, setTimeout: setTimeout, 
				setInterval: setInterval, util: util };
context.global = context;
var sandbox = vm.createContext(context);

// Читаем исходный код приложения из файла
// Задание 3
var fileName = process.argv[2] == null?'./application.js':process.argv[2];
fs.readFile(fileName, function(err, src) {
  // Тут нужно обработать ошибки
  if (err)
  	throw err;

  // Запускаем код приложения в песочнице
  var script = vm.createScript(src, fileName);
  script.runInNewContext(sandbox);
  
  sandbox.module.exports();
  // Забираем ссылку из sandbox.module.exports, можем ее исполнить,
  // сохранить в кеш, вывести на экран исходный код приложения и т.д.
});
