var path = require('path');

module.exports = {
  'esvalidate': {
    'command': 'esvalidate',
  },
  'eslint': {
    'command': 'eslint -c ' + path.normalize(__dirname + '/../linter_configs/.eslintrc'),
  },
};
