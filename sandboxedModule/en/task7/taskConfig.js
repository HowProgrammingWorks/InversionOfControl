require('../framework.js').load();

Api( {
  name: "./task.js",
  options: {
      debugPrintModuleCache: true
  }
});

Main ( './task.js' );

configure();
