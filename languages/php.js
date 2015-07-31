/* eslint-env node */
module.exports = {
  'php': {
    'command': 'php -l'
  },
  'phpcs': {
    'command': 'phpcs --standard=Drupal --report=json',
    'process': function (data) {
      'use strict';
      var output = {
        errors: 0,
        warnings: 0,
        messages: []
      };

      data = JSON.parse(data);
      output.errors = data.totals.errors;
      output.warnings = data.totals.warnings;
      var sourceMessages = data.files[Object.keys(data.files)[0]].messages;
      output.messages = sourceMessages.map(function (message) {
        return {
          message: message.message,
          source: message.source,
          type: message.type, // This should be normalized across all languages.
          line: message.line,
          column: message.column
        };
      });
      return output;
    }
  }
};
