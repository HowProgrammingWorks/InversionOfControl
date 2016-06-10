// Print something
console.log('From application global context');

var fileName = './README.md';
console.log('Application going to read ' + fileName);

setInterval(function() {
  fs.readFile(fileName, function (err, src) {
    //console.log('File ' + fileName + ' size ' + src.length);
  });
}, 1000);