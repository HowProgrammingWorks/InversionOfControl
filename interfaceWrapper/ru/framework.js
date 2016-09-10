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

	function before(callback) {
		callback( console.log('Before') );
	}

	function after(callback) {
		callback( console.log('After') );
	}

	function fsFunc(code, name, ...args) {
		return (callback) => {
			callback( code.apply(this, args)  );
		};
	}

	function statlogger(code, name, ...args) {
		return (...args) => {	
			timeLogger();

			console.log('Function Name: "%s"', name);

			console.log('Args: ', args);

			let cb = args[2];

			function getNewcb(err, data) {
				return (...args) => {
					console.log('before');
					
					cb(args);
					
					console.log('after');
				}
			};

			code.call(this, args[0], args[1], getNewcb() );
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

