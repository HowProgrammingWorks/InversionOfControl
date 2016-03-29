// Файл содержит маленький кусочек основного модуля демонстрационного
// прикладного приложения, загружаемого в песочницу демонстрационным
// кусочком фреймворка. Читайте README.md в нем задания.

// Вывод из глобального контекста модуля
console.log('From application global context');

var str = 'I am String';
console.log("is it String : " + str + " ?");
var answer = util.isString(str) ? "yep" : "no";
console.log(answer);

interval = setInterval(function () {
  console.log("every 300 ms");
}, 300);

setTimeout(function () {
  console.log("killing interval after 1500 ms");
  clearInterval(interval);
}, 1500);

module.exports = function() {
  // Вывод из контекста экспортируемой функции
  console.log('From application exported function');
};
