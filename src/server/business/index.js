const fs = require('fs');
const _ = require('lodash');
const path = require('path');

const util = require('../../util');
const mocker = require('../../mocker');

/**
 * 获取所有的 mocker 列表，包括各个mocker的mock module信息
 */
function getMockerList(mockerBasePath) {
  // 1. 获取所有的 mocker name
  let mockerNameArr = [];

  util.file.getAll(mockerBasePath, { globs: ['*'] }).forEach((item) => {
    // 限制只处理文件夹类型的
    if (item.isDirectory()) {
      mockerNameArr.push(path.basename(item.relativePath));
    } else {
      console.error(`${path.join(item.basePath, item.relativePath)} SHOULD BE Directory!`)
    }
  });

  console.log(mockerNameArr);

  // 2. 根据 mocker name 获取该 mocker 下的所有 mock modules
  let mockerArr = [];

  mockerNameArr.forEach((mockerName) => {
    mockerArr.push(getMocker(mockerBasePath, mockerName));
  });

  return mockerArr;
}

/**
 * 根据 route 请求，获取某个 mock module 的结果
 *
 * @param {String} mockerBasePath
 * @param {String} route 当前请求的 route
 * @param {Object} params req.query值
 * @return {Promise}
 */
function getMockModule(mockerBasePath, route, params, req) {
  let jsonFileArr = util.file.getAll(mockerBasePath, { globs: ['*/matman.json'] });

  // 循环查找
  for (let i = 0, length = jsonFileArr.length; i < length; i++) {
    let item = jsonFileArr[i];

    // 获取每个 mocker 中的 matman.json 文件内容，以便寻找到相同 route 的那个 mocker
    let db = mocker.db.getDB(path.join(item.basePath, item.relativePath));
    let dbState = db.getState();
    // console.log(dbState);

    if (route === dbState.route) {
      // 有可能是指定的 mock module， 也可能是当前的 mock module
      let mockModuleName = params._m_target ? params._m_target : dbState.activeModule;

      // 组装获取 mock module 的文件地址
      let mockModulePath = path.join(mockerBasePath, dbState.name, 'mock_modules', mockModuleName);

      // 还有部分参数在 mock module 的 query 字段中
      for (let j = 0, lengthj = dbState.modules.length; j < lengthj; j++) {
        let mockModuleItem = dbState.modules[j];
        if (mockModuleName === mockModuleItem.name) {
          params = _.merge({}, mockModuleItem.query, params);
        }
      }

      return mocker.mockerModuleTool.getResult(mockModulePath, params, req)
        .then((data) => {
          return {
            data: data,
            mockerDBState: dbState,
            mockModuleName: mockModuleName,
            params: params,
          }
        });
    }
  }

  return Promise.reject('UNKNOWN_CGI');
}

/**
 * 获取指定 mocker 的信息，包括mock module信息
 */
function getMocker(mockerBasePath, mockerName) {
  let curMockerPath = path.join(mockerBasePath, mockerName);
  let curMockModulesPath = path.join(curMockerPath, 'mock_modules');
  let mockerConfigFile = path.join(curMockerPath, 'config.json');

  // mocker 的 config.json 可能不存在
  if (!fs.existsSync(mockerConfigFile)) {
    console.error(mockerConfigFile + ' is not exist!');
    return;
  }

  // 获取这个 mocker 模块的 config 信息
  let mockerConfigDB = mocker.db.getDB(mockerConfigFile);
  let mockerConfigDBState = mockerConfigDB.getState();

  // 至少得有 route 字段，否则报错
  if (!mockerConfigDBState.route) {
    console.error(mockerConfigFile + ' should define property of "route"! ');
    return;
  }

  // matman.json 可能不存在，此时新增
  let mockerDBFile = path.join(curMockerPath, 'matman.json');

  // 获取这个 mocker 模块的详细信息
  let mockerDB = mocker.db.getDB(mockerDBFile);

  let mockerDBState;

  if (!fs.existsSync(mockerDBFile)) {
    mockerDBState = _.merge({}, mockerConfigDBState);
  } else {
    mockerDBState = _.merge({}, mockerDB.getState(), mockerConfigDBState);
  }

  mockerDBState.name = mockerDBState.name || mockerName;
  mockerDBState.description = mockerDBState.description || mockerDBState.name;
  mockerDBState.activeModule = mockerDBState.activeModule || mockerDBState.defaultModule;
  mockerDBState.method = mockerDBState.method || 'get';

  // 获取当前的 mocker 下的 modules 列表
  let modules = [];
  util.file.getAll(curMockModulesPath, { globs: ['*'] }).forEach((item) => {
    if (!item.isDirectory()) {
      console.error('SHOULD BE Directory!', item);
      return;
    }

    // 获取模块名
    let mockModuleName = path.basename(item.relativePath);

    // config.json 的作用是用于用户自定义，拥有最高的优先级
    let mockModuleDBFile = path.join(curMockModulesPath, mockModuleName, 'config.json');
    let mockModuleData;

    if (!fs.existsSync(mockModuleDBFile)) {
      // config.json不存在，则设置默认值
      mockModuleData = {};
    } else {
      // config.json不存在，则获取这个模块的详细信息
      let mockModuleDB = mocker.db.getDB(mockModuleDBFile);

      mockModuleData = mockModuleDB.getState();
    }

    mockModuleData.name = mockModuleData.name || mockModuleName;
    mockModuleData.description = mockModuleData.description || mockModuleName;

    // TODO 如果是 /id/:id 类型的，则此处可能会有问题，或许还需要把请求值放入到query中
    mockModuleData.query = _.merge({}, mockModuleData.query, { _m_target: mockModuleName });

    modules.push(mockModuleData);
  });

  // 如果不存在默认的activeModule，则设置第一个mock module为默认
  if (!mockerDBState.activeModule && modules.length) {
    mockerDBState.activeModule = modules[0].name;
  }

  // mock module
  mockerDBState.modules = modules;

  // 更新到 matman.json
  mockerDB.setState(mockerDBState);

  // 如果是 id/:id 的形式，则params也需要有

  return _.merge({}, mockerDBState, {
    _fullPath: curMockerPath,
  });
}

/**
 * 设置 mocker 的 activeModule
 */
function setActiveModule(mockerBasePath, mockerName, activeModule) {
  let curMockerPath = path.join(mockerBasePath, mockerName);

  // 获取这个 mocker 模块的详细信息
  let mockerDB = mocker.db.getDB(path.join(curMockerPath, 'matman.json'));

  // 更新 mocker db 数据
  let mockerDBState = mockerDB.getState();
  mockerDBState.activeModule = activeModule;
  mockerDB.setState(mockerDBState);

  return mockerDBState;
}

module.exports = {
  getMockerList: getMockerList,
  getMocker: getMocker,
  getMockModule: getMockModule,
  setActiveModule: setActiveModule,
};


