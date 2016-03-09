// Файл содержит маленький кусочек основного модуля демонстрационного
// прикладного приложения, загружаемого в песочницу демонстрационным
// кусочком фреймворка. Читайте README.md в нем задания.

// Вывод из глобального контекста модуля
console.log('From application global context');

setTimeout(function(){
	console.log("Some message1");
}, 1000);

var intervalID01 = setInterval(function(){
	console.log("Some message2");
}, 1000);

setTimeout(function(){
	clearInterval(intervalID01);
}, 10000);

module.exports = function() {
  // Вывод из контекста экспортируемой функции
  console.log('From application exported function');
};
