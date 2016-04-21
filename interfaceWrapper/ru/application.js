var fileName = './README.md';
console.log('Application going to read ' + fileName);
fs.readFile(fileName, function(err, src) {
  console.log('File ' + fileName + ' size ' + src.length);
});

fs.realpath(fileName, function(err, src) {
    console.log('File: ' + src);
})

fs.readdir('./', function(err, files) {
    console.log('Files in local directory: ' + files);
})

fs.open('./file.txt', 'r', mode=0666, function(err, fd){
    console.log('File open');
    fs.close(fd, function(err, param){
        console.log('File closed')
    })
})