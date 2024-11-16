'use strict';

// Dependency injection

class Server {
  constructor(logger) {
    this.logger = logger;
  }

  shutdown() {
    this.logger.log('Shutting down...');
  }
}

// Usage

const server = new Server(console);
server.shutdown();
console.log('Bye!');
