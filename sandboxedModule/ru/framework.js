'use strict';

let fs = require('fs'),
	util = require('util'),
    vm = require('vm');

let context = {
	module: {},
	console: console,
	setTimeout: setTimeout,
	clearTimeout: clearTimeout,
	setInterval: setInterval,
	clearInterval: clearInterval,
	//util: util,
	//fs: fs,
	require: require
};

context.global = context;

let sandbox = vm.createContext(context);

let filename = process.argv[2];

if (!filename) {
	throw new Error('third argument is mussing.\n');

	return;
} else {
	context.filename = filename;
}

fs.readFile(filename, (err, src) => {
	if (err) {
		throw err;
	}

	let script = vm.createScript(src, filename);
  	script.runInNewContext(sandbox);
  
  	let app = sandbox.module.exports;

	exportFunc(app, 'setTimeout');
});

function exportFunc(app, name) {
	let func = app[name];

	console.log('Function Code:', func);
	console.log('Number of Arguments: ', func.length);
}

function useUtil(app) {
	const util = app.require('util');

	console.log( util.format('Hello %s', 'util') );

	//app.console.log( util.inspect({a: '42', rt: 89}) );

	const fs = app.require('fs');

	fs.writeFile('out.txt', 'Hello Node.js', (err) => {
		if (err) {
			throw err;
		}

		console.log('It\'s saved!\n');
	});
}

function timers(app) {
	app.setTimeout((...args) => {
        console.log('start args: ', args);

        let sum = args.reduce((a, b) => a + b);

        console.log('finish sum = %s.', sum);
    }, 1000, 1, 2, 3, 4, 5);
}

