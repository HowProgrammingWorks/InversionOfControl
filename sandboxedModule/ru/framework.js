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
    util        : util,
    console: {
        log: (message) => {
            const date = new Date();
            const text = `${fileName} ${date.toUTCString()} ${message}`;
            console.log(text);
            writeToFile(text);
        }
    },
    require: (module) => {
            const date = new Date();
            const text = `${date.toUTCString()} ${module}\n`;
            writeToFile(text);
            return require(module);
          }
};

 //console.log(process.argv[2]);

const logfile = 'awesome.log';

    function writeToFile(message) {
          fs.appendFile(logfile, `${message}\n`, (err) => {
                if (err) {
                      return console.log(err);
                    }
              });
        }

function createFile() {
      fs.writeFile(logfile, '', (err) => {
            if (err) {
                  return console.log(err);
                }
          });
    }


context.global = context;
var sandbox = vm.createContext(context);

function printHashParams(hash) {
      Object.keys(hash).forEach((item) => {
            if (typeof hash[item] === 'object') {
                  printHashParams(hash[item]);
                } else {
                  console.log(`${typeof hash[item]} ${hash[item]}`);
                }
          });
    }

for (var i in process.argv)
{
    if(i>1){
        var fileN = './' + process.argv[i] + '.js';
        fs.readFile(fileN, function(err, src){
            createFile();

            var script = vm.createScript(src, fileN);
            script.runInNewContext(sandbox);

            printHashParams(sandbox.module.exports);
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