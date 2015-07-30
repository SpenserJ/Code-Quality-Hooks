#!/usr/bin/env node

var path = require('path')
  , colors = require('colors')
  , Q = require('q');

var config = require('./lib/config')
  , execute = require('./lib/execute')
  , Language = require('./lib/language');

function getChangedFiles(previousCommit, callback) {
  if (typeof callback === 'undefined') {
    callback = previousCommit;
    previousCommit = false;
  }

  var gitCommandFocus = (previousCommit ? 'HEAD^..HEAD' : '--cached');
  execute('git', ['diff', gitCommandFocus, '--name-only', '--diff-filter=ACM'], function (err, data, code) {
    callback(err, data.trim().split("\n"));
  });
}

getChangedFiles(true, function (err, data) {
  if (err) {
    console.error('Error getting changed files:', err);
    return;
  }

  // Run through all of the tests at once, one file at a time.
  var processingFiles = data.map(function (file) {
    var ext = path.extname(file).substr(1)
      , language = config.extensions[ext]
      , languageController = new Language(language);

    if (languageController.loaded === false) {
      //console.log('Unknown language for extension:', ext);
    } else {
      var deferred = Q.defer();
      var output = languageController.run(file);
      output.then(function (results) {
        var failedTests = 0;
        var message = '[' + language + '] ' + file.underline;
        console.log(message.blue);
        results.forEach(function (result) {
          if (result.state === 'fulfilled') {
            var message = '[✓] ' + result.parser;
            console.log(message.green);
          } else {
            var message = '[✖] ' + result.parser + ' failed:';
            console.log(message.red);
            console.log(result.reason);
            failedTests++;
          }
        });
        console.log();

        if (failedTests === 0) { deferred.resolve(); }
        else { deferred.reject(file + ' failed ' + failedTests + ' tests.'); }
      });

      return deferred.promise;
    }
  });

  Q.allSettled(processingFiles).then(function (results) {
    var passed = true;
    results.forEach(function (result) {
      if (result.state !== 'fulfilled') {
        passed = false;
        var message = '[✖] ' + result.reason;
        console.log(message.red.bold.underline);
      }
    });

    if (passed === true) {
      var message = '[✓] All files have passed all tests.';
      console.log(message.green.bold.underline)
    }
  });
});
