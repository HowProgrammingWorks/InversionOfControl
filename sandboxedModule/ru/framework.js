// Файл, демонстрирующий то, как фреймворк создает среду (песочницу) для
// исполнения приложения, загружает приложение, передает ему песочницу в
// качестве глобального контекста и получает ссылу на экспортируемый
// приложением интерфейс. Читайте README.md в нем задания.

// Фреймворк может явно зависеть от библиотек через dependency lookup
var fs = require('fs'),
    vm = require('vm'),
    path = require('path'),
    type = require('type-of-is'),
    util = require('util');

// Создаем контекст-песочницу, которая станет глобальным контекстом приложения
var newConsole = {};

var filelog = fs.createWriteStream(__dirname + '/debug.log', {flags: 'a'});

process.on('cleanup', function() { filelog.close();});
process.on('exit', function() { process.emit('cleanup'); });
process.on('uncaughtException', function(e) {
  console.log('Uncaught Exception...');
  console.log(e.stack);
  process.exit(2);
});

function newLog (fileName) {
  return function (message) {
    var timestamp = (new Date()).toISOString().replace(/T/, ' ').replace(/Z/, '');
    message = timestamp + " " + path.normalize(fileName) + " : " + message;
    console.log.call(console, message);
    filelog.write(message + "\n");
  }
}

function newRequire(moduleName) {
  var timestamp = (new Date()).toISOString().replace(/T/, ' ').replace(/Z/, '');
  var message = timestamp + " " + moduleName;
  filelog.write(message + "\n");
  return require(moduleName);
}

function printObjWithTypes (scrptExports){
  for(var key in scrptExports) {
    console.log(key + " : " + type.string(scrptExports[key]));
  }
}

function clone(obj) {
  var clone = {};
  for (key in obj){
    clone[key] = obj[key];
  }
  return clone;
}

function cntxtKeyDiff(before, after) {
  var added = [];
  var deleted = [];

  for(key in before){
    if (!(key in after)){
      deleted.push(key);
    }
  }

  for(key in after){
    if (!(key in before)){
      added.push(key);
    }
  }

  return "added : " + added + " | deleted : " + deleted;
}

var context = {
  module: {},
  console: newConsole,
  setInterval : setInterval,
  setTimeout : setTimeout,
  clearInterval : clearInterval,
  util : util,
  require : newRequire
};

context.global = context;
var sandbox = vm.createContext(context);

// Читаем исходный код приложения из файла
var fileName = process.argv[2] || './application.js';
context.console.log = newLog(fileName);
fs.readFile(fileName, function(err, src) {
  // Тут нужно обработать ошибки
  
  // Запускаем код приложения в песочнице
  var sandboxBefore = clone(sandbox);
  var script = vm.createScript(src, fileName);
  script.runInNewContext(sandbox);
  var scrptExports = sandbox.module.exports;

  printObjWithTypes(scrptExports);

  // Забираем ссылку из sandbox.module.exports, можем ее исполнить,
  // сохранить в кеш, вывести на экран исходный код приложения и т.д.
  var func = sandbox.module.exports.f3;
  var funcStr = func.toString();
  console.log(funcStr);
  console.log(funcStr.substring(funcStr.indexOf("(") + 1, funcStr.indexOf(")")).split(",").length);

  console.log(cntxtKeyDiff(sandboxBefore, sandbox));
});
