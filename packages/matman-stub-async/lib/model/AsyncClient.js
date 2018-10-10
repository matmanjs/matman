'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var SocketClient = require('./SocketClient');
var util = require('../util');

var AsyncClient = function (_SocketClient) {
  _inherits(AsyncClient, _SocketClient);

  /**
   *
   * @param {String} [url] socket启动地址，例如 http://10.66.95.54:3000'，如果是移动端代理，记得要写IP，而不能够使用 localhost 或者 127.0.0.1 这种
   * @param {Object} [opts] 额外参数
   */
  function AsyncClient(url) {
    var opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    _classCallCheck(this, AsyncClient);

    var _this = _possibleConstructorReturn(this, (AsyncClient.__proto__ || Object.getPrototypeOf(AsyncClient)).call(this, url));

    _this.opts = opts;
    return _this;
  }

  _createClass(AsyncClient, [{
    key: 'listen',
    value: function listen(route, callback) {
      util.listen(this, route, callback);
    }
  }, {
    key: 'request',
    value: function request(route, params) {
      return util.request(this, route, params);
    }
  }]);

  return AsyncClient;
}(SocketClient);

module.exports = AsyncClient;