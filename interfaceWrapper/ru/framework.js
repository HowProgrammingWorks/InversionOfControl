'use strict';
// Пример оборачивания функции в песочнице

const fs = require('fs'),
	vm = require('vm');

// Объявляем хеш из которого сделаем контекст-песочницу
let context = {
	module: {},
	console: console,
	// Помещаем ссылку на fs API в песочницу
	fs: fs,
	// Оборачиваем функцию setTimeout в песочнице
	setTimeout: (callback, timeout) => {
		// Добавляем поведение при вызове setTimeout
		console.log(
			'Call: setTimeout, ' +
			'callback function: ' + callback.name + ', ' +
			'timeout: ' + timeout
		);

		setTimeout(() => {
			// Добавляем поведение при срабатывании таймера
			console.log('Event: setTimeout, before callback');
			// Вызываем функцию пользователя на событии таймера
			callback();
			console.log('Event: setTimeout, after callback');
		}, timeout);
	}
};

// Преобразовываем хеш в контекст
context.global = context;

let sandbox = vm.createContext(context);

// Читаем исходный код приложения из файла
let fileName = './application.js';

fs.readFile(fileName, (err, src) => {
	// Запускаем код приложения в песочнице
	let script = vm.createScript(src, fileName);

	script.runInNewContext(sandbox);
});

