'use strict';

// Service locator

const { ServiceLocator } = require('./locator.js');

class Server {
  constructor() {
    const { Logger } = ServiceLocator.get('logger');
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
