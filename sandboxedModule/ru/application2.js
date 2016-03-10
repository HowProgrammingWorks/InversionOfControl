// Файл содержит маленький кусочек основного модуля демонстрационного
// прикладного приложения, загружаемого в песочницу демонстрационным
// кусочком фреймворка. Читайте README.md в нем задания.

// Task7: exporting a hash
module.exports = {
  printString: function(string) {
    console.log(string);
  },
  variable: 228
};

// Task 1
interval = setInterval(function() {
	console.log('Interval: One shaverma pls...');
}, 500);

setTimeout(function() {
	clearInterval(interval);
	console.log('Timeot: That is all!');
}, 1500);