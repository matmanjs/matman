const fs = require('fs');
const path = require('path');
const _ = require('lodash');
const fsHandler = require('fs-handler');

const MockerConfig = require('./MockerConfig');
const MockModule = require('./MockModule');

/**
 * 案例
 */
class Case {
  /**
   * 构造函数
   *
   * @param {String} basePath case 的绝对路径
   */
  constructor(basePath) {
    this.basePath = basePath;

    // config.json 的内容
    const config = require(path.join(this.basePath, './config'));

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

  updateConfig(opts) {
    this.config = _.merge({}, this.config, opts);
  }

}

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