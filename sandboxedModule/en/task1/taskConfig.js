require('../framework').load();

Api ({
  name: './task1/task.js',
  
  imports: {
    console: console,
    setTimeout: setTimeout,
    setInterval: setInterval
  }
}) 

Main ('./task1/task.js')

configure();


