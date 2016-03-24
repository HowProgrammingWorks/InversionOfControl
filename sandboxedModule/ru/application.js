// Файл содержит маленький кусочек основного модуля демонстрационного
// прикладного приложения, загружаемого в песочницу демонстрационным
// кусочком фреймворка. Читайте README.md в нем задания.

// Вывод из глобального контекста модуля

console.log('From application global context');

//Добавление и удаление ключей
global.a=50;
var myStr='str';
delete myStr1;
//Task1
var interval=setInterval(function(){
	console.log('Repeating text');
},1000);
setTimeout(function(){
	clearInterval(interval);

	//Task2
	console.log(util.format("Some str: %s ...%d",'STRING',9));
},4000)

require('path');


module.exports = {
	var1:1,
	var2:'str',
	func1: function(b,c){
		console.log(b);
	}
	

};

