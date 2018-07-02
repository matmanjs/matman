const run = require('./run');
const runByPm2 = require('./run-by-pm2');

const runConfig = require('./config');

/**
 * 启动服务
 *
 * @param {Boolean} isDev 是否为开发者模式
 * @param {String} configAbsolutePath matman.config.js 文件的绝对路径
 * @param {String} [cwd] 项目启动的目录，默认为 process.cwd()
 */
function startServer(isDev, configAbsolutePath, cwd) {
  // 开发模式下，直接调用执行
  let matmanConfig = require(configAbsolutePath);

  // 如果不定义 rootPath，则默认取 process.cwd()
  if (!matmanConfig.rootPath) {
    matmanConfig.rootPath = cwd || process.cwd();
  }

  // 获取一些默认值
  let configOpts = runConfig.getConfigOpts(matmanConfig);

  // 如果没法获取配置项，则将无法启动成功
  if (!configOpts) {
    throw new Error('Invalid param!');
  }

  if (isDev) {
    run(configOpts);
  } else {
    runByPm2(configOpts);
  }
}

module.exports = {
  startServer: startServer
};