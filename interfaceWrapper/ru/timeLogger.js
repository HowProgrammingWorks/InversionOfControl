'use strict';

let api = {};

function showTime() {
	let now = new Date();
	
	let hour = now.getHours();
    let min = now.getMinutes();
    let sec = now.getSeconds();
    let msec = now.getMilliseconds();

	return ' ' + hour + ':' + min + ':' + sec + ':' + msec;
};

module.exports = {
	showTime
};
