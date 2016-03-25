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
module.exports.print = function(text) {
    console.log(text);
}
module.exports.variable = 42;

application2.superFunction();