const defaultData = {
  'uid': 0,
  'name': '',
  'age': 0,
  'description': ''
};

/**
 * 获得成功类型的数据
 *
 * @param {Object} data 实际的业务数据
 * @returns {Object}
 */
export function getSuccessData(data = {}) {
  return {
    'retcode': 0,
    'result': Object.assign({}, defaultData, data)
  };
}

/**
 * 获得失败类型的数据
 *
 * @param {Number} errCode 错误码
 * @param {String} [errMsg] 错误信息
 * @returns {Object}
 */
export function getFailData(errCode, errMsg) {
  return {
    'retcode': errCode,
    'errmsg': errMsg
  };
}

