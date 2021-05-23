const defaultData = {
  result: 0,
  err: '',
};

/**
 * 获得成功类型的数据
 *
 * @param {Object | Promise} data 可能是plain object，也可能是 Promise
 */
function getSuccessData(data = {}) {
  return {
    retcode: 0,
    result: Object.assign({}, defaultData, data),
  };
}

/**
 * 获得失败类型的数据
 *
 * @param {Number | Promise} errCode 可能是Number，也可能是 Promise
 * @param {String} [errMsg] 错误信息
 */
function getErrorData(errCode, errMsg) {
  return {
    retcode: errCode,
    err_msg: errMsg,
  };
}

module.exports = {
  getSuccessData,
  getErrorData,
};
