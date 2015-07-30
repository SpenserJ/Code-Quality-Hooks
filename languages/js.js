/* eslint-env node */
var path = require('path');

module.exports = {
  'esvalidate': {
    'command': 'esvalidate'
  },
  'eslint': {
    'command': 'eslint -c ' + path.join(__dirname, '../linter_configs/.eslintrc')
  }
};
