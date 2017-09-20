const fs = require('fs');
const _ = require('lodash');
const path = require('path');
const marked = require('marked');

const util = require('../util');
const mocker = require('../mocker');

const parserUtil = require('./parser-util');

export default class HandlerParser {
  constructor(basePath, dataPath) {
    this.basePath = basePath;

    this.dataPath = dataPath || basePath;
    this.handleModulesName = 'handle_modules';
    this.handlerConfigName = 'config.json';
    this.handleModuleConfigName = 'config.json';
    this.matmanJson = 'matman.json';
  }

  /**
   * 获取某个路径下的所有的 handler 信息
   */
  getAllHandler() {
    // 1. 获取所有的 handler name
    let handlerNameArr = [];

    util.file.getAll(this.basePath, { globs: ['*'] }).forEach((item) => {
      /**
       * 限制只处理文件夹类型的
       * 在根目录下，每个子文件夹就是一个 handler 单位，其名字即为文件夹名字
       */
      if (item.isDirectory()) {
        handlerNameArr.push(path.basename(item.relativePath));
      } else {
        // 正常情况下不允许在根目录下有非文件夹的存在，因此此处需要增加错误展示
        console.error(`${path.join(item.basePath, item.relativePath)} SHOULD BE Directory!`)
      }
    });

    // 打印一些结果
    console.log(handlerNameArr);

    // 2. 根据 handler name 获取该 handler 下的所有 handle_modules
    let handlerArr = [];

    handlerNameArr.forEach((handlerName) => {
      let handlerInfo = this.getHandlerInfo(handlerName);

      // 有可能该 handler 不合法，只有合法的 handler 才进行处理
      if (handlerInfo) {
        handlerArr.push(this.getHandlerInfo(handlerName));
      }
    });

    return handlerArr;
  }

  /**
   * 获取指定 handler 的信息，当然包括 handle_modules 信息
   * @param {String} handlerName 指定的 handler 的名字
   */
  getHandlerInfo(handlerName) {
    const CUR_HANDLER_PATH = path.join(this.basePath, handlerName);

    //===============================================================
    // 1. 获取这个 handler 模块的 config 信息
    //===============================================================
    const CUR_HANDLER_CONFIG = path.join(CUR_HANDLER_PATH, this.handlerConfigName);

    // 注意：handler 的 config.json 可能不存在，此时需要提示错误
    // 我们需要有个配置文件，用于指导如何匹配规则，因此是必须的
    if (!fs.existsSync(CUR_HANDLER_CONFIG)) {
      console.error(CUR_HANDLER_CONFIG + ' is not exist!');
      return;
    }

    let handlerConfigDB = mocker.db.getDB(CUR_HANDLER_CONFIG);

    //===============================================================
    // 2. 获取这个 handler 模块的详细cache信息
    //===============================================================
    const CUR_HANDLER_DATA_PATH = path.join(this.dataPath, handlerName);

    // 如果数据目录不存在，则要先创建，否则在 lowdb 处理保存时，就会提示该文件不存在
    // a/b/xx.json 可以不存在，但是其所在的目录 a/b/ 必须要存在
    if (!fs.existsSync(CUR_HANDLER_DATA_PATH)) {
      util.fse.ensureDirSync(CUR_HANDLER_DATA_PATH);
    }

    let handlerDB = mocker.db.getDB(path.join(CUR_HANDLER_DATA_PATH, this.matmanJson));

    //===============================================================
    // 3. 以一定的方式， 获取 handler 模块最终信息
    //===============================================================
    let handlerDBState = parserUtil.getMixinHandlerData(handlerName, handlerConfigDB.getState(), handlerDB.getState());

    if (!handlerDBState) {
      return;
    }

    //===============================================================
    // 4. 获取当前的 handler 下的 handle_modules 列表
    //===============================================================
    const CUR_HANDLE_MODULE_PATH = path.join(CUR_HANDLER_PATH, this.handleModulesName);

    let modules = [];

    util.file.getAll(CUR_HANDLE_MODULE_PATH, { globs: ['*'] }).forEach((item) => {
      if (!item.isDirectory()) {
        console.error('SHOULD BE Directory!', item);
        return;
      }

      // 获取模块名
      let curHandleModuleName = path.basename(item.relativePath);

      // config.json 的作用是用于用户自定义，拥有最高的优先级
      let CUR_HANDLE_MODULE_CONFIG = path.join(CUR_HANDLE_MODULE_PATH, curHandleModuleName, this.handleModuleConfigName);
      let curHandleModuleData = parserUtil.getMixinHandleModuleData(curHandleModuleName, mocker.db.getDB(CUR_HANDLE_MODULE_CONFIG).getState());

      modules.push(curHandleModuleData);
    });

    // handle_modules 列表
    handlerDBState.modules = modules;

    //===============================================================
    // 5. 其他默认处理
    //===============================================================

    // 如果不存在默认的 activeModule，则设置第一个 handle_module 为默认
    if (!handlerDBState.activeModule && modules.length) {
      handlerDBState.activeModule = modules[0].name;
    }

    //===============================================================
    // 6. 保存并更新 this.matmanJson
    //===============================================================
    handlerDB.setState(handlerDBState).write();

    //===============================================================
    // 7. 合并返回
    //===============================================================

    return _.merge({}, handlerDBState, {
      _fullPath: CUR_HANDLER_PATH,
    });
  }
}