// Файл содержит маленький кусочек основного модуля демонстрационного
// прикладного приложения, загружаемого в песочницу демонстрационным
// кусочком фреймворка. Читайте README.md в нем задания.

// Вывод из глобального контекста модуля
console.log('From application2 global context');

module.exports = function() {
  // Вывод из контекста экспортируемой функции
  console.log('From application2 exported function');
};

interval2 = setInterval(function() {
	console.log("One shaverma pls...");
}, 500);

setTimeout(function() {
	clearInterval(interval2);
	console.log("That is all!");
}, 1500);
