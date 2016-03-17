// File contains a small piece of the source to demonstrate main module
// of a sample application to be executed in the sandboxed context by
// another pice of code from `framework.js`. Read README.md for tasks.

util.log('Application started');

// Print from the global context of application module
console.log('From application global context');

var exports = {};
module.exports = exports;

exports.firstDummyFunc = function() {};
exports.secondDummyFunc = function() {};
exports.thirdDummyFunc = function() {};
exports.integerVar = 1;
exports.stringVar = "String";
exports.someFunc = function (a, b) {
    return a + b;
};

var author = 'Acarus';
var year = 2016;
console.log('Created by %s in %d', author, year);

setTimeout(() => {
    console.log('Message from setTimeout');
}, 0);

var interval = setInterval(() => {
    console.log('Message from setInterval');
    clearInterval(interval);
    done();
}, 1000);

delete require;
