'use strict';

// Файл, демонстрирующий то, как фреймворк создает среду (песочницу) для
// исполнения приложения, загружает приложение, передает ему песочницу в
// качестве глобального контекста и получает ссылу на экспортируемый
// приложением интерфейс. Читайте README.md в нем задания.

// Фреймворк может явно зависеть от библиотек через dependency lookup
let fs = require('fs'),
    vm = require('vm');

// Создаем контекст-песочницу, которая станет глобальным контекстом приложения
let context = {
	module: {},
	console: console,
	setTimeout: setTimeout,
	clearTimeout: clearTimeout,
	setInterval: setInterval,
	clearInterval: clearInterval
};

context.global = context;

let sandbox = vm.createContext(context);

// Читаем исходный код приложения из файла
let fileName = './application.js';

fs.readFile(fileName, (err, src) => {
	// Тут нужно обработать ошибки
  
  	// Запускаем код приложения в песочнице
	let script = vm.createScript(src, fileName);
  	script.runInNewContext(sandbox);
  
  	// Забираем ссылку из sandbox.module.exports, можем ее исполнить,
  	// сохранить в кеш, вывести на экран исходный код приложения и т.д.
	let app = sandbox.module.exports;

	timers(app);
});

function timers(app) {
	app.setTimeout((...args) => {
        console.log('start args: ', args);

        let sum = args.reduce((a, b) => a + b);

        console.log('finish sum = %s.', sum);
    }, 1000, 1, 2, 3, 4, 5);
}

