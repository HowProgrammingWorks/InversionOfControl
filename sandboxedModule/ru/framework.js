// Файл, демонстрирующий то, как фреймворк создает среду (песочницу) для
// исполнения приложения, загружает приложение, передает ему песочницу в
// качестве глобального контекста и получает ссылу на экспортируемый
// приложением интерфейс. Читайте README.md в нем задания.

// Фреймворк может явно зависеть от библиотек через dependency lookup
var fs = require('fs'),
    vm = require('vm'),
    util = require('util');

// Чоздаем контекст-песочницу, которая станет глобальным контекстом приложения
var context = { module: {},
  console: create_clone(console),
  setTimeout: setTimeout,
  setInterval: setInterval,
  util: util
};



context.global = context;
var sandbox = vm.createContext(context);

// Читаем исходный код приложения из файла
var fileName = process.argv[2] || './application.js';
fs.readFile(fileName, function(err, src) {
  // Тут нужно обработать ошибки
  if(err)throw err;


  // Запускаем код приложения в песочнице
  var script = vm.createScript(src, fileName);
  script.runInNewContext(sandbox);
  
  // Забираем ссылку из sandbox.module.exports, можем ее исполнить,
  // сохранить в кеш, вывести на экран исходный код приложения и т.д.
});
context.console.log = function(s) {

  var date = new Date().toLocaleTimeString();
  console.log(fileName + '... ' + date + '---' + s);
   };
function create_clone(obj){
	var outObj={};
	for(var i in obj){
			outObj[i]=obj[i];
	}
	return outObj;
}