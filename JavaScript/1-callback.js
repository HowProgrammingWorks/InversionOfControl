'use strict';

// Callback passing

class Server {
  shutdown(callback) {
    console.log('Shutting down...');
    callback();
  }
}

// Usage

const server = new Server();
server.shutdown(() => {
  console.log('Bye!');
  process.exit(0);
});
