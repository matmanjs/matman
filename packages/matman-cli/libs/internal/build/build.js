const path = require('path');

const matmanCrawler = require('matman-crawler');
const {MATMAN_CONFIG_FILE, findMatmanConfig} = require('matman-core');

/**
 *
 * @param {Object} args 参数
 * @param {Boolean} [args.dev] 是否为开发者模式，使用方式: --dev
 * @param {String} [args.config] 自定义配置文件，使用方式: --config=matman.config.js
 */
module.exports = function (args) {
  // console.log(args);
  const cwd = process.cwd();
  const isDevBuild = !!args.dev;
  const config = args.config || MATMAN_CONFIG_FILE;

  // 绝对路径
  const configAbsolutePath = path.resolve(cwd, config);

  // matmanConfig 额外的参数
  const matmanConfigOpts = {
    isDevBuild,
  };

  // 获取 matman.config.js 配置文件中的内容
  const matmanConfig = findMatmanConfig(configAbsolutePath, matmanConfigOpts);

  // 校验是否找得到 matman.config.js
  if (!matmanConfig) {
    return Promise.reject(`'Unknown config file: ${configAbsolutePath}`);
  }

  console.log(`Success load config file:  ${configAbsolutePath}`);

  return matmanCrawler.build(matmanConfig);
};
