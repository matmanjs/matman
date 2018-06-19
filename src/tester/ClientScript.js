const path = require('path');
const glob = require('glob');

class ClientScript {
  /**
   * 构造函数
   *
   * @param {Object} opts 参数
   * @param {String} opts.basePath mocker的根目录
   * @param {String} [opts.buildPath] client script 构建之后的目录
   * @param {String} [opts.clientScriptMatch] 用于匹配是 client script 的正则
   */
  constructor(opts) {
    this.basePath = opts.basePath;
    this.clientScriptMatch = opts.clientScriptMatch || /crawlers\/.*\.js$/;

    // 设置默认值和绝对路径
    this.buildPath = opts.buildPath || './build/client-script';
    if (!path.isAbsolute(this.buildPath)) {
      this.buildPath = path.resolve(this.basePath, this.buildPath);
    }

    this.entry = this._getEntry();
  }

  _getEntry() {
    let entry = {};

    let globResult = glob.sync(path.resolve(this.basePath, './**/**.js'));

    globResult.forEach((item) => {
      let matchResult = item.match(this.clientScriptMatch);

      if (matchResult) {
        let entryScript = item.match(new RegExp('/([^/]*/' + matchResult[0] + ')', 'i'))[1];
        let entryName = entryScript.replace('.js', '');

        entry[entryName] = item;
      }
    });

    return entry;
  }

}

module.exports = ClientScript;