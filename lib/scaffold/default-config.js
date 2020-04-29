'use strict';

var path = require('path');
var mkdirp = require('mkdirp');
var fs = require('fs');

/**
 * Will return the path and default pacglobal-node configuration. It will search for the
 * configuration file in the "~/.PACGlobal" directory, and if it doesn't exist, it will create one
 * based on default settings.
 * @param {Object} [options]
 * @param {Array} [options.additionalServices] - An optional array of services.
 */
function getDefaultConfig(options) {
  /* jshint maxstatements: 40 */
  if (!options) {
    options = {};
  }

  var defaultPath = path.resolve(process.env.HOME, './.PACGlobal');
  var defaultConfigFile = path.resolve(defaultPath, './pacglobal-node.json');

  if (!fs.existsSync(defaultPath)) {
    mkdirp.sync(defaultPath);
  }

  var defaultServices = ['pacglobald', 'web'];
  if (options.additionalServices) {
    defaultServices = defaultServices.concat(options.additionalServices);
  }

  if (!fs.existsSync(defaultConfigFile)) {

    var defaultConfig = {
      network: 'livenet',
      port: 3001,
      services: defaultServices,
      servicesConfig: {
        pacglobald: {
          connect: [{
            rpchost: '127.0.0.1',
            rpcport: 7112,
            rpcuser: 'koenpeters',
            rpcpassword: 'koenislekker',
            zmqpubrawtx: 'tcp://127.0.0.1:28332'
          }]
        }
      }
    };
    fs.writeFileSync(defaultConfigFile, JSON.stringify(defaultConfig, null, 2));
  }

  var defaultDataDir = path.resolve(defaultPath, './data');

  if (!fs.existsSync(defaultDataDir)) {
    mkdirp.sync(defaultDataDir);
  }

  var config = JSON.parse(fs.readFileSync(defaultConfigFile, 'utf-8'));

  return {
    path: defaultPath,
    config: config
  };

}

module.exports = getDefaultConfig;
