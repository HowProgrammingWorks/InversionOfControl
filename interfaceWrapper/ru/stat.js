'use strict';

let stat = {
	modelFunc: class StatFunc {
		constructor() {
			this.call = 0;
			this.startTime = [];
			this.callTime = [];
			this.callbackTime = [];
		}
	},

	fns: {},

	show() {
		let fns = this.fns;
		let fnNames = Object.getOwnPropertyNames(fns);

		for (var i = 0, len = fnNames.length; i < len; i += 1) {
			let name = fnNames[i];
			let startTime = fns[name]['startTime'][i];

			console.log(' Calls: ', fns[name].call);
			console.log(' Call Duration:', fns[name]['callTime'][i] - startTime);
			console.log(' Callback Duration: ', fns[name]['callbackTime'][i] - startTime);
		}
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

