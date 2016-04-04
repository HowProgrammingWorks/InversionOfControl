var fileName = './README.md';
console.log('Application going to read ' + fileName);

var readID = setInterval(read, 5000);
var pathID = setInterval(path, 3000);
var dirID = setInterval(dir, 10000);
var openID = setInterval(open, 7000);

ID = [readID, pathID, dirID, openID];

setTimeout(stop, 60000);

function read(){
    fs.readFile(fileName, function(err, src) {
        console.log('File ' + fileName + ' size ' + src.length);
    });
}

function path(){
    fs.realpath(fileName, function(err, src) {
        console.log('File: ' + src);
    });
}

function dir(){
    fs.readdir('./', function(err, files) {
        console.log('Files in local directory: ' + files);
    });
}

function open(){
    fs.open('./file.txt', 'r', mode=0666, function(err, fd){
        console.log('File open');
        fs.close(fd, function(err, param){
            console.log('File closed')
        })
    });
}

function stop(){
    for (var i = 0; i<ID.length; i++){
        clearInterval(ID[i]);
    }
    console.log('Timers stoped');
}
