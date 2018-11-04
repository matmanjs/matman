const baseCgi = require('../../lib/base-cgi');

/**
 * 默认值
 * @type {Object}
 */
const defaultResult = {
    uid: 0,
    type: 0,
    description: '',
    other_msg: 'other msg'
};

/**
 * 获得成功的数据
 *
 * @param {Object} result 变更的数据
 * @returns {Object}
 */
function getSuccess(result) {
    return baseCgi.getSuccess(Object.assign({}, defaultResult, result));
}

/**
 * 获得失败的数据
 *
 * @param {Number} errCode 错误码
 * @param {String} [errMsg] 错误信息
 * @returns {Object}
 */
function getFail(errCode, errMsg = '') {
    return baseCgi.getFail(errCode, errMsg);
}

module.exports = {
    getSuccess: getSuccess,
    getFail: getFail
};