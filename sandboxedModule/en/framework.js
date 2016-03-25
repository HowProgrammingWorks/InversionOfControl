// Файл, демонстрирующий то, как фреймворк создает среду (песочницу) для
// исполнения приложения, загружает приложение, передает ему песочницу в
// качестве глобального контекста и получает ссылу на экспортируемый
// приложением интерфейс. Читайте README.md в нем задания.

// Фреймворк может явно зависеть от библиотек через dependency lookup
var fs = require('fs'),
    vm = require('vm'),
	util = require('util');
	//path = require('path');

// Запуск фреймворка с разными приложениями через командную строку
var applicationName = process.argv[2] || 'application';	
	
// Чоздаем контекст-песочницу, которая станет глобальным контекстом приложения
var sandboxConsole = {};
sandboxConsole.log = function() {
      var now = new Date();
      var this_log = applicationName + ' ' + now.toDateString() + ' ' + now.toLocaleTimeString() + ' ' + arguments[0];
	  
	  fs.appendFile(('./' + applicationName + '.log'), (this_log + '\n'), function(err){
        if (err) throw err; 
      });
	  
      console.log(this_log);
}

 var context = { module: {},
                console: sandboxConsole,
                setTimeout: setTimeout,
                setInterval: setInterval,
                //clearInterval: clearInterval,
                util: util,
               }; 
  
context.global = context;
var sandbox = vm.createContext(context);


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