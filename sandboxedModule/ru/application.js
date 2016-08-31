'use strict';

console.log('From application global context');

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

	util: util
};

