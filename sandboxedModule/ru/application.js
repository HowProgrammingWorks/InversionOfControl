// Файл содержит маленький кусочек основного модуля демонстрационного
// прикладного приложения, загружаемого в песочницу демонстрационным
// кусочком фреймворка. Читайте README.md в нем задания.

util = require ('util');

// Вывод из глобального контекста модуля
console.log('From application global context');

var Country = function (name, capital) {
  	this.name = name;
  	this.capital = capital;
  }

module.exports = function() {
  // Вывод из контекста экспортируемой функции
  console.log('From application exported function');
  
};

//Задания 7-8
module.exports.func = function(argument, anotherArgum) {
    console.log(argument);
};

module.exports.variable = 100;

//Задание 1
setTimeout(() => {
    console.log("setTimeout function");
  }, 3000);

setInterval(() => {
  console.log("setInterval function");
}, 1000);

//Задание 2
var newCountry = new Country("Ukraine", "Kyiv");
console.log(util.format("Call util.inspect() through util.format(): %s", 
  util.inspect(newCountry))
);