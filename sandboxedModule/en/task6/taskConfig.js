require('../framework').load();
fs = require('fs');
path = require('path');

Api ({
  name: './task.js',

  imports: {
      require: (comp) => {
        var s = fs.createWriteStream('log.txt', {flags: 'a'});
        s.end('' + new Date() + ' ' + comp  + '\n');
        return require(comp);
      }
    }
}) 

Main ('./task.js')

configure();


