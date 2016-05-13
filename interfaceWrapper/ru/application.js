// Вывод из глобального контекста модуля
console.log('From application global context');

var fileName = './README.md';
var fileToWrite = './test.txt';

console.log('Application going to read ' + fileName);
fs.readFile(fileName, function(err, src) {
	console.log('File ' + fileName + ' size ' + src.length);
});

var intervalID01 = setInterval(function () {
	console.log('Application going to write ' + fileToWrite);
	fs.appendFile(fileToWrite, 'some text\n', 
		function (err){ 
			if(err) throw err;
		});
}, 1000);

setTimeout(function(){
	clearInterval(intervalID01);
}, 10000);