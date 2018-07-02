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

var Mocker = function () {
  /**
   * 构造函数
   *
   * @param {String} basePath mocker 的绝对路径
   */
  function Mocker(basePath) {
    (0, _classCallCheck3.default)(this, Mocker);

    this.basePath = basePath;

    // config.json 的内容
    var config = require(path.join(this.basePath, './config'));

    // 优先使用 config.name，其次是模块的文件夹名
    this.name = config.name || path.basename(this.basePath);

    // mock module 配置列表
    this.mockModuleList = this._getMockModuleList();

    // mocker config 配置参数
    this.config = new MockerConfig(this.name, config, this.mockModuleList);
  }

  (0, _createClass3.default)(Mocker, [{
    key: 'updateConfig',
    value: function updateConfig(opts) {
      this.config = _.merge({}, this.config, opts);
    }
  }, {
    key: '_getMockModuleList',
    value: function _getMockModuleList() {
      var _this = this;

      var mockModuleList = [];

      // 1. 获取所有的 mocker，约定：this.basePath 的每个子目录都是一个独立的 mocker
      fsHandler.search.getAll(this.basePath, { globs: ['mock_modules/*'] }).forEach(function (item) {
        // 模块名字，默认取文件夹或文件名
        var name = path.basename(item.relativePath, '.js');

        // 注意也可能是 json 文件
        name = path.basename(name, '.json');

        // console.log('\n找到 mock module ：', name, item);

        var requireModulePath = path.join(_this.basePath, 'mock_modules', name);

        var module = require(requireModulePath);

        // 是否存在配置文件
        var config = void 0;
        if (item.isDirectory() && (fs.existsSync(path.join(requireModulePath, 'config.json')) || fs.existsSync(path.join(requireModulePath, 'config.js')))) {
          config = require(path.join(requireModulePath, 'config'));
        }

        mockModuleList.push(new MockModule(name, module, config));
      });

      return mockModuleList;
    }
  }]);
  return Mocker;
}();

module.exports = Mocker;