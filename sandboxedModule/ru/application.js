// Файл содержит маленький кусочек основного модуля демонстрационного
// прикладного приложения, загружаемого в песочницу демонстрационным
// кусочком фреймворка. Читайте README.md в нем задания.

// Вывод из глобального контекста модуля
console.log('From application global context');

var Person = function(name, age) {
	this.name = name;
	this.age = age;
	return this;
};

module.exports = function() {
  // Вывод из контекста экспортируемой функции
  var me = new Person("Roman", 18);
  console.log(util.format(
  	"Calling util.inspect using util.format: %s",
  	util.inspect(me))
  );
};
