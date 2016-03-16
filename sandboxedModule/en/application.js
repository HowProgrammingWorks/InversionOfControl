// File contains a small piece of the source to demonstrate main module
// of a sample application to be executed in the sandboxed context by
// another pice of code from `framework.js`. Read README.md for tasks.

util.log('Application started');

// Print from the global context of application module
console.log('From application global context');

module.exports = function() {
    // Print from the exported function context
    console.log('From application exported function');
};

var author = 'Acarus';
var year = 2016;
console.log(util.format('Created by %s in %d', author, year));

setTimeout(() => {
    console.log('Message from setTimeout');
}, 0);

setInterval(() => {
    console.log('Message from setInterval');
}, 1000);
