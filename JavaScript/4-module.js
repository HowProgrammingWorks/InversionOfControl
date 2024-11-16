'use strict';

// Service locator: require or import

const { Logger } = require('./logger.js');

class Server {
  constructor() {
    this.logger = new Logger();
  }

  shutdown() {
    this.logger.log('Shutting down...');
  }
}

// Usage

const server = new Server();
server.shutdown();
console.log('Bye!');
