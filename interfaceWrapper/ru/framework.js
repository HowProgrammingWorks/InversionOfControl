'use strict';

const fs = require('fs');
const vm = require('vm');
const stat = require('./stat');
const wrap = require('./wrap');

let context = {
	module: {},
	console: console
	/*
	setTimeout: (callback, timeout) => {
		console.log(
			' Call: setTimeout, ' +
			' callback function: ' + callback.name + ', ' +
			' timeout: ' + timeout
		);

		setTimeout(() => {
			console.log(' Event: setTimeout, before callback');
			callback();
			console.log(' Event: setTimeout, after callback\n');
		}, timeout);
	}
	*/
};

setInterval( () => {
	stat.show();
}, 3000);

context.fs = wrap.cloneAPI(fs);

context.setTimeout = wrap.cloneFn('setTimeout', setTimeout);

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

