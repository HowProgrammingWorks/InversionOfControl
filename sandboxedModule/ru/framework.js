// Файл, демонстрирующий то, как фреймворк создает среду (песочницу) для
// исполнения приложения, загружает приложение, передает ему песочницу в
// качестве глобального контекста и получает ссылу на экспортируемый
// приложением интерфейс. Читайте README.md в нем задания.

// Фреймворк может явно зависеть от библиотек через dependency lookup
var fs = require('fs'),
    vm = require('vm'),
    util = require('util');

var fileName = './application.js';

// *** Задание 4 ***

var applicationConsole = {};
applicationConsole.log = function(str) { 
	fs.appendFile('log.txt',
	 fileName + " " + (new Date()) + " " + str + '/n',
	 function(err) {
	 	if(err)
	 		throw err;
	 });
	console.log(str);
};

// Создаем контекст-песочницу, которая станет глобальным контекстом приложения

// *** Задание 1 ***
var context = { module: {},
				console: console,
				setTimeout: setTimeout,
				setInterval: setInterval
			};

// *** Задание 2 ***
var context = { module: {},
				util: util,
				console: console };

// *** Задание 4 ***

var context = { module: {}, console: applicationConsole };

context.global = context;
var sandbox = vm.createContext(context);

// Читаем исходный код приложения из файла

// *** Задание 3 ***
var fileName = process.argv[2];

fs.readFile(fileName, function(err, src) {
  // Тут нужно обработать ошибки
  if(err) {
  	throw err;
  }
  // Запускаем код приложения в песочнице
  var script = vm.createScript(src, fileName);
  script.runInNewContext(sandbox);

  sandbox.module.exports();

  // Забираем ссылку из sandbox.module.exports, можем ее исполнить,
  // сохранить в кеш, вывести на экран исходный код приложения и т.д.
});
