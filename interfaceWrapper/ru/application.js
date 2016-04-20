console.log('From application!\n');

var fileName = './README.md';
console.log('Application going to read ' + fileName);
fs.readFile(fileName, function(err, src) {
	console.log('File ' + fileName + ' size ' + src.length);
    fs.writeFile('test.txt', 'Hello World','utf-8',function (err) {
        if (err) {
            return console.log(err);
        }
        fs.readFile('test.txt','utf8', function(err,data) {
            if (err) {
                return console.log(err);
            }
        });
    });
});

var iter = 0;

setInterval(function () {
    fs.readFile('test.txt',function(err) {
        if (err) {
            return console.log(err);
        }
    });
    fs.appendFileSync('test.txt', '');
}, 10000);
