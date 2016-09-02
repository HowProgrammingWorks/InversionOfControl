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
	util: util
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

	useUtil(app);
});

function useUtil(app) {
	const util = app.util;

	console.log( util.format('Hello %s', 'util') );

	app.console.log( util.inspect({a: '42', rt: 89}) );
}

function timers(app) {
	app.setTimeout((...args) => {
        console.log('start args: ', args);

        let sum = args.reduce((a, b) => a + b);

        console.log('finish sum = %s.', sum);
    }, 1000, 1, 2, 3, 4, 5);
}

