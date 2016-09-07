'use strict';

let fs = require('fs'),
	util = require('util'),
    vm = require('vm');

let filename = process.argv[2];

if (filename) {
	let context = {
		module: {},
		console: console,
		//setTimeout: setTimeout,
		//clearTimeout: clearTimeout,
		//setInterval: setInterval,
		//clearInterval: clearInterval,
		//util: util,
		//fs: fs,
		//require: require
	};

	context.global = context;

	let sandbox = vm.createContext(context);

	context.filename = filename;

	fs.readFile(filename, (err, src) => {
		if (err) {
			throw err;
		}

		let script = vm.createScript(src, filename);
  		script.runInNewContext(sandbox);
  
  		let app = sandbox.module.exports;

		app.console.log( 'Show Global Object',  app.showGlobal() );

		//getSandbox(sandbox);

		//useUtil(app);
	});
}

/*
function getSandbox(sandbox) {
	//console.log('Sandbox: ', sandbox);

	let opts = {};

	for (let prop in sandbox) {
		let value = sandbox[prop];

		let opts = setOpts(prop, value, typeof value);

		showOpts(opts);

		if (value !== null && typeof(value) == 'object') {
			console.log('value: ', value);

			for (let prop in value[prop]) {
				let subvalue = value[prop];

				let subOpts = setOpts(prop, subvalue[prop], typeof subvalue[prop]);

				showOpts(subOpts);
			}
		}
	} 
}

function setOpts(prop, value, type) {
	let obj = {};

	obj[prop] = prop;
	obj[value] = value;
	obj[type] = type;

	return obj;
}

function showOpts({prop, value, type}) {
	console.log('Property: %s; Value: %s; Type: %s;', prop, value, value);


function exportFunc(app, name) {
	let func = app[name];

	console.log('Function Code: ', func);
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
*/
