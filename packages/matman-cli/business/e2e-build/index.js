const matman = require('../matman');

/**
 * @function createProdConfig
 * @desc     创建用于生产环境中的webpack打包配置
 *
 * @param {Object} params
 * @param {String} params.rootPath 项目根目录
 * @param {String} params.e2eTestPath 端对端测试项目的根目录
 * @param {RegExp} params.clientScriptMatch 正则表达式，用于匹配路径中那些文件是 client script
 * @param {String} params.clientScriptBuildPath 输出打包后的 client script 的路径
 * @example
 */
function getClientScriptHandler(params) {
  const clientScript = new matman.ClientScript({
    rootPath: params.rootPath,
    basePath: params.e2eTestPath,
    buildPath: params.clientScriptBuildPath,
    regMatch: params.clientScriptMatch
  });

  return clientScript;
}

module.exports = {
  getClientScriptHandler: getClientScriptHandler
};