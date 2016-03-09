require('../framework').load();
path = require("path")
var diUtils = require("../DiUtils.js");

Api ({
  name: './task.js',

  imports: {
     console: diUtils.merge(console, {
              log: (mess) => {
                  console.log( "<" + path.basename(process.argv[1]) + "> "   + mess) 
                  }
             })
  }
});

Main ('./task.js')

configure();


