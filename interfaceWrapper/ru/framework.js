'use strict';

const fs = require('fs');
const vm = require('vm');
const stat = require('./stat');

let context = {
	module: {},
	console: console,
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
};

setInterval( () => {
	stat.show();
}, 3000);

function cloneAPI(api) {
	let clone = {};

	for (let key in api) {
		let type = typeof api[key];

		clone[key] = wrapType[type](key, api[key]); 
	}

	return clone;
}

let wrapType = {
	'object' : function wrapObject(objName, obj) {
		return function wrapper() {
			timeLogger();
			console.log(' Call: ', objName);
			console.log(' Object: %j\n', obj);
		}
	},

	'number' : function wrapNumber(numName, number) {
		return function wrapper() {
			timeLogger();
			console.log(' Call: ', numName);
			console.log(' Number: %d\n', number);
		}
	},

	'function' : function wrapFunction(fnName, fn) {
		return function wrapper(...args) {
				console.log(' Call: ', fnName);
			console.log(' Args: %j\n', args);
			timeLogger();

			hasCallback(args, Date.now() );

			return fn.apply(undefined, args);
		};
	}
};

function hasCallback(args, start) {
	let last = args.length - 1;

	let obj = args[last];

	if (typeof obj === 'function') {
		args[last] = wrapCallback(obj, start);
	}
}

function wrapCallback(fn, start) {
	return (err, data) => {
		console.log(' Before Call');

		fn(err, data);

		console.log(
			' After Call.\n Duration: %d\n',
			Date.now() - start
		);
	};
}

function timeLogger() {
	let now = new Date();

	console.log(' Time: %s:%s:%s:%s',
		now.getHours(),
		now.getMinutes(),
		now.getSeconds(),
		now.getMilliseconds()
	);
}

context.fs = cloneAPI(fs);

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

