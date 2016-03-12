console.log('Hello from the second application!');

// Console wrapper demonstration (part 1):
// create a Console instance backed by a standard
// stream and see that output will be wrapped
var con = new console.Console(process.stdout);
con.log('Hello from a newly created console!');
