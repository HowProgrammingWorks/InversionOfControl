'use strict';

const fs = require('fs'),
	it = require('./sequental'),
	vm = require('vm');

let context = {
	module: {},
	console: console,
	//fs: fs,
	setTimeout: (callback, timeout) => {
		console.log(
			'Call: setTimeout, ' +
			'callback function: ' + callback.name + ', ' +
			'timeout: ' + timeout
		);

		setTimeout(() => {
			console.log('Event: setTimeout, before callback');
			callback();
			console.log('Event: setTimeout, after callback');
		}, timeout);
	}
};

function timeLogger() {
	let now = new Date();

	console.log('Time: %s:%s:%s:%s',
		now.getHours(),
		now.getMinutes(),
		now.getSeconds(),
		now.getMilliseconds()
	);
}

function decorFS() {
	let newFS = {};

	let propNames = Object.getOwnPropertyNames(fs);

	function statlogger(code, name, ...args) {
		return (...args) => {	
			timeLogger();

			console.log('Function Name: "%s"', name);

			console.log('Args: ', args);

			let isFunction = (obj) => {
				return typeof obj === 'function';
			};

			let cb = args.find(isFunction);

			let cbIndex = args.findIndex(isFunction);

			function getNewcb(err, data) {
				return (err, data) => {
					console.log('before');
					
					cb(err, data);
					
					console.log('after');
				}
			};

			args[cbIndex] = getNewcb();

			code.apply(this, args);
		};
	}

	propNames.forEach((name, index) => {
		let type = typeof fs[name];

		newFS[name] = statlogger(fs[name], name); 
	});

	return newFS;
}

//console.log('decorFS:', decorFS() );

context.fs = decorFS();

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

