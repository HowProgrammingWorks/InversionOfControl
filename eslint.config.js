'use strict';

const init = require('eslint-config-metarhia');

init[0].rules['class-methods-use-this'] = 'off';
init[0].files = ['JavaScript/**/*.js'];

module.exports = init;
