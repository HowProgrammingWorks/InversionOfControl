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

class Logger {
  constructor() {
    return console;
  }
}

ServiceLocator.set('logger', { Logger });
const server = new Server();
server.shutdown();
console.log('Bye!');
