'use strict';

const fs = require('fs');
const vm = require('vm');
const stat = require('./stat');
const wrap = require('./wrap');
const time = require('./timeLogger');

let fileName = process.argv[2];

if (fileName) {
	let context = {
		module: {},
		console: {}
	};

	/*
	setInterval( () => {
		stat.show();
	}, 3000);
	*/

	context.fs = wrap.cloneAPI(fs);

	context.setTimeout = wrap.cloneFn('setTimeout', setTimeout);
	context.clearTimeout = wrap.cloneFn('clearTimeout', clearTimeout);

	context.console.log = wrap.cloneFn('console.log', logMessageFile);

	context.require = wrap.cloneFn('require', require);

	// Преобразовываем хеш в контекст
	context.global = context;

	let sandbox = vm.createContext(context);

	fs.readFile(fileName, (err, src) => {
		if (err) {
			throw err;
		}

		let scriptOpts = {
			fileName,
			displayErrors: true
		};

		let script = vm.createScript(src, fileName);
		script.runInNewContext(sandbox);

		let app = sandbox.module.exports;

		showAppExp(app);
	});
}

function showAppExp(obj) {
	console.log('Application Export');

	for (let key in obj) {
		let hasProperty = obj.hasOwnProperty(key);

		if (hasProperty) {
			console.log(' %s; type: %s', key, typeof obj[key]);
		}
	}
}

function logMessageFile(...args) {
	let filename = './log';

	let log = (args) => {
		return logMessage(args);
	};

	fs.appendFile(filename, log(), (err) => {
		if (err) {
			throw err;
		}

		console.log(' Data was Append to "%s"',  filename);
	});
}

function logMessage(...args) {
	let log = time.showTime() + ' ';

	let message = 'hello from framework';

	if (message) {
		log += 'Msg: ' + message;
	}

	if (fileName) {
		log += '; App Name: ' + fileName;
	}

	log += '\n' + args;

	console.log(log);

	return log;
}

function logFn(app, name) {
    let fn = app[name];

    console.log('Code: ', fn.toString() );
    console.log('Args Number: ', fn.length);
}

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

