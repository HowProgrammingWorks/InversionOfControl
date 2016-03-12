// File contains a small piece of the source to demonstrate main module
// of a sample application to be executed in the sandboxed context by
// another pice of code from `framework.js`. Read README.md for tasks.

// Print from the global context of application module
console.log('From application global context');

// Print some messages from timers
var intervalTimer = setInterval(() => {
  console.log('[setInterval] Hello again!');
}, 1000);

var timeoutTimer = setTimeout(() => {
  console.log('[setTimeout]  Hello once!');
}, 500);

// Example of `util` module usage
var consoleProperties = util.inspect(console, { colors: true })
                            .replace(/\s+/g, ' ')
                            .replace(console.constructor.name + ' ', ''),
    consoleIntrospection = util.format('console = %s;', consoleProperties);
console.log(consoleIntrospection);

module.exports = {
  message: 'Hello!',
  statusCode: 0,
  operations: ['printMessage', 'stopTimers'],
  printMessage: function() {
    // Print from the exported function context
    console.log('From application exported function');
  },
  stopTimers: function() {
    clearInterval(intervalTimer);
    clearTimeout(timeoutTimer);
  }
};
