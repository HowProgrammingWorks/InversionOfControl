// Example for fs API
var fileName = './README.md';
console.log('Application going to read ' + fileName);
fs.readFile(fileName, function(err, src) {
  console.log('File ' + fileName + ' size ' + src.length);
});

fs.access(fileName, fs.R_OK | fs.W_OK, (err) => {
  console.log(err ? 'no access!' : 'can read/write');
});