// Файл, демонстрирующий то, как фреймворк создает среду (песочницу) для
// исполнения приложения, загружает приложение, передает ему песочницу в
// качестве глобального контекста и получает ссылу на экспортируемый
// приложением интерфейс. Читайте README.md в нем задания.

// Фреймворк может явно зависеть от библиотек через dependency lookup
var fs = require('fs'),
    vm = require('vm'),
    util = require('util');
    //app = require('./application.js');

//Обгортаємо console.log 
var wrapperLog = function(message){
    // Завдання 4
                message = message || '';
                var date = new Date();
                var text = fileName;
                    text+= ' ' + date.getHours()+':'+date.getMinutes()+':'+date.getSeconds();
                    text+= ' ' + message;
                console.log(text);
    // Завдання 5
                fs.appendFile("wrapperLog.txt", text+"\r\n", function(err) {
                    if(err) {
                        console.log(err);
                    }
                })
            }

var wrapperRequire = function(module){
    var date = new Date();
    var text =date.getHours()+':'+date.getMinutes()+':'+date.getSeconds();

    text+=module;
    fs.appendFile("wrapperRequire.txt", text+"\r\n", function(err) {
                    if(err) {
                        console.log(err);
                    }
                })
    require(module);
}
// Cоздаем контекст-песочницу, которая станет глобальным контекстом приложения
var context = { module: {},
			    console: {
                    log: wrapperLog
                }, 
                // Завдання 1
			    setTimeout: setTimeout,
			    setInterval: setInterval,
			    //Завдання 2
                util: util,
                require: wrapperRequire
                };

               

context.global = context;

var sandbox = vm.createContext(context);

// Читаем исходный код приложения из файла
// Завдання 3
var fileName = process.argv[2]; // './application.js'
fs.readFile(fileName, function(err, src) {
  // Тут нужно обработать ошибки
  
  // Запускаем код приложения в песочнице
  var script = vm.createScript(src, fileName);
  script.runInNewContext(sandbox);
  
  // Забираем ссылку из sandbox.module.exports, можем ее исполнить,
  // сохранить в кеш, вывести на экран исходный код приложения и т.д.
    for (var p in sandbox.module.exports) {
  	console.log(p + " : " + typeof sandbox.module.exports[p]);
  }
});
