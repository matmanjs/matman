'use strict';

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _require = require('../config'),
    MATMAN_QUERY_KEY = _require.MATMAN_QUERY_KEY;

var MatmanQueryItem = require('./MatmanQueryItem');

var MatmanQuery = function () {
  /**
   * 构造函数
   */
  function MatmanQuery() {
    (0, _classCallCheck3.default)(this, MatmanQuery);

    this.list = [];
  }

  /**
   * 增加一个元素
   *
   * @param {Object | String} mockerName mocker 的名字
   * @param {String} mockModuleName mock module 的名字
   * @param {Boolean} shouldDisableMatman 是否禁用 mocker 服务
   */


  (0, _createClass3.default)(MatmanQuery, [{
    key: 'addOne',
    value: function addOne(mockerName, mockModuleName, shouldDisableMatman) {
      // TODO 也许这里应该要加一个去重判断
      this.list.push(new MatmanQueryItem(mockerName, mockModuleName, shouldDisableMatman));
    }

    /**
     * 获取附加到 url 上的 query string
     *
     * @returns {String}
     */

  }, {
    key: 'getQueryString',
    value: function getQueryString() {
      return MATMAN_QUERY_KEY + '=' + JSON.stringify(this.list);
    }
  }]);
  return MatmanQuery;
}();

module.exports = MatmanQuery;