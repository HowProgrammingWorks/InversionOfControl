'use strict';

let api = {};

function timeLogger() {
    let now = new Date();

    console.log(' Time: %s:%s:%s:%s',
        now.getHours(),
        now.getMinutes(),
        now.getSeconds(),
        now.getMilliseconds()
    );
}

api.cloneAPI =  function cloneAPI(api) {
	//console.log('api: ', api);

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
			console.log('\n Call: ', fnName);
			timeLogger();
			console.log(' Args: ', args);

			//stat.setName(fnName);
			//stat.setCall(fnName);
			//stat.setStartTime(fnName, Date.now() );

			hasCallback(args, fnName);

			return fn.apply(this, args);
		};
	}
};

function hasCallback(args, fnName) {
	let last = args.length - 1;

	let obj = args[last];

	if (typeof obj === 'function') {
		args[last] = wrapCallback(obj, fnName);
	}

	//stat.setCallTime(fnName, Date.now() );
}

function wrapCallback(fn, fnName) {
	return (err, data) => {
		console.log('\n Before Callback');
		timeLogger();		

		fn(err, data);

		console.log(' After Callback');

		//stat.setCbTime(fnName, Date.now() );
	};
}


module.exports = api.cloneAPI;
