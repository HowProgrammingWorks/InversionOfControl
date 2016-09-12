'use strict';

const fs = require('fs');
const vm = require('vm');

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

function cloneAPI(api) {
	let clone = {};

	for (let key in api) {
		clone[key] = wrapFunction(key, api[key]);
	}

	return clone;
}

function wrapObject() {}

function wrapNumber() {}

function wrapFunction(fnName, fn) {
	return function wrapper(...args) {
		console.log('Call: ', fnName);
		console.log('Args: ', args);

		hasCallback(args);

		return fn.apply(undefined, args);
	};
}

function hasCallback(args) {
	let last = args.length - 1;

	let obj = args[last];

	if (typeof obj === 'function') {
		args[last] = wrapCallback(obj);
	}
}

function wrapCallback(fn) {
	return (err, data) => {
		console.log('Before Call');

		fn(err, data);

		console.log('After Call');
	};
}

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

	for (let key in fs) {
		console.log(' ' + key + ' : ' +  typeof fs[key]);
	}

	function statlogger(fn, name) {
		return (...args) => {	
			timeLogger();

			console.log('Call: "%s"', name);

			console.log('Args: ', args);

			let cbIndex = args.length - 1;
			let cb = args[cbIndex];

			if (typeof cb === 'function') {
				args[cbIndex] = getNewcb();
			}

			function getNewcb(err, data) {
				return (err, data) => {
					console.log('Before Call');
					
					cb(err, data);
					
					console.log('After Call');
				}
			};

			fn.apply(this, args);
		};
	}

	propNames.forEach((fnName) => {
		newFS[fnName] = statlogger(fs[fnName], fnName); 
	});

	//return newFS;
}

//context.fs = cloneAPI(fs);
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

