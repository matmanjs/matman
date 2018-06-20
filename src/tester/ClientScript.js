const fs = require('fs');
const path = require('path');
const glob = require('glob');

class ClientScript {
  /**
   * 构造函数
   *
   * @param {Object | String} opts 参数
   * @param {String} [opts.rootPath]  项目的根目录
   * @param {String} [opts.basePath]  client script 的根目录
   * @param {String} [opts.buildPath] client script 构建之后的目录
   * @param {RegExp} [opts.regMatch] 用于匹配是 client script 的正则
   */
  constructor(opts) {
    // 如果 opts 为字符串，则认为是 matman.config.js 的绝对路径，则直接获取配置项
    if (opts && (typeof opts === 'string')) {
      let matmanConfigAbsolutePath = path.isAbsolute(opts) ? opts : path.resolve(opts);
      if (!fs.existsSync(matmanConfigAbsolutePath)) {
        throw new Error('Unknown matman.config.js path: ' + matmanConfigAbsolutePath);
      }

      let config = require(matmanConfigAbsolutePath);

      opts = {
        rootPath: config.rootPath || path.dirname(matmanConfigAbsolutePath),
        basePath: config.e2ePath,
        buildPath: config.clientScriptBuildPath,
        regMatch: config.clientScriptMatch
      };
    }

    this.rootPath = opts.rootPath;
    this.regMatch = opts.regMatch || /crawlers\/.*\.js$/;

    // 设置默认值和绝对路径
    this.basePath = opts.basePath || './e2e/targets';
    if (!path.isAbsolute(this.basePath)) {
      this.basePath = path.resolve(this.rootPath, this.basePath);
    }

    if (!fs.existsSync(this.basePath)) {
      throw new Error('Unknown e2e path: ' + this.basePath);
    }

    // 设置默认值和绝对路径
    this.buildPath = opts.buildPath || './build/client-script';
    if (!path.isAbsolute(this.buildPath)) {
      this.buildPath = path.resolve(this.rootPath, this.buildPath);
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

  getPath(name) {
    const webpackConfig = require(path.resolve(this.buildPath, './webpack-config'));

    return path.join(webpackConfig.output.path, webpackConfig.output.filename.replace('[name]', name));
  }
}

module.exports = ClientScript;