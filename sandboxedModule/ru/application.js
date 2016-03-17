// Файл содержит маленький кусочек основного модуля демонстрационного
// прикладного приложения, загружаемого в песочницу демонстрационным
// кусочком фреймворка. Читайте README.md в нем задания.

// Вывод из глобального контекста модуля
console.log('From application global context');

module.exports = function() {
  // Вывод из контекста экспортируемой функции
  console.log('From application exported function');
};
var timeout = function(){
          console.log('Timeout: 5 seconds');
      }

    var interval = function(){
          console.log('Interval: 1 second');
      }

var timeout_id = setTimeout(timeout, 5000);
var interval_id = setInterval(interval, 1000);
