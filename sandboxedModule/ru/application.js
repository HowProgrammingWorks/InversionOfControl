// Файл содержит маленький кусочек основного модуля демонстрационного
// прикладного приложения, загружаемого в песочницу демонстрационным
// кусочком фреймворка. Читайте README.md в нем задания.

// Вывод из глобального контекста модуля
console.log('From application global context');

module.exports = {
};

mySetTimeout(() => {
	console.log("From mySetTimeout in application.js");
}, 500);
mySetInterval(() => {
	console.log("From mySetInterval in application.js");
}, 500);