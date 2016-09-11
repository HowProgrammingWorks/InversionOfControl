'use strict';

const fs = global.fs || require('fs');


// Вывод из глобального контекста модуля
console.log('From application global context');

// Объявляем функцию для события таймера
function timerEvent() {
	console.log('From application timer event');
}

// Устанавливаем функцию на таймер
//setTimeout(timerEvent, 1500);


let filename = './README.md';

console.log('App is going to read "%s"', filename);

fs.readFile(filename, 'utf8', (err, src) => {
	if (err) {
		console.error(err);

		return;
	}

	console.log('File "%s" Size "%d"', filename, src.length);
});

