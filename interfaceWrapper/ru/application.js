// Вывод из глобального контекста модуля
console.log('From application global context');

// Пример использования fs API
var fileName = './README.md', file = 'file.txt';

setInterval(function () {
	console.log('Application going to read ' + fileName);
	fs.readFile(fileName, function(err, src) {
	  console.log('File ' + fileName + ' size ' + src.length);
	});
}, 5000);

setInterval(function () {
	console.log('Application going to write to ' + file);
	fs.appendFile(file, 'Some text is here', function(err, src) {
	  console.log('File ' + file + ' appends ' + 'some text');
	});
}, 5000);
