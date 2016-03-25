// Файл, демонстрирующий то, как фреймворк создает среду (песочницу) для
// исполнения приложения, загружает приложение, передает ему песочницу в
// качестве глобального контекста и получает ссылу на экспортируемый
// приложением интерфейс. Читайте README.md в нем задания.

// Фреймворк может явно зависеть от библиотек через dependency lookup
var fs = require('fs'),
    vm = require('vm'),
	util = require('util'),
	path = require('path');

// Чоздаем контекст-песочницу, которая станет глобальным контекстом приложения
var context = { 
	module: {}, 
	console: {
		log: function() {
			[].unshift.call(arguments, path.basename(__filename), new Date());
			console.log.apply(this, arguments);
		}
	} 
};

context.global = context;
var sandbox = vm.createContext(context);

// Запуск фреймворка с разными приложениями через командную строку
var applicationName = process.argv[2] || 'application';


// Читаем исходный код приложения из файла
var fileName = './' + applicationName + '.js';

fs.readFile(fileName, function(err, src) {
  // Тут нужно обработать ошибки
  
  // Запускаем код приложения в песочнице
  var script = vm.createScript(src, fileName);
  script.runInNewContext(sandbox);
  
  // Забираем ссылку из sandbox.module.exports, можем ее исполнить,
  // сохранить в кеш, вывести на экран исходный код приложения и т.д.
});