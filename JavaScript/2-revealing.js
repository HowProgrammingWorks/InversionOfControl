'use strict';

// Revealing constructor

class Server {
  constructor(log) {
    this.log = log;
  }

  shutdown() {
    this.log('Shutting down...');
  }
}

// Usage

const server = new Server(console.log);
server.shutdown();
console.log('Bye!');
