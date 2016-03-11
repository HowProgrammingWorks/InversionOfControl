// Файл, демонстрирующий то, как фреймворк создает среду (песочницу) для
// исполнения приложения, загружает приложение, передает ему песочницу в
// качестве глобального контекста и получает ссылу на экспортируемый
// приложением интерфейс. Читайте README.md в нем задания.

// Фреймворк может явно зависеть от библиотек через dependency lookup
var fs   = require('fs'),
    vm   = require('vm'),
	util = require('util');

// Чоздаем контекст-песочницу, которая станет глобальным контекстом приложения
var context = {
  module      : {},
  console     : console,
  setTimeout  : setTimeout,
  setInterval : setInterval,
  util        : util
  };

 //console.log(process.argv[2]);
 
 
 
 
context.global = context;
var sandbox = vm.createContext(context);

for (var i in process.argv)
{
	if(i>1){
	var fileN = './' + process.argv[i] + '.js';
	fs.readFile(fileN, function(err, src){
		
			var script = vm.createScript(src, fileN);
			script.runInNewContext(sandbox);
	});
	}
}

// Читаем исходный код приложения из файла
//var fileName = './application2.js';
//fs.readFile(fileName, function(err, src) {
  // Тут нужно обработать ошибки
  
  // Запускаем код приложения в песочнице
  
  
  // Забираем ссылку из sandbox.module.exports, можем ее исполнить,
  // сохранить в кеш, вывести на экран исходный код приложения и т.д.
//});
