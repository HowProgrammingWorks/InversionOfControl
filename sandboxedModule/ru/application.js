// Файл содержит маленький кусочек основного модуля демонстрационного
// прикладного приложения, загружаемого в песочницу демонстрационным
// кусочком фреймворка. Читайте README.md в нем задания.

// Вывод из глобального контекста модуля
console.log(util.inspect('From application global context'));

var http = require('http');

var task = function(){
	setTimeout(function(){
		console.log('Timeout log task1');
	}, 1000);
}
task();

module.exports = {
    number: 100,
    str: 'asadsdasd',
    obj: {},
    array: []
};

module.exports.f = function() {
   // Вывод из контекста экспортируемой функции
   console.log('From application exported function');
 };
