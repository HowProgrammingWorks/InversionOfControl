// Пример оборачивания функции в песочнице

var fs = require('fs'),
    vm = require('vm');

// Функция клонирования интерфейса
function cloneInterface(anInterface) {
  var clone = {};
  for (var key in anInterface) {
    clone[key] = anInterface[key];
  }
  return clone;
}

// Клонируем fs
var fake_fs = cloneInterface(fs);

// Объявляем хеш из которого сделаем контекст-песочницу
var context = {
  module: {},
  console: console,
  // Помещаем ссылку на fs API в песочницу
  fs: fake_fs
};

// Преобразовываем хеш в контекст
context.global = context;
var sandbox = vm.createContext(context);

// Читаем исходный код приложения из файла
var fileName = './application.js';
fs.readFile(fileName, function(err, src) {
  // Запускаем код приложения в песочнице
  var script = vm.createScript(src, fileName);
  script.runInNewContext(sandbox);
});
