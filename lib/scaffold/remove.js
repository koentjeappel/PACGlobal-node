'use strict';

var async = require('async');
var fs = require('fs');
var path = require('path');
var spawn = require('child_process').spawn;
var pacglobal = require('pacglobal-lib');
var $ = pacglobal.util.preconditions;
var _ = pacglobal.deps._;
var utils = require('../utils');

/**
 * Will remove a service from pacglobal-node.json
 * @param {String} configFilePath - The absolute path to the configuration file
 * @param {String} service - The name of the module
 * @param {Function} done
 */
function removeConfig(configFilePath, service, done) {
  $.checkArgument(utils.isAbsolutePath(configFilePath), 'An absolute path is expected');
  fs.readFile(configFilePath, function(err, data) {
    if (err) {
      return done(err);
    }
    var config = JSON.parse(data);
    $.checkState(
      Array.isArray(config.services),
      'Configuration file is expected to have a services array.'
    );
    // remove the service from the configuration
    for (var i = 0; i < config.services.length; i++) {
      if (config.services[i] === service) {
        config.services.splice(i, 1);
      }
    }
    config.services = _.uniq(config.services);
    config.services.sort(function(a, b) {
      return a > b;
    });
    fs.writeFile(configFilePath, JSON.stringify(config, null, 2), done);
  });
}

/**
 * Will uninstall a Node.js service and remove from package.json.
 * @param {String} configDir - The absolute configuration directory path
 * @param {String} service - The name of the service
 * @param {Function} done
 */
function uninstallService(configDir, service, done) {
  $.checkArgument(utils.isAbsolutePath(configDir), 'An absolute path is expected');
  $.checkArgument(_.isString(service), 'A string is expected for the service argument');

  var child = spawn('npm', ['uninstall', service, '--save'], {cwd: configDir});

  child.stdout.on('data', function(data) {
    process.stdout.write(data);
  });

  child.stderr.on('data', function(data) {
    process.stderr.write(data);
  });

  child.on('close', function(code) {
    if (code !== 0) {
      return done(new Error('There was an error uninstalling service(s): ' + service));
    } else {
      return done();
    }
  });
}

/**
 * Will remove a Node.js service if it is installed.
 * @param {String} configDir - The absolute configuration directory path
 * @param {String} service - The name of the service
 * @param {Function} done
 */
function removeService(configDir, service, done) {
  $.checkArgument(utils.isAbsolutePath(configDir), 'An absolute path is expected');
  $.checkArgument(_.isString(service), 'A string is expected for the service argument');

  uninstallService(configDir, service, done);


}

/**
 * Will remove the Node.js service and from the pacglobal-node configuration.
 * @param {String} options.cwd - The current working directory
 * @param {String} options.dirname - The pacglobal-node configuration directory
 * @param {Array} options.services - An array of strings of service names
 * @param {Function} done - A callback function called when finished
 */
function remove(options, done) {
  $.checkArgument(_.isObject(options));
  $.checkArgument(_.isFunction(done));
  $.checkArgument(
    _.isString(options.path) && utils.isAbsolutePath(options.path),
    'An absolute path is expected'
  );
  $.checkArgument(Array.isArray(options.services));

  var configPath = options.path;
  var services = options.services;

  var pacglobalConfigPath = path.resolve(configPath, 'pacglobal-node.json');
  var packagePath = path.resolve(configPath, 'package.json');

  if (!fs.existsSync(pacglobalConfigPath) || !fs.existsSync(packagePath)) {
    return done(
      new Error('Directory does not have a pacglobal-node.json and/or package.json file.')
    );
  }

  async.eachSeries(
    services,
    function(service, next) {
      // if the service is installed remove it
      removeService(configPath, service, function(err) {
        if (err) {
          return next(err);
        }
        // remove service to pacglobal-node.json
        removeConfig(pacglobalConfigPath, service, next);
      });
    }, done
  );
}

module.exports = remove;
