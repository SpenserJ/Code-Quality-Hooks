/* eslint-env node */
var defaults = {
  extensions: {
    'php': 'php',
    'module': 'php',
    'inc': 'php',

    'js': 'js',
    'json': 'js'
  },

  languages: {
    'php': {
      'php': true,
      'phpcs': true
    },
    'js': {
      'esvalidate': true,
      'eslint': true
    }
  }
};

module.exports = defaults;
