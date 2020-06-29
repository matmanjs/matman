/**
 * 获得CGI成功时返回的信息
 *
 * @param {Object | Promise} data CGI实际的数据
 * @param {Object} [defaultData] 默认的合并的数据
 * @returns {Promise}
 */
function getSuccessData(data, defaultData) {
    return Promise.resolve(data)
        .then(function (resultData) {
            return {
                'retcode': 0,
                'result': Object.assign({}, defaultData, resultData)
            };
        });
}

/**
 * 获得CGI异常和失败时返回的信息
 *
 * @param {Number | Promise} errCode 错误码
 * @param {String} [errMsg] 错误信息
 * @returns {Promise}
 */
function getErrorData(errCode, errMsg) {
    return Promise.resolve(errCode)
        .then(function (resultCode) {
            let obj = {
                'retcode': resultCode
            };

            if (errMsg) {
                obj.err_msg = errMsg;
            }

            return obj;
        });
}

module.exports = {
    success: getSuccessData,
    error: getErrorData
};