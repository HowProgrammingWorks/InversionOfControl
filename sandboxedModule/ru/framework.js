// Файл, демонстрирующий то, как фреймворк создает среду (песочницу) для
// исполнения приложения, загружает приложение, передает ему песочницу в
// качестве глобального контекста и получает ссылу на экспортируемый
// приложением интерфейс. Читайте README.md в нем задания.

// Фреймворк может явно зависеть от библиотек через dependency lookup

var fs = require('fs'),
    vm = require('vm'),
    util = require('util');

var applicationConsole = {};


///////////////////////////////////////////////////////Task 6 - Users Require //
var applicationRequire = function(module) {
	fs.appendFile('log.txt', new Date() + " | " + module + '\n', 
		(err) => {
			if (err)
				throw err;
	});
	return require(module);
}
///////////////////////////////////////////////////////Task 4-5 - Users Console.log //
applicationConsole.log = function(str) { 
	console.log(fileName + " | " + (new Date()) + " | " + str); 
	fs.appendFile('log.txt',
	 fileName + " | " + (new Date()) + " | " + str + '\n',
	 (err)=> {
	 	if(err)
	 		throw err;
	 }
	);
};

// Создаем контекст-песочницу, которая станет глобальным контекстом приложения
var context = { 
				module: {}, 
				require:applicationRequire,
				console: applicationConsole ,
				setInterval:setInterval,
				setTimeout:setTimeout,
				util:util
			};
context.global = context;
var sandbox = vm.createContext(context);


///////////////////////////////////////////////////////Task 3 - Users Console.log //
// Читаем исходный код приложения из файла
var fileName = process.argv[2]==undefined?'./application.js':process.argv[2];
fs.readFile(fileName, function(err, src) {
  // Тут нужно обработать ошибки
  if(err)
  	throw err;
  // Запускаем код приложения в песочнице
  var script = vm.createScript(src, fileName);
  script.runInNewContext(sandbox);
////////////////////////////////////////////Task 7 
  for (var i in sandbox.module.exports) {
  	console.log(i + " | " + typeof (sandbox.module.exports[i]));
  }

 sandbox.module.exports();
 

 ////////////////////////Task 9
 console.log(sandbox.module.exports.func.toString());
 console.log("Count of arguments : " + sandbox.module.exports.func(2));
  // Забираем ссылку из sandbox.module.exports, можем ее исполнить,
  // сохранить в кеш, вывести на экран исходный код приложения и т.д.
});
