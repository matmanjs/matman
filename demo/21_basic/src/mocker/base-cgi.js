/**
 * 获得成功的数据
 *
 * @param {*} result
 * @returns {{retcode: number, result: *}}
 */
function getSuccess(result) {
    return {
        retcode: 0,
        result: result
    };
}

/**
 * 获得失败的数据
 *
 * @param {Number} errCode
 * @param {String} [errMsg]
 * @returns {{retcode: Number, errmsg: String}}
 */
function getFail(errCode, errMsg = '') {
    return {
        retcode: errCode,
        errmsg: errMsg
    };
}

module.exports = {
    getSuccess: getSuccess,
    getFail: getFail
};