var fs = require('fs');

// Print module listing
console.log('Module source:');
fs.readFile(__filename, function(err, data) {
  if (err) {
    console.error(err);
    return;
  }
  console.log(data.toString());
});

// Console constructor wrapper demonstration (part 2):
// create a Console instance backed by an external
// stream and log something to a file-based "console" —
// output proceeds to the file unmodified
var stream = fs.createWriteStream('logs/custom.txt'),
    external = new console.Console(stream);
external.log('Hello from a script!');
var a = 2,
    b = 3;
external.log('%d + %d = %d', a, b, a + b);
