require('../framework').load();

Api ({
  name: './task4/task.js',

  imports: {
    console: console,
//     console: {
//       console.log: (mess) => { console.log( process.argv[1] + " " + mess) }
//     }
  }
}) 

Main ('./task4/task.js')

configure();


