/* eslint-env node */
var Q = require("q");

var execute = require("./execute");
var config = require("./config");

var Language = function Language(language) {
  "use strict";
  try {
    this.languageDefinition = require("../languages/" + language);
    this.parsers = Object.keys(config.languages[language]).filter(function (parser) {
      if (parser === false) { return false; }
      if (typeof this.languageDefinition[parser] === "undefined") { return false; }
      return true;
    }.bind(this));

    this.loaded = true;
  }
  catch (e) {
    this.loaded = false;
  }
};

Language.prototype.run = function run(file) {
  "use strict";
  var promises = this.parsers.map(function (parserName) {
    return this.executeTest(parserName, file);
  }.bind(this));

  // Inject the parser into the results.
  return Q.allSettled(promises).then(function (results) {
    for (var i = 0; i < this.parsers.length; i++) {
      results[i].parser = this.parsers[i];
    }
    return results;
  }.bind(this));
};

Language.prototype.executeTest = function executeTest(parserName, file) {
  "use strict";
  var deferred = Q.defer();

  var parser = this.languageDefinition[parserName];
  var command = (typeof parser.command === "function") ? parser.command(file) : parser.command + " " + file;
  var args = command.split(" ");
  command = args.splice(0, 1)[0];

  execute(command, args, function (err, data, code) {
    if (typeof parser.process !== 'undefined') {
      data = parser.process(data);
    }

    if (err || code !== 0) {
      deferred.reject(data);
    }
    else {
      deferred.resolve(data);
    }
  });

  return deferred.promise;
};

module.exports = Language;
