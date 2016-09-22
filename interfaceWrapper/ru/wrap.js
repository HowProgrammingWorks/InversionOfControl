'use strict';

const stat = require('./stat');
const time = require('./timeLogger');
const fs = require('fs');

let api = {};

function writeToFile(data) {
	let call = './call';

	fs.appendFile(call, data);
}

function cloneFn(fnName, fn) {
	let wrapFn;

	let type = typeof fn;

	wrapFn = wrapType[type](fnName, fn);

	return wrapFn;
}

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
			let log = '\n Call: ' + objName + ' ' +
                time.showTime() +
                ' Object: ' + obj + '\n';

			//console.log(log);
			writeToFile(log);
		}
	},

	'number' : function wrapNumber(numName, number) {
		return function wrapper() {
			let log = '\n Call: ' + numName + ' ' +
                time.showTime() +
                ' Number: ' + number + '\n';

			//console.log(log);
			writeToFile(log);
		}	
	},

	'function' : function wrapFunction(fnName, fn) {
		return function wrapper(...args) {
			let log = '\n Call: ' + fnName + ' ' +
				time.showTime() +
				' Args: ' + args + '\n';

			//console.log(log);
			writeToFile(log);

			stat.setName(fnName);
			stat.setCall(fnName);
			stat.setStartTime(fnName, Date.now() );

			hasCallback(args, fnName);

			return fn.apply(this, args);
		};
	}
};

function hasCallback(args, fnName) {
	let isFn = function isFn(obj) {
		return typeof obj === 'function'
	};

	let obj = args.find(isFn);
	let objIndex = args.findIndex(isFn);

	if (obj) {
		args[objIndex] = wrapCallback(obj, fnName);
	}

	stat.setCallTime(fnName, Date.now() );
}

function wrapCallback(fn, fnName) {
	return (err, data) => {
		let logBefore = ' Before Callback\n' +
			time.showTime();

		let logAfter = ' After Callback\n';

		//console.log(logBefore);
		writeToFile(logBefore);

		fn(err, data);

		//console.log(logAfter);
		writeToFile(logAfter);

		stat.setCbTime(fnName, Date.now() );
	};
}


module.exports = {
	cloneAPI,
	cloneFn
};

