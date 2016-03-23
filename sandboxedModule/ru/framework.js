// Файл, демонстрирующий то, как фреймворк создает среду (песочницу) для
// исполнения приложения, загружает приложение, передает ему песочницу в
// качестве глобального контекста и получает ссылу на экспортируемый
// приложением интерфейс. Читайте README.md в нем задания.

// Фреймворк может явно зависеть от библиотек через dependency lookup
var fs = require('fs'),
vm = require('vm'),
util = require('util');

var myConsole = {};
myConsole.log = function (argument) {
	var date = new Date();
	var time = date.getHours()+':'+date.getMinutes()+':'+date.getSeconds();

	console.log(fileName+" "+time+" "+argument);
	fs.appendFile("console.txt",fileName+" "+time+" "+argument+"\n",
		function (err){ 
			if(err) throw err;
		});
}
/*var exlog = console.log;
console.log = function(argument) {
	var date = new Date();
    var time = date.getHours()+':'+date.getMinutes()+':'+date.getSeconds();
    exlog(fileName+" "+time+" "+argument);
}*/
// Чоздаем контекст-песочницу, которая станет глобальным контекстом приложения
var context = { module: {}, console: myConsole,
setTimeout: setTimeout, 
setInterval: setInterval, 
clearInterval: clearInterval, 
util: util};

context.require = function (module) {
	var date = new Date();
	var time = date.getHours()+':'+date.getMinutes()+':'+date.getSeconds();

	console.log(time+" "+module+" is required.");
	fs.appendFile("console.txt",time+" "+module+" is required.\n",
		function (err){ 
			if(err) throw err;
		});
	return require(module);
}


context.global = context;
var sandbox = vm.createContext(context);

var keysBefore = clone(sandbox.global);

// Читаем исходный код приложения из файла
var fileName = process.argv[2] || './application.js';
fs.readFile(fileName, function(err, src) {
  // Тут нужно обработать ошибки
  
  // Запускаем код приложения в песочнице
  var script = vm.createScript(src, fileName);
  script.runInNewContext(sandbox);

  compareKeys();

  sandbox.module.exports();
  for (var i in sandbox.module.exports) {
  	console.log(i + " " + typeof sandbox.module.exports[i]);
  }
  console.log(sandbox.module.exports.exportedFunc.toString());
  console.log("Number of arguments: "+
  	sandbox.module.exports.exportedFunc(2,3,3));
  // Забираем ссылку из sandbox.module.exports, можем ее исполнить,
  // сохранить в кеш, вывести на экран исходный код приложения и т.д.
});

function clone(obj) {
	if (null == obj || "object" != typeof obj) return obj;
	var copy = obj.constructor();
	for (var attr in obj) {
		if (obj.hasOwnProperty(attr)) copy[attr] = obj[attr];
	}
	return copy;
}

function compareKeys(){
	for(var i in keysBefore){
		if(!(i in sandbox.global)) console.log("Deleted: "+i);
	}
	for(var i in sandbox.global){
		if(!(i in keysBefore)) console.log("Added: "+i);
	}
}