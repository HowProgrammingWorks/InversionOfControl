// Example for fs API
var fileName = './README.md';


function timerEvent1() {
	// console.log('Application going to read ' + fileName);
	fs.readFile(fileName, function(err, src) {
	  // console.log('File ' + fileName + ' size ' + src.length);
	});
}

function timerEvent2() {
  fs.access(fileName, fs.R_OK | fs.W_OK, (err) => {
    // console.log(err ? 'no access!' : 'can read/write');
  });
}

// Create timer
setInterval(timerEvent1, 1000);
setInterval(timerEvent2, 3000);
