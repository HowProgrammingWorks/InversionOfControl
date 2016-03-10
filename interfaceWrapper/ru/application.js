// Вывод из глобального контекста модуля
console.log('From application global context');

// Объявляем функцию для события таймера
function timerEvent() {
  console.log('From application timer event');
}

// Устанавливаем функцию на таймер
setTimeout(timerEvent, 1000);
