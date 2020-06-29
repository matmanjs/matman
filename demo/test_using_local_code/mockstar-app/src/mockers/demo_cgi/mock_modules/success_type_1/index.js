const { getSuccessData } = require('../../base');

/**
 *
 * @param {Object} params 请求参数的对象，例如 ?a=1&b=2 ，则 params={a:1,b:2}
 * @param {Object} req 详见 http://expressjs.com/en/4x/api.html#req
 * @return {Promise|*}
 */
module.exports = function (params, req) {
    return getSuccessData({
        uid: params.uid || 11111,
        type: 1,
        description: '我是学生',
        other_msg: '【更灵活】支持符合 CommonJS 规范的 node 模块'
    });
};