// Файл содержит маленький кусочек основного модуля демонстрационного
// прикладного приложения, загружаемого в песочницу демонстрационным
// кусочком фреймворка. Читайте README.md в нем задания.
// Пример использования require
require('path');

// Вывод из глобального контекста модуля
console.log('From application global context');

//Task1
setTimeout(()=>console.log('Timeout using(after 1s)'), 1000);

//Task 2
console.log(util.inspect(util, {depth: 0, colors: true}));

console.log(util.format('We use %s.%s', 'util', 'format'));


module.exports = function() {
  // Вывод из контекста экспортируемой функции
  console.log('From application exported function');
};
