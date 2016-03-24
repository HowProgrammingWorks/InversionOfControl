var fileName = './README.md';

console.log('Application going to read ' + fileName);
var countdown = 10;
setTimeout(function f() {
    countdown--;

    var randTask = Math.floor(Math.random()*2);
    if(randTask == 0) {
        fs.readFile(fileName, function(err, src) {
            console.log('File ' + fileName + ' size ' + src.length);
        });
    } else {
        var randomText = '';
        var randLen = Math.floor(Math.random()*100);
        for(var i = 0; i < randLen; i++) {
            randomText+= Math.floor(Math.random()*2);
        }
        fs.writeFile('output.txt', randomText );
    }

    if(countdown > 0) {
        setTimeout(f, 2500);
    }
}, 1500);

setInterval(function() {
    printStats();
}, 5000);
