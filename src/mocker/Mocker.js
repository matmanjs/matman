const fs = require('fs');
const path = require('path');
const _ = require('lodash');
const fsHandler = require('fs-handler');

const MockerConfig = require('./MockerConfig');
const MockModule = require('./MockModule');

class Mocker {
  /**
   * 构造函数
   *
   * @param {String} basePath mocker 的绝对路径
   */
  constructor(basePath) {
    this.basePath = basePath;

    // config.json 的内容
    const config = require(path.join(this.basePath, './config'));

    // 优先使用 config.name，其次是模块的文件夹名
    this.name = config.name || path.basename(this.basePath);

    // mock module 配置列表
    this.mockModuleList = this._getMockModuleList();

    // mocker config 配置参数
    this.config = new MockerConfig(this.name, config, this.mockModuleList);
  }

  updateConfig(opts) {
    this.config = _.merge({}, this.config, opts);
  }

  _getMockModuleList() {
    let mockModuleList = [];

    // 1. 获取所有的 mocker，约定：this.basePath 的每个子目录都是一个独立的 mocker
    fsHandler.search.getAll(this.basePath, { globs: ['mock_modules/*'] }).forEach((item) => {
      // 模块名字，默认取文件夹或文件名
      let name = path.basename(item.relativePath, '.js');

      // 注意也可能是 json 文件
      name = path.basename(name, '.json');

      // console.log('\n找到 mock module ：', name, item);

      let requireModulePath = path.join(this.basePath, 'mock_modules', name);

      let module = require(requireModulePath);

      // 是否存在配置文件
      let config;
      if (item.isDirectory() && (fs.existsSync(path.join(requireModulePath, 'config.json')) || fs.existsSync(path.join(requireModulePath, 'config.js')))) {
        config = require(path.join(requireModulePath, 'config'));
      }

      mockModuleList.push(new MockModule(name, module, config));
    });

    return mockModuleList;
  }
}

module.exports = Mocker;