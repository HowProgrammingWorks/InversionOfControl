'use strict';

class ServiceLocator {
  static #modules = new Map();

  static get(moduleName) {
    return ServiceLocator.#modules.get(moduleName);
  }

  static set(moduleName, exp) {
    ServiceLocator.#modules.set(moduleName, exp);
  }
}

const logger = require('./logger.js');
ServiceLocator.set('logger', logger);

module.exports = { ServiceLocator };

// Alternative implementations:
// https://github.com/HowProgrammingWorks/ServiceLocator
