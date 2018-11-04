'use strict';

var _typeof2 = require('babel-runtime/helpers/typeof');

var _typeof3 = _interopRequireDefault(_typeof2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var gConfig = require('../config');

var MatmanQueryItem = function () {
  /**
   * 构造函数
   *
   * @param {Object | String} mockerName mocker 的名字，或者是对象
   * @param {String} [mockModuleName] mock module 的名字
   * @param {Boolean} [shouldDisableMatman] 是否禁用 mocker 服务
   */
  function MatmanQueryItem(mockerName, mockModuleName, shouldDisableMatman) {
    (0, _classCallCheck3.default)(this, MatmanQueryItem);

    if (mockerName && (typeof mockerName === 'undefined' ? 'undefined' : (0, _typeof3.default)(mockerName)) === 'object') {
      // 如果传入的是对象，则假设这个对象是符合 MatmanQueryItem 字段定义的对象
      this._m_name = mockerName._m_name;
      this[gConfig.TARGET_FIELD] = mockerName[gConfig.TARGET_FIELD];
      this._m_disable = mockerName._m_disable;
    } else {
      // 如果传递的是普通的参数，则依次设置
      this._m_name = mockerName;
      this[gConfig.TARGET_FIELD] = mockModuleName;
      this._m_disable = shouldDisableMatman ? 1 : 0;
    }
  }

  /**
   * 是否为 disable 状态
   *
   * @returns {Boolean}
   */


  (0, _createClass3.default)(MatmanQueryItem, [{
    key: 'isDisabled',
    value: function isDisabled() {
      return !!this._m_disable;
    }

    /**
     * 通过名字查询是否为当前的 MatmanQueryItem 项
     *
     * @param {String} name 数据模块名字
     * @returns {Boolean}
     */

  }, {
    key: 'isMe',
    value: function isMe(name) {
      return this._m_name === name;
    }
  }]);
  return MatmanQueryItem;
}();

module.exports = MatmanQueryItem;