const path = require('path');
const urlHandle = require('url-handle');
const matmanQuery = require('../business/matman-query');

/**
 * 获得 req.headers.referer 中携带的额外参数
 *
 * @param {String} referer req.headers.referer
 * @returns {{_m_name:String,_m_target:String,_m_disable:Number}[]} 结果
 */
function getMatmanQueryItemsFromReferer(referer) {
  let paramsFromReferer;

  try {
    paramsFromReferer = JSON.parse(urlHandle.query(matmanQuery.QUERY_KEY, referer)) || [];
  } catch (e) {
    paramsFromReferer = [];
  }

  return paramsFromReferer;
}

/**
 * 获得 req.headers.referer 中指定名字的携带的额外参数
 *
 * @param {String} referer req.headers.referer
 * @param {String} name 指定的 mocker 名字
 * @returns {Item | null}
 */
function getMatmanQueryItem(referer, name) {
  let matmanQueryItemsFromReferer = getMatmanQueryItemsFromReferer(referer);

  let result = null;

  // 判断该路由的名字是否在referer中
  for (let i = 0, length = matmanQueryItemsFromReferer.length; i < length; i++) {
    let matmanQueryItem = new matmanQuery.Item(matmanQueryItemsFromReferer[i]);
    if (matmanQueryItem.isMe(name)) {
      result = matmanQueryItem;
      break;
    }
  }

  return result;
}

/**
 * 获得 mock server 的根目录绝对路径
 * @param {String} rootPath 项目根目录
 * @param {String} mockServerPath
 * @returns {String}
 */
function getMockServerBasePath(rootPath, mockServerPath) {
  let result = mockServerPath || './mock_server/mockers';
  if (!path.isAbsolute(result)) {
    result = path.resolve(rootPath, result);
  }
  return result;
}

/**
 * 获得 mock server 的根目录绝对路径
 * @param {String} rootPath 项目根目录
 * @param {String} buildPath
 * @returns {String}
 */
function getMockServerBuildPath(rootPath, buildPath) {
  let result = buildPath || './build';
  if (!path.isAbsolute(result)) {
    result = path.resolve(rootPath, result);
  }
  return result;
}

module.exports = {
  getMatmanQueryItemsFromReferer: getMatmanQueryItemsFromReferer,
  getMatmanQueryItem: getMatmanQueryItem,
  getMockServerBasePath: getMockServerBasePath,
  getMockServerBuildPath: getMockServerBuildPath
};