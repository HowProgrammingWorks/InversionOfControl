require('../framework').load();

Api ({
  name: './task.js',
  
  imports: {
    console: console,
    setTimeout: setTimeout,
    setInterval: setInterval
  }
}) 

Main ('./task.js')

configure();


