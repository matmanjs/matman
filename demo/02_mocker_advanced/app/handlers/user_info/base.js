'use strict';

exports.__esModule = true;

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

exports.getSuccessData = getSuccessData;
exports.getFailData = getFailData;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var defaultData = {
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
function getSuccessData() {
  var data = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  return {
    'retcode': 0,
    'result': (0, _assign2.default)({}, defaultData, data)
  };
}

/**
 * 获得失败类型的数据
 *
 * @param {Number} errCode 错误码
 * @param {String} [errMsg] 错误信息
 * @returns {Object}
 */
function getFailData(errCode, errMsg) {
  return {
    'retcode': errCode,
    'errmsg': errMsg
  };
}