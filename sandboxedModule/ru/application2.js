'use strict';
const util = require('util');

console.log('From second application global context');

module.exports = {
      one: 'qwerty',
      two: 2,
      three: {
        one: 'qwerty',
            two: 2,
            func: () => {
              console.log('kek');
            }
      }
};