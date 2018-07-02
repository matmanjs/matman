'use strict';

const path = require('path');
const fs = require('fs');
const Promise = require('bluebird');
const fse = require('fs-extra');

const localServer = require('../../../business/local-server');

module.exports = function (args) {
  // console.log(args);
  // console.log(process.cwd());
  const cwd = process.cwd();

  // 是否为开发模式，此时使用 node 启动服务，否则使用 pm2 启动
  // matman start --dev
  const isDev = !!args.dev;

  // 传递进来的文件，或者默认的 matman.config.js 文件
  let config = args.config || 'matman.config.js';

  // 绝对路径
  let configAbsolutePath = path.resolve(cwd, config);

  // 一定要检查config文件是否存在
  if (fs.existsSync(configAbsolutePath)) {
    console.log('Load config file:', configAbsolutePath);
  } else {
    console.error('Unkown config file: ', configAbsolutePath);
    return Promise.reject();
  }

  // 启动本地服务
  localServer.startServer(isDev,configAbsolutePath, cwd);

  return Promise.resolve();
};
