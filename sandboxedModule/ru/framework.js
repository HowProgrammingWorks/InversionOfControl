// Файл, демонстрирующий то, как фреймворк создает среду (песочницу) для
// исполнения приложения, загружает приложение, передает ему песочницу в
// качестве глобального контекста и получает ссылу на экспортируемый
// приложением интерфейс. Читайте README.md в нем задания.

// Фреймворк может явно зависеть от библиотек через dependency lookup

var fs = require('fs'),
    vm = require('vm'),
    util = require('util');

var applicationConsole = {};

var applicationRequire = function(module) {
	fs.appendFile('filelog.txt', new Date() + " | " + module + '\n', 
		(err) => {
			if (err)
				throw err;
	});
	return require(module);
}

applicationConsole.log = function(str) { 
	console.log(fileName + " | " + (new Date()) + " | " + str); 
	fs.appendFile('consolelog.txt',
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

// Читаем исходный код приложения из файла
var fileName = process.argv[2]==undefined?'./application.js':process.argv[2];
fs.readFile(fileName, function(err, src) {
  // Тут нужно обработать ошибки
  if(err)
  	throw err;
  // Запускаем код приложения в песочнице
  var script = vm.createScript(src, fileName);
  script.runInNewContext(sandbox);
  sandbox.module.exports();
  // Забираем ссылку из sandbox.module.exports, можем ее исполнить,
  // сохранить в кеш, вывести на экран исходный код приложения и т.д.
});
