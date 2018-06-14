'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

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
    _classCallCheck(this, Item);

    if (mockerName && (typeof mockerName === 'undefined' ? 'undefined' : _typeof(mockerName)) === 'object') {
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

  _createClass(Item, [{
    key: 'isDisabled',
    value: function isDisabled() {
      return !!this._m_disable;
    }
  }]);

  return Item;
}();

var MatmanQuery = function () {
  /**
   * 构造函数
   */
  function MatmanQuery() {
    _classCallCheck(this, MatmanQuery);

    this.list = [];
  }

  /**
   * 增加一个元素
   *
   * @param {Object | String} mockerName mocker 的名字
   * @param {String} mockModuleName mock module 的名字
   * @param {Boolean} shouldDisableMatman 是否禁用 mocker 服务
   */


  _createClass(MatmanQuery, [{
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
  MatmanQuery: MatmanQuery,
  QUERY_KEY: QUERY_KEY
};