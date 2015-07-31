/* eslint-env node */
var path = require('path');

module.exports = {
  'esvalidate': {
    'command': 'esvalidate'
  },
  'eslint': {
    'command': 'eslint -f ' + path.join(__dirname, '../node_modules/eslint-json/json') + ' -c ' + path.join(__dirname, '../linter_configs/.eslintrc'),
    'process': function (data) {
      'use strict';
      var output = {
        errors: 0,
        warnings: 0,
        messages: []
      };

      data = JSON.parse(data);
      data = data.results[0];
      output.errors = data.errorCount;
      output.warnings = data.warningCount;
      output.messages = data.messages.map(function (message) {
        return {
          message: message.message,
          type: (message.severity === 2 ? 'error' : 'warning'),
          line: message.line,
          column: message.column
        };
      });

      return output;
    }
  }
};
