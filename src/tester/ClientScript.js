const fs = require('fs');
const path = require('path');
const glob = require('glob');

class ClientScript {
  /**
   * 构造函数
   *
   * @param {Object | String} opts 参数
   * @param {String} [opts.basePath]  项目根目录
   * @param {String} [opts.buildPath] client script 构建之后的目录
   * @param {RegExp} [opts.regMatch] 用于匹配是 client script 的正则
   */
  constructor(opts) {
    // 如果 opts 为字符串，则认为是 matman.config.js 的绝对路径
    if (opts && (typeof opts === 'string')) {
      let matmanConfigAbsolutePath = path.isAbsolute(opts) ? opts : path.resolve(opts);
      if (!fs.existsSync(matmanConfigAbsolutePath)) {
        throw new Error('Unknown matman.config.js path: ' + matmanConfigAbsolutePath);
      }

      let config = require(matmanConfigAbsolutePath);

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

  getEntry() {
    let entry = {};

    let globResult = glob.sync(path.resolve(this.basePath, './**/**.js'));

    globResult.forEach((item) => {
      let matchResult = item.match(this.regMatch);

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