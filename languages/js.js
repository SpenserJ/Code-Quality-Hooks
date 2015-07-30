var Q = require('q');

var execute = require('../lib/execute');

var parserCalls = {
  'esvalidate': function (file) {
    var deferred = Q.defer();
    execute('esvalidate', [file], function (err, data, code) {
      if (code !== 0) {
        deferred.reject(data.trim());
      } else {
        deferred.resolve(data.trim());
      }
    });
    return deferred.promise;
  },

  'eslint': function (file) {
    var deferred = Q.defer();
    execute('eslint', [file], function (err, data, code) {
      if (code !== 0) {
        deferred.reject(data.trim());
      } else {
        deferred.resolve(data.trim());
      }
    });
    return deferred.promise;
  },
};

function run(parsers, file) {
  var enabledParsers = Object.keys(parsers).filter(function (parser) {
    if (parser === false) { return false; }
    if (typeof parserCalls[parser] === 'undefined') { return false; }
    return true;
  });

  var promises = enabledParsers.map(function (parser) {
    return parserCalls[parser](file);
  });

  return Q.allSettled(promises).then(function (results) {
    for (var i = 0; i < enabledParsers.length; i++) {
      results[i].parser = enabledParsers[i];
    }
    return results;
  });
}

module.exports = {
  run: run,
};
