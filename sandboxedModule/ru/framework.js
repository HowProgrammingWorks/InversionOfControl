// Файл, демонстрирующий то, как фреймворк создает среду (песочницу) для
// исполнения приложения, загружает приложение, передает ему песочницу в
// качестве глобального контекста и получает ссылу на экспортируемый
// приложением интерфейс. Читайте README.md в нем задания.

// Фреймворк может явно зависеть от библиотек через dependency lookup
"use strict";

var fs = require('fs'),
    vm = require('vm'),
    util = require('util'),
    path = require('path');

//Writable stream for task 5 and task 6
var stream = fs.createWriteStream("logout.txt", {flags: 'a'});
// Создаем контекст-песочницу, которая станет глобальным контекстом приложения
function contextFactory(fileName) {
    var context = {
        module: {},
        console: clone(console),
        setInterval: setInterval,
        setTimeout: setTimeout,
        clearInterval: clearInterval,
        util: util
    };
    context.global = context;
    var sandbox = vm.createContext(context);

    //Task4
    context.console.log = function (msg) {
        var date = new Date().toLocaleTimeString();
        console.log('[' + date + ']' + fileName + ' ' + msg);
        //Task 5
        stream.write('[' + date + ']' + fileName + ' >>>>' + msg + '\n');
    };
    //Task 6
    sandbox.require = function (moduleName) {
        var date = new Date().toLocaleTimeString();
        stream.write('[' + date + ']' + moduleName + ' is required' + '\n');
        return require(moduleName);
    };

    return sandbox;
}
//Tool to prevent stack call overflow()
function clone(obj) {
    var res = {};
    for (var key in obj) res[key] = obj[key];
    return res;
}
//Task3 run from command line
process.argv.slice(2).forEach((fileName)=> {
    var sandbox = contextFactory(fileName);
    var oldKeys = {};

    for (var key in sandbox.global) {
        oldKeys[key] = sandbox.global[key];
    }
    fs.readFile(fileName, function (err, src) {
        var script = vm.createScript(src, fileName);
        script.runInNewContext(sandbox);
        console.log('I run ' + fileName + ' now');

        // Task 10: Compare an application sandboxed context keys before
        // application loaded and after, print it from the framework
        // and find a difference (keys added / deleted)
        console.log('-----Task 10: comparing keys-----')
        var newKeys = {};
        for (var key in sandbox.global) {
            newKeys[key] = sandbox.global[key];
        }
        console.log('Added keys:');
        for (var key in newKeys) {
            if (!(key in oldKeys)) {
                console.log(key);
            }
        }
        console.log('Deleted keys:');
        for (var key in oldKeys) {
            if (!(key in newKeys)) {
                console.log(key);
            }
        }

        //Task7
        console.log('Task 7: list of exports');
        for (var key in sandbox.module.exports) {
            console.log(key + " " + typeof sandbox.module.exports[key]);
        }

        //Task 8
        if (fileName === 'application.js') {
            console.log('===============Task 8===============');
            console.log(sandbox.module.exports.secondFunction.toString());
            console.log('Parameter count for function "printString": ' +
                sandbox.module.exports.secondFunction.toString().replace(/.+\(/, '').replace(/\)[^]+/, '').split(/, */).length);
        }

    });
});
process.on('exit', ()=> {
    stream.close();
});

