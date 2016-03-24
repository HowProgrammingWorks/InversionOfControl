// Файл, демонстрирующий то, как фреймворк создает среду (песочницу) для
// исполнения приложения, загружает приложение, передает ему песочницу в
// качестве глобального контекста и получает ссылу на экспортируемый
// приложением интерфейс. Читайте README.md в нем задания.

// Фреймворк может явно зависеть от библиотек через dependency lookup
var fs = require('fs'),
    vm = require('vm'),
    util=require('util');
function copyObj(obj){
	var copy={};
	for(var k in obj)
		copy[k]=obj[k];
	return copy;
}

// Создаем контекст-песочницу, которая станет глобальным контекстом приложения
var context = { module: {}, 
								console: copyObj(console) ,
								setTimeout: setTimeout,
								setInterval: setInterval,
								clearInterval:clearInterval,
								util:util, 
								myStr1:'sss'};
context.global = context;

//task 4, 5
context.console.log=function(str){
	var time= new Date().toLocaleTimeString();

	console.log(fileName+"  "+ time +"  "+ str);
	fs.appendFile('message.txt',fileName+"  "+ time +"  "+ str,function(err){
		if(err)
			throw err;
	});
}

//Task6
var sandbox = vm.createContext(context);
sandbox.require=function(fName){
	var time= new Date().toLocaleTimeString();
	fs.appendFile('log.txt',fName+"  "+ time +"  "+ 'is required',function(err){
		if(err)
			throw err;
	});
	return require(fName);
}
// Читаем исходный код приложения из файла
//Task9
console.log('TASK9');
for(var k in sandbox.global){
	console.log(k+"---"+typeof sandbox.global[k]);
}
var copyContext=copyObj(sandbox.global);

//Task3
var fileName = process.argv[2]||'./application.js';
fs.readFile(fileName, function(err, src) {
  // Тут нужно обработать ошибки
	if(err)
		throw err;


  // Запускаем код приложения в песочнице
  	var script = vm.createScript(src, fileName);
  	script.runInNewContext(sandbox);
	//Task10
	console.log("\nTASK 10\nnew keys");
	var newContextCopy=copyObj(sandbox.global)
	for(var k in newContextCopy){
			if(k in copyContext) continue;
		console.log(k);
	}


	console.log('\ndeleted keys');
	for(var k in copyContext){
		if(k in newContextCopy) continue;
		console.log(k);
	}
	console.log('\n');

  // Забираем ссылку из sandbox.module.exports, можем ее исполнить,
  // сохранить в кеш, вывести на экран исходный код приложения и т.д.

  //Task7
	for(k in sandbox.module.exports)
		console.log(k+"---"+typeof sandbox.module.exports[k]);
	console.log(sandbox.module.exports.func1.toString());

	//Task8
	var count;
	for( count=0;count<sandbox.module.exports.func1.length;count++);
	console.log(count);
  

});

