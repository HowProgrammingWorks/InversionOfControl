// Example for fs API
var fileName = './README.md';

console.log('Application going to read ' + fileName);
fs.readFile(fileName, function(err, src) {
  console.log('File ' + fileName + ' size ' + src.length);
});

fs.access(fileName, fs.R_OK | fs.W_OK, (err) => {
  console.log(err ? 'no access!' : 'can read/write');
});

function timerEvent() {
  console.log('Function calls count: '+getFunctionCallsCount());
}

// Create timer
setInterval(timerEvent, 1000);

setTimeout(() => {
  fs.access(fileName, fs.R_OK | fs.W_OK, (err) => {
    console.log(err ? 'no access!' : 'can read/write');
  });
}, 1500);