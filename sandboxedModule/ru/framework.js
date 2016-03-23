	// Файл, демонстрирующий то, как фреймворк создает среду (песочницу) для
	// исполнения приложения, загружает приложение, передает ему песочницу в
	// качестве глобального контекста и получает ссылу на экспортируемый
	// приложением интерфейс. Читайте README.md в нем задания.

	// Фреймворк может явно зависеть от библиотек через dependency lookup
	var fs = require('fs'),
	vm = require('vm'),
	util = require('util');

	// Cоздаем контекст-песочницу, которая станет глобальным контекстом приложения
	var context = { module: {},
	console: create_clone(console),
	setTimeout: setTimeout,
	setInterval: setInterval,
	util: util,
	asd:2
};



context.global = context;
var sandbox = vm.createContext(context);

var keysBeforeAddApp=create_clone(sandbox.global)

sandbox.require = function(module) {
	var date = new Date().toLocaleTimeString();
	context.console.log(module + ' is required.');
	return require(module);
}
for(var k in context.global){
	console.log(k+" type:"+typeof(context.global[k]));
}
console.log('\n');
sandbox.a=5;
	var fileName = process.argv[2] || './application.js';


	fs.readFile(fileName, function(err, src) {
	  // Тут нужно обработать ошибки
	  if(err)throw err;
	  // Запускаем код приложения в песочнице

	  var script = vm.createScript(src, fileName);
	  script.runInNewContext(sandbox);

	  findDeletedKeys();
    findAddedKeys();
    for (var k in sandbox.module.exports)
	  	console.log(k + ': ' + typeof sandbox.module.exports[k]);

	  console.log(sandbox.module.exports.func.toString());

	  	
	  // Забираем ссылку из sandbox.module.exports, можем ее исполнить,
	  // сохранить в кеш, вывести на экран исходный код приложения и т.д.
	});



	context.console.log = function(s) {
		var date = new Date().toLocaleTimeString();
		console.log(fileName + '... ' + date + '---' + s);
		fs.appendFile('message.txt', fileName + '... ' + 
			date + '---' + s +'\n', function (err) {
				if(err)throw err;
			});
	}





function findDeletedKeys(){
	for(var i in keysBeforeAddApp){
		if(i in sandbox.global)continue;
		console.log("Deleted: "+i);
	}
}

function findAddedKeys(){
	for(var i in sandbox.global){
		if(i in keysBeforeAddApp)continue;
		console.log("Added: "+i);
	}
}

	function create_clone(obj){
		var outObj={};
		for(var i in obj){
			outObj[i]=obj[i];
		}
		return outObj;
	}