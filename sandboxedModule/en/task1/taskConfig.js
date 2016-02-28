require('../framework').load();

Api ({
  name: './task1/task.js',
  
  imports: {
    console: console,
    setTimeout: setTimeout,
    setInterval: setInterval
  },
  
  apis: 'u'
}) 

Main ('./task1/task.js')

configure();


