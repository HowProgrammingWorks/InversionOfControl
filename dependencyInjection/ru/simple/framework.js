// Типы библиотек
var libraries = {
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
var loaded = {};

// Ссылки на загруженные библиотеки
var api = {};

// Загружаем два системных модуля и после них основное приложение
['fs', 'vm', 'application'].forEach(loadLibrary);

// Функция загрузчик
function loadLibrary(name, parent) {
  if (typeof(parent) !== 'object') parent = { name: 'framework' };
  console.log('Loading dependency: ' + name + ' into ' + parent.name);
  var mod = {};
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
    mod.config = require('./' + name + '.json');
    mod.fileName = './' + name + '.js';
    api.fs.readFile(mod.fileName, function(err, src) {
      mod.script = api.vm.createScript(src, mod.fileName);
      mod.script.runInNewContext(mod.sandbox);
      mod.interface = mod.sandbox.exports;
      api[name] = mod.interface;
      if (mod.config.api) {
        mod.config.api.forEach(function(item) {
          loadLibrary(item, mod);
        });
      }
    });
  }
}
