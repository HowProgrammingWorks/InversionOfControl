// Файл содержит маленький кусочек основного модуля демонстрационного
// прикладного приложения, загружаемого в песочницу демонстрационным
// кусочком фреймворка. Читайте README.md в нем задания.

// Подключение зависимостей
var application2 = require('./application2.js');

// Вывод из глобального контекста модуля
console.log('From application global context');

module.exports = function() {
  // Вывод из контекста экспортируемой функции
  console.log('From application exported function');
};
// Немного таймеров
var timeout_log = function() {
    console.log('Timeout: 1 second');
};

var interval_log = function() {
    console.log('Interval: 2 second');
};

var timeout_id = setTimeout(timeout_log, 1000);
var interval_id = setInterval(interval_log, 2000);
// Убираем таймер
var clear_interval = function() {
    clearInterval(interval_id);
    console.log('Timer cleared');
};

setTimeout(clear_interval, 10100);
// Робота с Util
util.log('Printed by util.log()');
console.log(util.format('%s, %s','Hello','console!'));
// Вызов супер функции из стороннего файла
application2.superFunction();