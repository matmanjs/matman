import { getCgiSuccess, getCgiFail } from '../../util';

export const defaultData = {
  "isExist": false,
  "name": "",
  "version": 0
};

/**
 * 获得成功类型的数据
 *
 * @param {Object | Promise} data 可能是plain object，也可能是 Promise
 * @returns {Promise}
 */
export function success(data = {}) {
  return getCgiSuccess(data, defaultData);
}

/**
 * 获得失败类型的数据
 *
 * @param {Number | Promise} errCode 可能是Number，也可能是 Promise
 * @param {String} [errMsg] 错误信息
 * @returns {Promise}
 */
export function fail(errCode, errMsg) {
  return getCgiFail(errCode, errMsg);
}