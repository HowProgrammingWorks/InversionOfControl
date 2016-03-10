// Файл содержит маленький кусочек основного модуля демонстрационного
// прикладного приложения, загружаемого в песочницу демонстрационным
// кусочком фреймворка. Читайте README.md в нем задания.

// Вывод из глобального контекста модуля
console.log('From application global context');
setTimeout(function(){
	console.log("Print something!!!!!=)")
}, 1000);
setInterval(function(){
	console.log("Print something!!!!!=)")
}, 1000);
module.exports = function() {
  // Вывод из контекста экспортируемой функции
  console.log('From application exported function');
};
