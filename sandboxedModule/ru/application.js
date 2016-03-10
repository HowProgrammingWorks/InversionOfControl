// Файл содержит маленький кусочек основного модуля демонстрационного
// прикладного приложения, загружаемого в песочницу демонстрационным
// кусочком фреймворка. Читайте README.md в нем задания.

// Вывод из глобального контекста модуля

var util = require('util');

console.log('From application global context');

// *** Задание 2 ***

var Person = function(name, age) {
	this.name = name;
	this.age = age;
	return this;
};

module.exports = function() {

// *** Задание 7 ***
module.exports = {};

module.exports.f = function() {
  // Вывод из контекста экспортируемой функции
  // *** Задание 1 ***
  setTimeout(() => {
  	console.log("From setTimeout in applicationn.js");
  }, 900);
  setInterval(() => {
  	console.log("From setInterval in applicationn.js");
  }, 1000);
// *** Задание 2 ***
  var me = new Person("Roman", 18);
  console.log(util.format(
  	"Calling util.inspect using util.format: %s",
  	util.inspect(me))
  );

};
