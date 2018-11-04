const SocketClient = require('./SocketClient');
const util = require('../util');

class AsyncClient extends SocketClient {
  /**
   *
   * @param {String} [url] socket启动地址，例如 http://10.66.95.54:3000'，如果是移动端代理，记得要写IP，而不能够使用 localhost 或者 127.0.0.1 这种
   * @param {Object} [opts] 额外参数
   */
  constructor(url, opts = {}) {
    super(url);

    this.opts = opts;
  }

  listen(route, callback) {
    util.listen(this, route, callback);
  }

  request(route, params) {
    return util.request(this, route, params);
  }

}

module.exports = AsyncClient;