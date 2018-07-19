'use strict';

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var fs = require('fs');
var path = require('path');
var _ = require('lodash');
var fsHandler = require('fs-handler');

var MockerConfig = require('./MockerConfig');
var MockModule = require('./MockModule');

/**
 * 案例
 */

var Case = function () {
  /**
   * 构造函数
   *
   * @param {String} basePath case 的绝对路径
   */
  function Case(basePath) {
    (0, _classCallCheck3.default)(this, Case);

    this.basePath = basePath;

    // config.json 的内容
    var config = require(path.join(this.basePath, './config'));

    // 优先使用 config.name，其次是模块的文件夹名
    this.name = config.name || path.basename(this.basePath);

    // 案例名字
    this.name = '';

    // 案例简要描述
    this.description = '';

    // 案例中包含哪些 mocker 和这个 mocker 的 activeModule
    this.list = [];

    // 案例 readme
  }

  (0, _createClass3.default)(Case, [{
    key: 'updateConfig',
    value: function updateConfig(opts) {
      this.config = _.merge({}, this.config, opts);
    }
  }]);
  return Case;
}();

module.exports = Case;

// function getCheckPic() {
//   let matmanQuery = new MatmanQuery();
//
//   matmanQuery.addOne('get_short_video', 'success_type_2', false);
//
//   matmanQuery.addOne('get_balance', 'success_16888', false);
//   matmanQuery.addOne('get_gift_list', 'success_basic', false);
//   matmanQuery.addOne('follow-anchor', 'success', false);
//   matmanQuery.addOne('get_verify_status', 'success_all_ok', false);
//   matmanQuery.addOne('exchange_gift', 'success', false);
//
//   return matmanQuery;
// }