// Файл содержит маленький кусочек основного модуля демонстрационного
// прикладного приложения, загружаемого в песочницу демонстрационным
// кусочком фреймворка. Читайте README.md в нем задания.

// Вывод из глобального контекста модуля

setTimeout(function(){
	console.log("In setTimeout!!!!!")
}, 1000);
setInterval(function(){
	console.log("In setInterval!!!!!")
}, 1000);

console.log(util.format('We use %s.%s', 'util', 'format'));
module.exports ={
	'Var1': 1,
 	'Var2': 'Val2',
 	func: function(i) {
	console.log("Some String."+i);
}
};
(function testRequire() {
 	require('path');
})()
