'use strict';

const vm = require('vm');
const path = require('path');
const Module = require('module');
const osenv = require('osenv');
const Promise = require('bluebird');
const chalk = require('chalk');
const fs = require('hexo-fs');
const logger = require('./logger');
const Command = require('./command');
const utils = require('../utils');
const pkg = require('../../package.json');
const sep = path.sep;

/**
 * A command line tool aims to improve front-end engineer workflow.
 *
 */
class Matman {

  /**
   * Set root and plugin path, context variable include log, cli command object.
   * @param args
   */
  constructor(args) {
    args = args || {};

    const base = path.join(osenv.home(), './.matman');
    const rcPath = path.join(base, '.matmanrc.yml');

    this.version = pkg.version;
    this.baseDir = base;
    this.rcPath = rcPath;
    this.pkgPath = path.join(base, 'package.json');
    this.pluginDir = path.join(base, 'node_modules') + sep;
    this.logDir = path.join(base, 'logs');

    this.config = utils.parseYaml(rcPath);            // Read matman local config.

    this.log = logger({
      debug: Boolean(args.debug),
      silent: Boolean(args.silent)
    });

    this.cmd = new Command();
  }

  /**
   * Read config and load internal and external plugins.
   */
  init() {
    const self = this;

    this.log.debug('Matman version: %s', chalk.magenta(this.version));

    // Load internal plugins
    require('../internal/console')(this);
    require('../internal/config')(this);
    // require('../internal/build-mocker')(this);
    require('../internal/build')(this);
    require('../internal/init')(this);
    require('../internal/start')(this);

    // Init client and load external plugins
    return Promise.each([
      'initClient',
      // TODO 暂时屏蔽
      // 'upgrade',
      // 'loadPlugins'
    ], function (name) {
      return require('./' + name)(self);
    }).then(function () {
      // Init success
      self.log.debug('init success!');
    });

  }

  /**
   * Call a command in console.
   * @param name
   * @param args
   * @param callback
   */
  call(name, args, callback) {
    if (!callback && typeof args === 'function') {
      callback = args;
      args = {};
    }

    const self = this;

    return new Promise(function (resolve, reject) {
      const c = self.cmd.get(name);

      if (c) {
        c.call(self, args).then(resolve, reject);
      } else {
        reject(new Error('Command `' + name + '` has not been registered yet!'));
      }
    }).asCallback(callback);
  }

  /**
   * Load a plugin with vm module and inject matman variable,
   * matman is an instance and has context environment.
   *
   * @param pluginPath      {String}    Plugin path
   * @param callback  {Function}  Callback
   */
  loadPlugin(pluginPath, callback) {
    const self = this;

    return fs.readFile(pluginPath).then((script) => {

      const module = new Module(pluginPath);
      module.filename = pluginPath;
      module.paths = Module._nodeModulePaths(pluginPath);

      function require(paths) {
        return module.require(paths);
      }

      require.resolve = function (request) {
        return Module._resolveFilename(request, module);
      };

      require.main = process.mainModule;
      require.extensions = Module._extensions;
      require.cache = Module._cache;

      // Inject matman variable
      script = '(function(exports, require, module, __filename, __dirname, matman){' +
        script + '});';

      const fn = vm.runInThisContext(script, pluginPath);

      return fn(module.exports, require, module, pluginPath, path.dirname(pluginPath), self);
    }).asCallback(callback);
  }

}

module.exports = Matman;
