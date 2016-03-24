// Файл содержит маленький кусочек основного модуля демонстрационного
// прикладного приложения, загружаемого в песочницу демонстрационным
// кусочком фреймворка. Читайте README.md в нем задания.

// Вывод из глобального контекста модуля
//console.log('From application global context');

var cube=function(a){
	this.a=a;
	this.Volume=a*a*a;
};

module.exports = function() {// Вывод из контекста экспортируемой функции
console.log('From application exported function');
var A=new cube(3);

console.log(util.inspect(global, false, 2, true));

console.log(util.format("Use util.format and util.inspect: %s",util.inspect(A)));

//Task 1 
//please uncomment next: 


//setInterval(()=>console.log("From applications.js SetInterval"), 1000);
//setTimeout(()=>console.log("From applications.js SetTimeout"), 4500);

};
module.exports.func=function(number){
	console.log("Task 7-8 function: parameter = "+"number");
	return arguments.length;
}
