// Файл содержит маленький кусочек основного модуля демонстрационного
// прикладного приложения, загружаемого в песочницу демонстрационным
// кусочком фреймворка. Читайте README.md в нем задания.

// Вывод из глобального контекста модуля
console.log('From application global context');

module.exports = function() {
  // Вывод из контекста экспортируемой функции
  setTimeout(() => {
  	console.log("From setTimeout in applicationn.js");
  }, 900);
  setInterval(() => {
  	console.log("From setInterval in applicationn.js");
  }, 1000);
};
