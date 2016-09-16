'use strict';

let stat = {
	modelFunc: class StatFunc {
		constructor() {
			this.call = 0;
			this.startTime = [];
			this.callTime = [];
			this.callbackTime = [];
		}

		getCall() {
			return this.call;
		}

		getStartTime() {
			return this.callTime;
		}

		getCallTime() {
			return this.callTime;
		}

		getCallbackTime() {
			return this.callbackTime;
		}
	},

	fns: {},

	show() {
		let fns = this.fns;
		let fnNames = Object.getOwnPropertyNames(fns);

		for (var i = 0, len = fnNames.length; i < len; i += 1) {
			let name = fnNames[i];
			let data = this.averageTime(fns[name]);

			this.showStatFunc(name, data);
		}
    },

	averageTime(fn) {
		let callDuration = [];
		let callbackDuration = [];

		let call = fn.getCall();
		let startTime = fn.getStartTime();
		let callTime = fn.getCallTime();
		let callbackTime = fn.getCallbackTime();

		for (let i = 0, len = startTime.length; i < len; i += 1) {
			callDuration[i] = (callTime[i] - startTime[i]) / call;
			callbackDuration[i] = (callbackTime[i] - startTime[i]) / call;
		}

		return {
			call,
			callDuration: callDuration.reduce( (prev, cur) => prev + cur, 0),
			callbackDuration: callbackDuration.reduce( (prev, cur) => prev + cur, 0)
		}
	},

	showStatFunc(name, {call, callDuration, callbackDuration}) {
		console.log('\n "%s":', name);
		console.log(' Calls: %d', call);
		console.log(' Calls Duration: %d', callDuration);
		console.log(' Callbacks Duration: %d', callbackDuration);
	},

	setName(name) {
		let isExistFn = this.fns[name];

		if (!isExistFn) {
			this.fns[name] = new this.modelFunc(name);
		}
	},

	setCall(name) {
		this.fns[name]['call'] += 1;
	},

	setStartTime(name, ms) {
        this.fns[name]['startTime'].push(ms);
    },

    setCbTime(name, ms) {
		this.fns[name]['callbackTime'].push(ms);
    },

    setCallTime(name, ms) {
        this.fns[name]['callTime'].push(ms);
    }
};

module.exports = stat;

