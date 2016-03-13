// File contains a small piece of the source to demonstrate main module
// of a sample application to be executed in the sandboxed context by
// another pice of code from `framework.js`. Read README.md for tasks.

// Print from the global context of application module
console.log('From application global context');

// Print some messages from timers
setInterval(() => {
  console.log('[setInterval] Hello again!');
}, 1000);

setTimeout(() => {
  console.log('[setTimeout]  Hello once!');
}, 500);

// Example of `util` module usage
var consoleProperties = util.inspect(console, { colors: true })
                            .replace(/\s+/g, ' ')
                            .replace(console.constructor.name + ' ', ''),
    consoleIntrospection = util.format('console = %s;', consoleProperties);
console.log(consoleIntrospection);

// Delete a key from the global context
delete require;

module.exports = function gcd(a, b) {
  while (b > 0) {
    var remainder = a % b;
    a = b;
    b = remainder;
  }
  return a;
};
