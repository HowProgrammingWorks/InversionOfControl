require('../framework').load();
path = require("path")

Api ({
  name: './task.js',

  imports: {
    console: {
      log: (mess) => { console.log( "<" + path.basename(process.argv[1]) + "> "   + mess) }
    }
  }
}) 

Main ('./task.js')

configure();


