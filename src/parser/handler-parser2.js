const fs = require('fs');
const fse = require('fs-extra');
const _ = require('lodash');
const path = require('path');
const marked = require('marked');
const fsHandler = require('fs-handler');

const util = require('../util');
const store = require('../store');

const parserUtil = require('./parser-util');

export default class HandlerParser {
  constructor(entry) {
    this.basePath = path.join(entry.APP_PATH, entry.HANDLER_RELATIVE_PATH);
    this.appPath = path.join(entry.APP_PATH, entry.HANDLER_RELATIVE_PATH);
    this.srcPath = path.join(entry.SRC_PATH, entry.HANDLER_RELATIVE_PATH);

    // this.dataPath = entry.DATA_PATH || this.basePath;
    this.handleModulesFolderName = 'handle_modules';
    this.handlerConfigName = 'config.json';
    this.handleModuleConfigName = 'config.json';
    this.targetField = '_m_target';

    // 注意此处一定要保证存储数据的地址是可存在的，否则会保存失败。
    // fse.ensureDirSync(this.dataPath);

    this.db = store.getDB(path.join(this.appPath, 'db.json'));
  }

  /**
   * 分析并保存数据到本地
   */
  parseAndSave() {
    // 获取本地所有的 handler 列表。注意此处不能够取自缓存，要重新去分析。
    let allHandler = this.getAllHandler(true);

    // 存储到本地缓存数据文件内，以便下次启动时能够记录上一次的操作
    this.db.setState({
      basePath: this.basePath,
      srcPath: this.srcPath,
      appPath: this.appPath,
      data: allHandler
    }).write();

    // 将结果返回
    return allHandler;
  }

  /**
   * 获取所有的 handler 信息
   *
   * @param {boolean} [isReset] 是否为重置，如果为true，则将忽略缓存数据
   * @return {Array}
   */
  getAllHandler(isReset) {
    // 默认情况下，handler列表的数据从缓存中获取，除非指定了 isReset=true。
    if (!isReset) {
      return this.db.get('data').value() || [];
    }

    // 1. 获取所有的 handler name
    let handlerNameArr = [];

    fsHandler.search.getAll(this.basePath, { globs: ['*'] }).forEach((item) => {
      /**
       * 限制只处理文件夹类型的
       * 在根目录下，每个子文件夹就是一个 handler 单位，其名字即为文件夹名字
       */
      if (item.isDirectory()) {
        handlerNameArr.push(path.basename(item.relativePath));
      } else {
        // 正常情况下不允许在根目录下有非文件夹的存在，因此此处需要增加错误展示
        console.error(`${path.join(item.basePath, item.relativePath)} SHOULD BE Directory!`);
      }
    });

    // 打印一些结果
    // console.log(handlerNameArr);

    // 2. 根据 handler name 获取该 handler 下的所有 handle_modules
    let handlerArr = [];

    handlerNameArr.forEach((handlerName) => {
      let handlerInfo = this.getHandler(handlerName, true);

      // 有可能该 handler 不合法，只有合法的 handler 才进行处理
      if (handlerInfo) {
        handlerArr.push(handlerInfo);
      }
    });

    return handlerArr;
  }

  /**
   * 通过名字获取 handler 的信息，当然包括 handle_modules 信息
   *
   * @param {String} handlerName 指定的 handler 的名字
   * @param {Boolean} [isReset] 是否为重置，如果为true，则将忽略缓存数据
   * @return {Object}
   */
  getHandler(handlerName, isReset) {
    //===============================================================
    // 1. 从缓存数据库中获取 handler 数据
    //===============================================================
    let cacheData = this.db.get('data').find({ name: handlerName }).value();

    // 如果是优先缓存，则直接返回。
    if (!isReset) {
      return cacheData;
    }

    //===============================================================
    // 2. 获取这个 handler 模块的 config 信息
    //===============================================================

    // 如果不需要缓存，则从文件系统中获取并处理
    const CUR_HANDLER_PATH = path.join(this.basePath, handlerName);

    const CUR_HANDLER_CONFIG = path.join(CUR_HANDLER_PATH, this.handlerConfigName);

    // 注意：handler 的 config.json 可能不存在，此时需要提示错误
    // 我们需要有个配置文件，用于指导如何匹配规则，因此是必须的
    if (!fs.existsSync(CUR_HANDLER_CONFIG)) {
      console.error(CUR_HANDLER_CONFIG + ' is not exist!');
      return null;
    }

    let handlerConfigData = store.getDB(CUR_HANDLER_CONFIG).getState();

    //===============================================================
    // 3. 以一定的方式， 获取 handler 模块最终信息
    //===============================================================
    let handlerData = parserUtil.getMixinHandlerData(handlerName, handlerConfigData, cacheData);

    // TODO 如果匹配规则一模一样，需要进行警告提示！！！！！
    if (!handlerData) {
      return null;
    }

    //===============================================================
    // 4. 获取当前的 handler 下的 handle_modules 列表，或者 index.js/index.json
    //===============================================================
    const CUR_HANDLE_MODULE_PATH = path.join(CUR_HANDLER_PATH, this.handleModulesFolderName);

    let modules = [];
    if (!fs.existsSync(CUR_HANDLE_MODULE_PATH)) {
      // 如果没有 handle_modules 文件夹，则使用 index.js 或者 index.json，且将其设置为默认
      let indexModule = {
        name: 'index_module',
        description: 'default module',
        priority: 0,
        type: 'noModule'
      };

      indexModule.query = { _m_target: indexModule.name };

      if (fs.existsSync(path.join(CUR_HANDLER_PATH, 'index.js'))) {
        indexModule.fileName = 'index.js';
      } else if (fs.existsSync(path.join(CUR_HANDLER_PATH, 'index.json'))) {
        indexModule.fileName = 'index.json';
      } else {
        return null;
      }

      modules.push(indexModule);

    } else {
      fsHandler.search.getAll(CUR_HANDLE_MODULE_PATH, { globs: ['*'] }).forEach((item) => {
        // 获取各个 handle_module 中 config.json 的数据
        let handleModuleConfigDBState = {};
        let curHandleModuleName = '';

        if (item.isDirectory()) {
          // 获取模块名
          curHandleModuleName = path.basename(item.relativePath);

          // 如果 handle_module 是一个目录，则需要去检查其是否存在 config.json 文件，优先使用它
          // config.json 的作用是用于用户自定义，拥有最高的优先级
          let CUR_HANDLE_MODULE_CONFIG = path.join(CUR_HANDLE_MODULE_PATH, curHandleModuleName, this.handleModuleConfigName);

          if (fs.existsSync(CUR_HANDLE_MODULE_CONFIG)) {
            handleModuleConfigDBState = store.getDB(CUR_HANDLE_MODULE_CONFIG).getState();
          }
        } else {
          // 获取模块名
          curHandleModuleName = path.basename(item.relativePath, path.extname(item.relativePath));
        }

        // 获取最后处理之后的数据
        let curHandleModuleData = parserUtil.getMixinHandleModuleData(curHandleModuleName, handleModuleConfigDBState);

        modules.push(curHandleModuleData);
      });
    }

    // handle_modules 列表
    handlerData.modules = modules;

    //===============================================================
    // 5. 其他默认处理
    //===============================================================

    // 如果不存在默认的 activeModule，或者存在默认的 activeModule，但是它是一个非法值，则设置第一个 handle_module 为默认
    if ((!handlerData.activeModule || (modules.map(item => item.name).indexOf(handlerData.activeModule) < 0)) && modules.length) {
      handlerData.activeModule = modules[0].name;
    }

    //===============================================================
    // 6. 合并返回
    //===============================================================

    return handlerData;
  }

  /**
   * 通过路由及请求参数获取 handler 的信息
   *
   * @param {String} route 路由规则
   * @param {Object} [params] 请求的参数
   * @return {Object}
   */
  getHandlerByRoute(route, params = {}) {
    return parserUtil.getMatchedHandler(this.getAllHandler(), route, params);
  }

  /**
   * 获取某个 plugin 所有的 handler 信息
   *
   * @param {String} [pluginName] 插件名字
   * @return {Array}
   */
  getHandlerListByPlugin(pluginName = 'mocker') {
    return this.db.get('data').filter({ plugin: pluginName }).value() || [];
  }

  /**
   * 通过名字获取 handle_module 的信息
   *
   * @param {String} handlerName 指定的 handler 的名字
   * @param {String} handleModuleName 指定的 handle_module 的名字
   * @param {Boolean} [isReset] 是否为重置，如果为true，则将忽略缓存数据
   * @return {Object}
   */
  getHandleModule(handlerName, handleModuleName, isReset) {
    let handlerInfo = this.getHandler(handlerName, isReset);

    return this._getHandleModuleByHandler(handlerInfo, handleModuleName);
  }

  /**
   * 根据路由和请求参数，获得目标的执行结果，专为 http 请求
   * @param {String} route 路由规则
   * @param {Object} [params] 请求的参数
   * @param {Object} [req] 请求对象
   * @return {Promise}
   */
  getHandleModuleResultForHttp(route, params = {}, req) {
    let reqInfoByRoute = this.getReqInfoByRoute(route, params);

    if (!reqInfoByRoute) {
      return Promise.reject('Could not get reqInfo by route=' + route + ' and params=' + JSON.stringify(params));
    }

    return fsHandler.handle.getModuleResult(reqInfoByRoute.fullPath, reqInfoByRoute.params, req)
      .then((data) => {
        return {
          data: data,
          extra: reqInfoByRoute
        };
      });
  }

  /**
   * 根据路由，获得目标的执行结果
   * @param {String} route 路由规则
   * @param {Object} [params] 请求的参数
   * @param props
   * @return {Promise}
   */
  getHandleModuleResult(route, params, ...props) {
    let reqInfoByRoute = this.getReqInfoByRoute(route, params);

    if (!reqInfoByRoute) {
      return Promise.reject();
    }

    return fsHandler.handle.getModuleResult(reqInfoByRoute.fullPath, params, ...props);
  }

  /**
   * 通过路由匹配获取到本地模块路径和完整的请求信息
   *
   * @param {String} route 路由规则
   * @param {Object} [params] 请求的参数
   * @return {Object}
   */
  getReqInfoByRoute(route, params = {}) {
    // 获得当前的 handler 信息
    let handlerInfo = this.getHandlerByRoute(route, params);

    if (!handlerInfo) {
      return null;
    }

    // 优先获取 param 中请求的指定 handle_module，其次是 handerInfo.activeModule
    let handleModuleName = params[this.targetField] || handlerInfo.activeModule;

    let handleModuleInfo = this._getHandleModuleByHandler(handlerInfo, handleModuleName);

    if (!handleModuleInfo) {
      return null;
    }

    // 目标模块的路径，需要注意下 no module 的场景

    let moduleRelativePath = (handleModuleInfo.type && handleModuleInfo.type === 'noModule') ? handleModuleInfo.fileName : path.join(this.handleModulesFolderName, handleModuleName);

    let moduleFullPath = path.join(this.basePath, handlerInfo.name, moduleRelativePath);

    // 还有部分参数在 handle_module 的 query 字段中，需要合并请求
    let reqParams = _.merge({}, handleModuleInfo.query, params);

    return {
      handlerInfo: handlerInfo,
      handleModuleInfo: handleModuleInfo,
      fullPath: moduleFullPath,
      params: reqParams
    };
  }

  /**
   * 更新 handler 的 信息
   *
   * @param {String} handlerName handler 名字
   * @param {Object} [updateData] 要更新的数据
   */
  updateHandler(handlerName, updateData) {
    // 更新数据
    this.db.get('data')
      .find({ name: handlerName })
      .assign(updateData)
      .write();

    // 返回新的结果
    return this.getHandler(handlerName);
  }

  /**
   * 获取指定 handler 的 README 信息
   */
  getReadMeContent(handlerName) {
    let curMockerPath = path.join(this.basePath, handlerName);

    let handlerReadMeFile = path.join(curMockerPath, 'readme.md');
    if (!fs.existsSync(handlerReadMeFile)) {
      handlerReadMeFile = path.join(curMockerPath, 'readme.MD');
      if (!fs.existsSync(handlerReadMeFile)) {
        handlerReadMeFile = path.join(curMockerPath, 'README.md');
        if (!fs.existsSync(handlerReadMeFile)) {
          handlerReadMeFile = path.join(curMockerPath, 'README.MD');
          if (!fs.existsSync(handlerReadMeFile)) {
            return '';
          }
        }
      }
    }

    marked.setOptions({
      renderer: new marked.Renderer(),
      gfm: true,
      tables: true,
      breaks: false,
      pedantic: false,
      sanitize: false,
      smartLists: true,
      smartypants: false
    });

    try {
      let content = fs.readFileSync(handlerReadMeFile, 'utf8');

      content = content.replace(/__HANDLER_PATH__/g, handlerName);

      return marked(content);
    } catch (e) {
      return e.stack;
    }
  }

  /**
   * 从 handlerInfo 对象中获得指定的 handle_module 信息
   *
   * @param {Object} handlerInfo
   * @param {String} handleModuleName
   * @return {Object}
   * @private
   */
  _getHandleModuleByHandler(handlerInfo, handleModuleName) {
    if (!handlerInfo || !handlerInfo.modules || !handlerInfo.modules.length || !handleModuleName) {
      return null;
    }

    let handleModuleInfo = null;

    for (let i = 0, length = handlerInfo.modules.length; i < length; i++) {
      let mockModuleItem = handlerInfo.modules[i];

      if (handleModuleName === mockModuleItem.name) {
        handleModuleInfo = mockModuleItem;
        break;
      }
    }

    return handleModuleInfo;
  }
}