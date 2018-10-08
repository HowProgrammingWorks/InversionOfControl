'use strict';

// Файл, демонстрирующий то, как фреймворк создает среду (песочницу) для
// исполнения приложения, загружает приложение, передает ему песочницу в
// качестве глобального контекста и получает ссылу на экспортируемый
// приложением интерфейс. Читайте README.md в нем задания.

// Фреймворк может явно зависеть от библиотек через dependency lookup
global.api = {};
api.fs = require('fs');
api.vm = require('vm');

// Создаем контекст-песочницу, которая станет глобальным контекстом приложения
const context = {}; // module: {}, /*console: console*/ };
context.global = context;
const sandbox = api.vm.createContext(context);

// Читаем исходный код приложения из файла
const fileName = './application.js';
api.fs.readFile(fileName, 'utf8', (err, src) => {
  // Тут нужно обработать ошибки

  // Запускаем код приложения в песочнице
  const script = api.vm.createScript(src, fileName);
  script.runInNewContext(sandbox);

  // Забираем ссылку из sandbox.module.exports, можем ее исполнить,
  // сохранить в кеш, вывести на экран исходный код приложения и т.д.
});
