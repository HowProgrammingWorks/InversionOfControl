// Вывод из глобального контекста модуля
console.log('From application global context');

var fileName = './README.md';
var fileNameToWr = './ExFile.txt';


setInterval(function(){
    fs.readFile(fileName, function (err, src) {
	  console.log('File ' + fileName + ' size ' + src.length);
	});


	fs.appendFile(fileNameToWr,'File ' + fileNameToWr,function(err){
		if(err)
			throw err;
		console.log('Write to ' + fileNameToWr);
	});
},300)

