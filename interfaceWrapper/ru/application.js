// Пример использования fs API

// ensure that fs is in context
//console.log(fs)

var fileName = './README.md';
console.log('Application going to read ' + fileName);

fs.readFile(fileName, function(err, src) {
  1console.log('File ' + fileName + ' size ' + src.length);
});
