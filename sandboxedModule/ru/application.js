// Файл содержит маленький кусочек основного модуля демонстрационного
// прикладного приложения, загружаемого в песочницу демонстрационным
// кусочком фреймворка. Читайте README.md в нем задания.
// Пример использования require
require('path');

// Вывод из глобального контекста модуля
console.log('From application global context\n');

//Task 1
setTimeout(()=>console.log('Timeout using(after 1s) (task 1)\n'), 1000);

//Task 2
console.log(util.format('We use %s.%s', 'util', 'format\n'));

//Task 7
function func1(){};
function func2(a, b){return a + b;};
var num = 1;
var str = 'abc';
var bool = true;
var obj = {};

var one_more_var = 123;

module.exports = {
  func1: func1,
  func2: func2,
  num: num,
  str: str,
  bool: bool,
  obj: obj
};

console.log('global context of application(task 9):\n');
for (var k in global) {
  console.log(k + " - " + typeof global[k]);
}
