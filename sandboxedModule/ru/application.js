// Файл содержит маленький кусочек основного модуля демонстрационного
// прикладного приложения, загружаемого в песочницу демонстрационным
// кусочком фреймворка. Читайте README.md в нем задания.

// Require call for testing task 6
var someModule = require('./someModule');

// Task 9: print a list of everything from the application 
// global context with the data types specified
console.log('-----Task 9: list fo everything from app global context-----');
for (var key in global) {
	console.log(key+' : '+typeof global[key]);
}

// Task7: exporting a hash
module.exports = {
  someFunction: function() {
    console.log('From application2 exported function');
  },
  printString: function(string  ,  oneMoreArg) {
    console.log(string);
  },
  someVariable: 322
};

// Task 2: using util library
console.log('-----Task 2: util\'s function call-----')
util.log('Hello from util.log');


// Task 1
interval = setInterval(function() {
	console.log('Interval: One Big mac pls...');
}, 500);

setTimeout(function() {
	clearInterval(interval);
	console.log('Timeout: That is all!');
}, 1000);