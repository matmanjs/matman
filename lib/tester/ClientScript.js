'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var fs = require('fs');
var path = require('path');
var glob = require('glob');

var ClientScript = function () {
  /**
   * 构造函数
   *
   * @param {Object | String} opts 参数
   * @param {String} [opts.basePath]  项目根目录
   * @param {String} [opts.buildPath] client script 构建之后的目录
   * @param {RegExp} [opts.regMatch] 用于匹配是 client script 的正则
   */
  function ClientScript(opts) {
    _classCallCheck(this, ClientScript);

    // 如果 opts 为字符串，则认为是 matman.config.js 的绝对路径
    if (opts && typeof opts === 'string') {
      var matmanConfigAbsolutePath = path.isAbsolute(opts) ? opts : path.resolve(opts);
      if (!fs.existsSync(matmanConfigAbsolutePath)) {
        throw new Error('Unknown matman.config.js path: ' + matmanConfigAbsolutePath);
      }

      var config = require(matmanConfigAbsolutePath);

      opts = {
        basePath: config.basePath || path.dirname(matmanConfigAbsolutePath),
        buildPath: config.clientScriptBuildPath,
        regMatch: config.clientScriptMatch
      };
    }

    this.basePath = opts.basePath;
    this.regMatch = opts.regMatch || /crawlers\/.*\.js$/;

    // 设置默认值和绝对路径
    this.buildPath = opts.buildPath || './build/client-script';
    if (!path.isAbsolute(this.buildPath)) {
      this.buildPath = path.resolve(this.basePath, this.buildPath);
    }
  }

  _createClass(ClientScript, [{
    key: 'getEntry',
    value: function getEntry() {
      var _this = this;

      var entry = {};

      var globResult = glob.sync(path.resolve(this.basePath, './**/**.js'));

      globResult.forEach(function (item) {
        var matchResult = item.match(_this.regMatch);

        if (matchResult) {
          var entryScript = item.match(new RegExp('/([^/]*/' + matchResult[0] + ')', 'i'))[1];
          var entryName = entryScript.replace('.js', '');

          entry[entryName] = item;
        }
      });

      return entry;
    }
  }, {
    key: 'getPath',
    value: function getPath(name) {
      var webpackConfig = require(path.resolve(this.buildPath, './webpack-config'));

      return path.join(webpackConfig.output.path, webpackConfig.output.filename.replace('[name]', name));
    }
  }]);

  return ClientScript;
}();

module.exports = ClientScript;