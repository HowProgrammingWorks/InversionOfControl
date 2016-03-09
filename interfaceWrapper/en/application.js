// Print something
console.log('From application global context');

// Declare function for timer event
function timerEvent() {
  console.log('From application timer event');
}

// Create timer
setTimeout(timerEvent, 1000);

// Example for fs API
var fileName = './README.md';
console.log('Application going to read ' + fileName);
fs.readFile(fileName, function(err, src) {
  console.log('File ' + fileName + ' size ' + src.length);
});
