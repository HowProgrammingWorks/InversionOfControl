'use strict';

const stat = require('./stat');
const time = require('./timeLogger');

let api = {};

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
			time.showTime();
			console.log(' Call: ', objName);
			console.log(' Object: %j\n', obj);
		}
	},

	'number' : function wrapNumber(numName, number) {
		return function wrapper() {
			time.showTime();
			console.log(' Call: ', numName);
			console.log(' Number: %d\n', number);
		}	
	},

	'function' : function wrapFunction(fnName, fn) {
		return function wrapper(...args) {
			console.log('\n Call: "%s"', fnName);
			time.showTime();
			console.log(' Args: ', args);

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
		console.log('\n Before Callback');
		time.showTime();

		fn(err, data);

		console.log(' After Callback');

		stat.setCbTime(fnName, Date.now() );
	};
}


module.exports = {
	cloneAPI,
	cloneFn
};

