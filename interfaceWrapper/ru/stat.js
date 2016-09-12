'use strict';

let stat = {
    call: 42,
    callback: 69,
    callTime: 'callTime',
    callbackTime: 'cbtime',

    show() {
        console.log('  Statistics:');
        console.log(' Call\'s: ', this.call);
        console.log(' Callback\'s: %d\n', this.callback);
    },

    setCall(call) {
        this.call = call;
    },

    setCallback(callback) {
        this.callback = callback;
    },

    setCallTime(time) {
        this.callTime = time;
    },

    setCallbackTime(time) {
        this.callbackTime = time;
    }
};

module.exports = stat;

