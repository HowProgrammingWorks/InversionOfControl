// File contains a small piece of the source to demonstrate main module
// of a sample application to be executed in the sandboxed context by
// another pice of code from `framework.js`. Read README.md for tasks.

// Print from the global context of application module
console.log('From application global context');

setInterval(() => {
  console.log('[setInterval] Hello again!');
}, 1000);

setTimeout(() => {
  console.log('[setTimeout]  Hello once!');
}, 500);

module.exports = function() {
	// Print from the exported function context
  console.log('From application exported function');
};
