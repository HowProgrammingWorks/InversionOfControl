// Файл содержит маленький кусочек основного модуля демонстрационного
// прикладного приложения, загружаемого в песочницу демонстрационным
// кусочком фреймворка. Читайте README.md в нем задания.

// Вывод из глобального контекста модуля
console.log('From application global context');

for (var i in global){
	console.log(i +" "+ typeof global[i]);
}

var path = require('path');

setTimeout(function(){
	console.log("Some message using setTimeout");
	util.log("Some message using util.log");
}, 1000);

var intervalID01 = setInterval(function(){
	console.log("Some message using setInterval");
}, 1000);

setTimeout(function(){
	clearInterval(intervalID01);
}, 3000);

var exportedStr = 'str';
module.exports = function() {
  // Вывод из контекста экспортируемой функции
  module.exports.exportedStr = exportedStr;
  module.exports.exportedFunc = function(arg) {
  	return arguments.length;
  };
  console.log('From application exported function');
};
