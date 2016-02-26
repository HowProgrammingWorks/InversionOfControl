// Файл содержит маленький кусочек основного модуля демонстрационного
// прикладного приложения, загружаемого в песочницу демонстрационным
// кусочком фреймворка. Читайте README.md в нем задания.

// Вывод из глобального контекста модуля
console.log('From application global context');

module.exports = function() {
  // Вывод из контекста экспортируемой функции
  console.log('From application exported function');
};
// 
var timeout_log = function(){
    console.log('Timeout: 1 second');
}

var interval_log = function(){
    console.log('Interval: 2 second');
}

var timeout_id = setTimeout(timeout_log, 1000);
var interval_id = setInterval(interval_log, 2000);

