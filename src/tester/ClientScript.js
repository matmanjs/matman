const fs = require('fs');
const path = require('path');
const _ = require('lodash');

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

    this.entry = {};
  }

  getEntry() {
    // let globResult = glob.sync(path.resolve(this.basePath, './**/crawlers/**.js'));
    let globResult = glob.sync(path.resolve(this.basePath, './**/**.js'));
    // console.log(this.clientScriptMatch)
    // console.log(this.clientScriptMatch.toString())
    // console.log(this.clientScriptMatch + '')

    globResult.forEach((item) => {
      // console.log(item,item.match(this.clientScriptMatch));
      let matchResult = item.match(this.clientScriptMatch);
      if (matchResult) {
        console.log(item);
        console.log(matchResult);
        console.log(matchResult[0]);
      }

    });
  }

}

module.exports = ClientScript;