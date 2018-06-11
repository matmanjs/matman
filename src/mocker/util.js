const urlHandle = require('url-handle');

/**
 * 在 req.headers.referer 中携带了 query 参数的 key 值，如果携带了则将作为额外参数传递给 mocker
 *
 * @type {String}
 */
const REFERER_KEY = '_matman';

/**
 * 获得 req.headers.referer 中携带的额外参数
 *
 * @param {String} referer
 * @returns {{_m_name:String,_m_target:String,_m_disable:Number}[]} 结果
 */
function getParamsFromReferer(referer) {
  let paramsFromReferer;

  try {
    paramsFromReferer = JSON.parse(urlHandle.query(REFERER_KEY, referer)) || [];
  } catch (e) {
    paramsFromReferer = [];
  }

  return paramsFromReferer;
}

module.exports = {
  getParamsFromReferer: getParamsFromReferer
};