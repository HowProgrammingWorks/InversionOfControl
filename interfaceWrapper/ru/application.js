// Вывод из глобального контекста модуля
console.log('From application global context');

// Пример использования fs API
var fileName = './README.md';

// Читаем файл
setInterval(function() {
	console.log('Application going to read ' + fileName);
	fs.readFile(fileName, function(err, src) {
	  console.log('File ' + fileName + ' size ' + src.length);
	});
}, 10000);

// Дописываем в файл
setInterval(function() {
	console.log('Application going to write test.txt');
	fs.appendFile('test.txt', '7 bytes', function(err, src) {
	  console.log('File test.txt append 7 bytes');
	});
}, 10000);