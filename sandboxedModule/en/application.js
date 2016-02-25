// File contains a small piece of the source to demonstrate main module
// of a sample application to be executed in the sandboxed context by
// another pice of code from `framework.js`. Read README.md for tasks.

// Print from the global context of application module
console.log('From application global context');
interval = magic(function() {
    log("I will loop forever!");
}, 300);

friendship(function () {
    kill(interval);
    log("No, you will not!");
}, 1500);

module.exports = function() {
    // Print from the exported function context
    log('From application exported function');
};
