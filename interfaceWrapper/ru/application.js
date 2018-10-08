'use strict';

// Вывод из глобального контекста модуля
console.log('From application global context');

// Объявляем функцию для события таймера
const timerEvent = () => {
  console.log('From application timer event');
};

fs.readFile('README.md', 'utf8', (err, s) => {
  console.log(`file length: ${s.length}`);
});

// Устанавливаем функцию на таймер
setTimeout(timerEvent, 1000);
