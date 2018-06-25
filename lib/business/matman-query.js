'use strict';

var _typeof2 = require('babel-runtime/helpers/typeof');

var _typeof3 = _interopRequireDefault(_typeof2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var QUERY_KEY = '_matman';

var Item = function () {
  /**
   * 构造函数
   *
   * @param {Object | String} mockerName mocker 的名字，或者是对象
   * @param {String} [mockModuleName] mock module 的名字
   * @param {Boolean} [shouldDisableMatman] 是否禁用 mocker 服务
   */
  function Item(mockerName, mockModuleName, shouldDisableMatman) {
    (0, _classCallCheck3.default)(this, Item);

    if (mockerName && (typeof mockerName === 'undefined' ? 'undefined' : (0, _typeof3.default)(mockerName)) === 'object') {
      // 如果传入的时对象
      this._m_name = mockerName._m_name;
      this._m_target = mockerName._m_target;
      this._m_disable = mockerName._m_disable;
    } else {
      // 依次设置
      this._m_name = mockerName;
      this._m_target = mockModuleName;
      this._m_disable = shouldDisableMatman ? 1 : 0;
    }
  }

  (0, _createClass3.default)(Item, [{
    key: 'isDisabled',
    value: function isDisabled() {
      return !!this._m_disable;
    }
  }, {
    key: 'isMe',
    value: function isMe(name) {
      return this._m_name === name;
    }
  }]);
  return Item;
}();

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
      this.list.push(new Item(mockerName, mockModuleName, shouldDisableMatman));
    }
  }, {
    key: 'getQueryString',
    value: function getQueryString() {
      return QUERY_KEY + '=' + JSON.stringify(this.list);
    }
  }]);
  return MatmanQuery;
}();

module.exports = {
  Item: Item,
  MatmanQuery: MatmanQuery,
  QUERY_KEY: QUERY_KEY
};