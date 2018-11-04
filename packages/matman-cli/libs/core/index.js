'use strict';

const path = require('path');
const osenv = require('osenv');
const Promise = require('bluebird');
const chalk = require('chalk');
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
        this.baseDir = base + sep;
        this.rcPath = rcPath;
        this.pkgPath = path.join(base, 'package.json');
        this.pluginDir = path.join(base, 'node_modules') + sep;
        this.logDir = path.join(base, 'logs');

        // this.config = utils.parseYaml(rcPath);            // Read matman local config.
        this.config = {};

        this.log = logger({
            debug: Boolean(args.debug),
            silent: Boolean(args.silent)
        });

        this.cmd = new Command();
    }

    /**
     * Read config and load internal and external plugins.
     */
    init(pluginList = []) {
        const self = this;

        this.log.debug('Matman version: %s', chalk.magenta(this.version));

        // Load internal plugins
        if (Array.isArray(pluginList)) {
            pluginList.forEach((plugin) => {
                plugin(this);
            });
        }

        // Init client and load external plugins
        return Promise.each([
            'initClient'
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
}

module.exports = Matman;
