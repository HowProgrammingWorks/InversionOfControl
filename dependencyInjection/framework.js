'use strict';

// Типы библиотек
const libraries = {
  console:     'global',
  setTimeout:  'global',
  setInterval: 'global',
  fs:          'native',
  vm:          'native',
  path:        'native',
  util:        'native',
  ncp:         'module',
  colors:      'module',
  mkdirp:      'module',
};

// Ссылки на метаданные загруженных библиотек
const loaded = {};

// Ссылки на загруженные библиотеки
const api = {};

// Функция загрузчик
const loadLibrary = (name, parent) => {
  if (typeof parent !== 'object') parent = { name: 'framework' };
  console.log(`Loading dependency: ${name} into ${parent.name}`);
  const mod = {};
  loaded[name] = mod;
  mod.name = name;
  mod.type = libraries[name];
  if (mod.type === 'global') {
    mod.interface = global[name];
    api[name] = mod.interface;
  } else if (mod.type === 'native' || mod.type === 'module') {
    mod.interface = require(name);
    api[name] = mod.interface;
  } else {
    mod.type = 'app';
    mod.context = { module: {} };
    mod.context.global = mod.context;
    mod.sandbox = api.vm.createContext(mod.context);
    mod.config = require(`./${name}.json`);
    mod.fileName = `./${name}.js`;
    api.fs.readFile(mod.fileName, 'utf8', (err, src) => {
      mod.script = api.vm.createScript(src, mod.fileName);
      mod.script.runInNewContext(mod.sandbox);
      mod.interface = mod.sandbox.exports;
      api[name] = mod.interface;
      if (mod.config.api) {
        mod.config.api.forEach(item => {
          loadLibrary(item, mod);
        });
      }
    });
  }
};

// Загружаем два системных модуля и после них основное приложение
['fs', 'vm', 'application'].forEach(loadLibrary);
