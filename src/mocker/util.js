const urlHandle = require('url-handle');
const MatmanQueryItem = require('../business/MatmanQueryItem');
const MatmanQuery = require('../business/MatmanQuery');

/**
 * 在 req.headers.referer 中携带了 query 参数的 key 值，如果携带了则将作为额外参数传递给 mocker
 *
 * @type {String}
 */
const REFERER_KEY = '_matman';

/**
 * 获得 req.headers.referer 中携带的额外参数
 *
 * @param {String} referer req.headers.referer
 * @returns {{_m_name:String,_m_target:String,_m_disable:Number}[]} 结果
 */
function getMatmanQueryItemsFromReferer(referer) {
  let paramsFromReferer;

  try {
    paramsFromReferer = JSON.parse(urlHandle.query(REFERER_KEY, referer)) || [];
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
 * @returns {MatmanQueryItem | null}
 */
function getMatmanQueryItem(referer, name) {
  let matmanQueryItemsFromReferer = getMatmanQueryItemsFromReferer(referer);

  console.log('====matmanQueryItemsFromReferer=====', matmanQueryItemsFromReferer);

  // 判断该路由的名字是否在referer中
  let result = matmanQueryItemsFromReferer.filter((item) => {
    return item[MatmanQuery.queryKey] === name;
  })[0];

  if (!result) {
    return null;
  }

  return new MatmanQueryItem(result);
}

module.exports = {
  getMatmanQueryItemsFromReferer: getMatmanQueryItemsFromReferer,
  getMatmanQueryItem: getMatmanQueryItem
};