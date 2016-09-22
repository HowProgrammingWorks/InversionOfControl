'use strict';

let fs = require('fs'),
	util = require('util'),
    vm = require('vm');

let filename = process.argv[2];

if (!filename) {
	throw new Error('There is no app\'s layer');
} else {
	let context = {
		module: {},
		console: console,
		setTimeout: setTimeout,
		clearTimeout: clearTimeout,
		setInterval: setInterval,
		clearInterval: clearInterval,
		util: util,
		fs: fs,
		require: require
	};

	context.global = context;

	let sandbox = vm.createContext(context);

	context.filename = filename;

	fs.readFile(filename, (err, src) => {
		if (err) {
			throw err;
		}

		let scriptOptions = {
			filename,
			displayErrors: true
		};

		let script = vm.createScript(src, scriptOptions);
  		script.runInNewContext(sandbox);
  
  		let app = sandbox.module.exports;

		//app.console.log('Global: ', app.showGlobal(global) );

		//app.console.log( 'Sandbox Global Object',  app.showGlobal(context) );

	    //console.log( diffGlobal(global, context) );

		//useUtil(app);

		logFunc(app, 'setTimeout');
	});
}

// task 8
function logFunc(app, name) {
	let func = app[name];

	console.log('Code: ', func.toString() );
	console.log('Args Number: ', func.length);
}

// task 10
function diffGlobal(global, sandbox) {
	let result = {};
	let added = [];
	let deleted = [];

	let gName = Object.getOwnPropertyNames(global).sort();
	let sName = Object.getOwnPropertyNames(sandbox).sort();

	let glen = gName.length;
	let slen = sName.length;

	for (let i = 0; i < slen; i += 1) {
		let key = sName[i];

		for (var j = 0, isExist = true; isExist && j < glen; j += 1) {
			if (key === gName[j]) {
				isExist = false;
			}
		}

	if (j === glen) {
			added.push(key);
		}
	}

	result.added = added;

	for (let k = 0; k < glen; k += 1) {
		let key = gName[k];

		for (var l = 0, isNoExist = true; isNoExist && l < slen; l += 1) {
			if (key === sName[l]) {
				isNoExist = false;
			}
		}

		if (l === slen) {
			deleted.push(key);
		}
	}

	result.deleted = deleted;

	return result;
}

// task 2
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

// task 1
function timers(app) {
	app.setTimeout((...args) => {
        console.log('start args: ', args);

        let sum = args.reduce((a, b) => a + b);

        console.log('finish sum = ', sum);
    }, 1000, 1, 2, 3, 4, 5);
}

