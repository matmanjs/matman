const matmanE2E = require('matman-e2e');

/**
 *
 * @param {Object} params
 * @param {String} params.rootPath 项目根目录
 * @param {String} params.e2eTestPath 端对端测试项目的根目录
 * @param {RegExp} params.clientScriptMatch 正则表达式，用于匹配路径中那些文件是 client script
 * @param {String} params.clientScriptBuildPath 输出打包后的 client script 的路径
 * @param {Boolean} [isDevBuild] 是否为开发模式
 */
function getClientScriptHandler(params, isDevBuild) {
  const clientScript = new matmanE2E.ClientScript({
    rootPath: params.rootPath,
    basePath: params.e2eTestPath,
    buildPath: params.clientScriptBuildPath,
    regMatch: params.clientScriptMatch,
    isDevBuild: isDevBuild
  });

  return clientScript;
}

module.exports = {
  getClientScriptHandler: getClientScriptHandler
};