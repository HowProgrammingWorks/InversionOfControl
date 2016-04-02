require('../framework').load();
fs = require('fs');
path = require('path');

Api ({
  name: './task.js',

  imports: {
    console: {
      log: (mess) => { 
        var s = fs.createWriteStream('log.txt', {flags: 'a'});
        s.end(path.basename(process.argv[1]) + " " + Date.now() + " " + mess + "\n");
        console.log(mess)
      }
    }
  }
}) 

Main ('./task.js')

configure();


