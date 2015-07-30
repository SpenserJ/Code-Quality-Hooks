var spawn = require('child_process').spawn

function execute(command, args, callback) {
  if (typeof callback === 'undefined') {
    callback = args;
    args = [];
  }

  var commandSpawn = spawn(command, args);

  var data = '', err = '';

  commandSpawn.stdout.on('data', function (out) {
    data += out.toString();
  });

  commandSpawn.stderr.on('data', function (out) {
    err += out.toString();
  });

  commandSpawn.on('close', function (code) {
    callback(err, data, code);
  });
}

module.exports = execute;
