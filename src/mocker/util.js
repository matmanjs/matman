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

  // 判断该路由的名字是否在referer中
  let result = matmanQueryItemsFromReferer.filter((item) => {
    return item[matmanQuery.QUERY_KEY] === name;
  })[0];

  if (!result) {
    return null;
  }

  return new matmanQuery.Item(result);
}

module.exports = {
  getMatmanQueryItemsFromReferer: getMatmanQueryItemsFromReferer,
  getMatmanQueryItem: getMatmanQueryItem
};