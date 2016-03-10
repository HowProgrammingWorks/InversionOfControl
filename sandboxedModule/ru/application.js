// Файл содержит маленький кусочек основного модуля демонстрационного
// прикладного приложения, загружаемого в песочницу демонстрационным
// кусочком фреймворка. Читайте README.md в нем задания.
// Пример использования require
require('path');

// Вывод из глобального контекста модуля
console.log('From application global context');

//Task 1
setTimeout(()=>console.log('Timeout using(after 1s)'), 1000);

//Task 2
console.log(util.format('We use %s.%s', 'util', 'format'));

//Task 7
function func1(){};
function func2(a, b){return a + b;};
var num = 1;
var str = 'abc';
var bool = true;
var obj = {};

module.exports = {
  func1: func1,
  func2: func2,
  num: num,
  str: str,
  bool: bool,
  obj: obj
};
