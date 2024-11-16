'use strict';

// Closure: class factory

const createServerClass = (dependencies) => {
  class Server {
    constructor() {
      const { Logger } = dependencies;
      this.logger = new Logger();
    }

    shutdown() {
      this.logger.log('Shutting down...');
    }
  }

  return Server;
};

// Usage

class Logger {
  constructor() {
    return console;
  }
}

const Server = createServerClass({ Logger });
const server = new Server();
server.shutdown();
console.log('Bye!');
