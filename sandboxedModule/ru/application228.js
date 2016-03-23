/**
 * Created by senior on 23.03.16.
 */
// Файл содержит маленький кусочек основного модуля демонстрационного
// прикладного приложения, загружаемого в песочницу демонстрационным
// кусочком фреймворка. Читайте README.md в нем задания.
"use strict";
//Req call to test task 6
var someModule = require('./reqModule');

// Вывод из глобального контекста модуля
console.log('From application global context');

module.exports = {
    firstFunction: function () {
        console.log('From application exported function');
    },
    secondFunction: function (string) {
        console.log(string);
    },
    someVar: 2281488
};

//Task 1
console.log('Task 1======================');
var interval = setInterval(function () {
    console.log("I kill you...");
}, 500);
setTimeout(function () {
    clearInterval(interval);
    console.log('I saved you...');
}, 1200);

//Task 2
console.log('Task 2=======================');
util.log('Hello from util.log function');
console.log(util.format('%s', 'Epic fail...'));
