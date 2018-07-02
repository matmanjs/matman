'use strict';

var path = require('path');
var urlHandle = require('url-handle');

var _require = require('../config'),
    MATMAN_QUERY_KEY = _require.MATMAN_QUERY_KEY;

var MatmanQueryItem = require('./model/MatmanQueryItem');

/**
 * 获得 req.headers.referer 中携带的额外参数列表
 *
 * @param {String} referer req.headers.referer
 * @returns {{_m_name:String,_m_target:String,_m_disable:Number}[]} 结果
 */
function getMatmanQueryItemsFromReferer(referer) {
  var paramsFromReferer = void 0;

  try {
    paramsFromReferer = JSON.parse(urlHandle.query(MATMAN_QUERY_KEY, referer)) || [];
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
  var matmanQueryItemsFromReferer = getMatmanQueryItemsFromReferer(referer);

  var result = null;

  // 判断该路由的名字是否在referer中
  for (var i = 0, length = matmanQueryItemsFromReferer.length; i < length; i++) {
    var matmanQueryItem = new MatmanQueryItem(matmanQueryItemsFromReferer[i]);
    if (matmanQueryItem.isMe(name)) {
      result = matmanQueryItem;
      break;
    }
  }

  return result;
}

/**
 * 获得 mock server 的根目录绝对路径
 *
 * @param {String} rootPath 项目根目录
 * @param {String} mockServerPath
 * @returns {String}
 */
function getMockServerBasePath(rootPath, mockServerPath) {
  var result = mockServerPath || './mock_server';

  if (!path.isAbsolute(result)) {
    result = path.resolve(rootPath, result);
  }

  return result;
}

/**
 * 获得 mock server 的构建之后的根目录绝对路径
 * @param {String} rootPath 项目根目录
 * @param {String} buildPath
 * @returns {String}
 */
function getMockServerBuildPath(rootPath, buildPath) {
  var result = buildPath || './build';

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