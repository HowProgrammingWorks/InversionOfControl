require('../framework').load();
path = require("path")

Api ({
  name: './task4/task.js',

  imports: {
    console: {
      log: (mess) => { console.log( "<" + path.basename(process.argv[1]) + "> "   + mess) }
    }
  }
}) 

Main ('./task4/task.js')

configure();


