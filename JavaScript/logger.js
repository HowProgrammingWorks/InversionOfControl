'use strict';

class Logger {
  log(message) {
    process.stdout.write(message + '\n');
  }
}

module.exports = { Logger };
