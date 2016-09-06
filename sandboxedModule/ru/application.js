'use strict';

console.log('From application global context');

//console.log('parent: ', module);

const util = global.util || require('util');

module.exports = {
	setTimeout: (callback, delay, ...args) => {
		console.log('Set Timeout');

		setTimeout(callback, delay, ...args);
	},

	clearTimeout: (timer) => {
		console.log('Clear Timeout Timer: ', timer);
	},

	setInterval: (callback, delay, ...args) => {
		console.log('Set Interval');
	},

	clearInterval: (timer) => {
		console.log('Clear Interval Timer: ', timer);
	},

	util: util,

	console: {
		log: (message) => {
			console.log('App Name:', global.filename);
			console.log('Time: ', new Date);
			console.log('Message: ', message);
		}
	}
};

