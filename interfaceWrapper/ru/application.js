// Вывод из глобального контекста модуля
console.log('From application global context');

// Объявляем функцию для события таймера
function timerEvent() {
  console.log('From application timer event');
}

// Устанавливаем функцию на таймер
//setTimeout(timerEvent, 1000);

 var fileName = './README.md';
 var fileName2 = 'checkTask';
console.log('Application going to read ' + fileName);

setInterval(function(){
    fs.readFile(fileName, function(err, src) {
    console.log('File ' + fileName + ' size ' + src.length); });},
    5000);

setInterval(function(){
    fs.appendFile(('./' + fileName2 + '.log'), (  'обертка работает'+ '\n'), function (err) {
        if (err) throw err;
    });},
    10000);

