'use strict';

const fs = require('hexo-fs');
const inquirer = require('inquirer');
const Promise = require('bluebird');
const utils = require('../utils');

/**
 * Init matman client, including ~/.matman, ~/.matman/package.json, ~/.matman/.matmanrc.yml
 */
class Client {

  constructor(ctx) {
    this.ctx = ctx;
    this.log = ctx.log;
  }

  initHome() {
    const ctx = this.ctx;
    const { baseDir, log } = ctx;

    return new Promise(function (resolve) {
      if (fs.existsSync(baseDir) && fs.statSync(baseDir).isFile()) {
        fs.unlinkSync(baseDir);
      }

      // 注意 fs.existsSync('.matman/') 与 fs.existsSync('.matman') 结果不一样
      if (!fs.existsSync(baseDir)) {
        log.info('检测到这是您第一次使用matman，即将进行cli client初始化');

        fs.mkdirsSync(baseDir);
      }

      log.debug('.matman 目录已经创建');
      resolve(ctx);
    });
  }

  initPkg() {
    const ctx = this.ctx;
    const { pkgPath, log } = ctx;

    return new Promise(function (resolve) {
      if (!fs.existsSync(pkgPath)) {
        fs.writeFileSync(pkgPath, JSON.stringify({
          'name': 'matman-home',
          'version': '0.0.0',
          'private': true
        }, null, 4));
      }

      log.debug('.matman/package.json 文件已经创建');
      resolve(ctx);
    });
  }

  initLocalRc() {
    const ctx = this.ctx;
    const { rcPath, config, log } = ctx;

    return new Promise(function (resolve) {
      if (!fs.existsSync(rcPath) || !config || !config.registry) {
        inquirer.prompt([{
          type: 'input',
          name: 'registry',
          message: '请输入npm的registry:',
          default: 'http://registry.npmjs.org'
        }, {
          type: 'input',
          name: 'proxy',
          message: '请输入npm的proxy(默认为空):'
        }]).then((answer) => {
          // Handle user input, trim space
          for (let prop in answer) {
            answer[prop] = answer[prop].trim();
          }
          // Save user config to local file system
          utils.safeDump(answer, rcPath);
          log.debug('.matman/.matmanrc.yml 配置文件已经创建');

          log.info('初始化完成，请输入命令开启 matman 的使用之旅。(帮助：matman -h)');
          process.exit(2);
          resolve(ctx);
        });
      } else {
        log.debug('.matman/.matmanrc.yml 配置文件已经创建');
        resolve(ctx);
      }
    });
  }

  initLogs() {
    const ctx = this.ctx;
    const { logDir, log } = ctx;
    return new Promise(function (resolve) {
      if (!fs.existsSync(logDir)) {
        fs.mkdirsSync(logDir);
      }
      log.debug('.matman/logs 日志文件夹已经创建');
      resolve(ctx);
    });
  }
}

module.exports = function (ctx) {
  const client = new Client(ctx);

  return Promise.all([
    client.initHome(),
    client.initPkg(),
    // client.initLocalRc(),
    client.initLogs()
  ]);
};
