// Пример оборачивания функции в песочнице

var fs = require('fs'),
    vm = require('vm');

// Объявляем хеш из которого сделаем контекст-песочницу
var context = {
    module: {},
    console: console,
    // Помещаем ссылку на fs API в песочницу
    fs: cloneInterface(fs),
    
    setTimeout: setTimeout,
    setInterval: setInterval,
    functionCount: 0,
    callBackCount: 0,
    totalTimeFunc: 0,
    totalTimeCall: 0,
    averTimeOfFunc: 0,
    averTimeOfCall: 0
};

//Clone
function cloneInterface(anInterface) {
  var clone = {};
  for (var key in anInterface) {
    if(typeof anInterface[key] == "function")
      clone[key] = wrapFunction(key,anInterface[key]);
    else
      clone[key] = anInterface[key];

  }
  return clone;
}
//Wpapper
function wrapFunction(fnName, fn) {
    var flag = arguments[2];
  return function wrapper() {
        
        var args = [];
        Array.prototype.push.apply(args, arguments);
        
        var last = args[args.length - 1];
        if (typeof last == "function") {

            console.log('CallBack');
            args.pop()
            args.push(wrapFunction(last.name, last,true));
            context.callBackCount++;
        }
        
        
        if (flag === undefined) {
            console.log('Call: ' + fnName);
            console.log(args);
            context.functionCount++;
            var time = new Date().getTime();
            var res = fn.apply(undefined, args);
            time = new Date().getTime() - time;
            context.totalTimeFunc += time
            context.averTimeOfFunc = context.functionCount / context.totalTimeFunc;
        }
        else {
            context.callBackCount ++;
            var time = new Date().getTime();
            var res = fn.apply(undefined, args);
            time = new Date().getTime() - time;
            context.totalTimeCall += time
            context.averTimeOfCall = context.callBackCount / context.totalTimeCall;
        }
        return res;
    }
}

// Преобразовываем хеш в контекст
context.global = context;
var sandbox = vm.createContext(context);

setInterval(function (){
    var str = 'Called function: ' + context.functionCount 
     + ' Called callBack: ' + context.callBackCount +
     ' Aver time of function: ' + context.averTimeOfFunc +
     ' Aver time of callBack: ' + context.averTimeOfCall + '\n'
  fs.appendFile('info.txt', str, function(err){
    if(err)
      throw err;
    
  });
},30000)

// Читаем исходный код приложения из файла
var fileName = './application.js';
fs.readFile(fileName, function(err, src) {
  // Запускаем код приложения в песочнице
  var script = vm.createScript(src, fileName);
  script.runInNewContext(sandbox);
});
