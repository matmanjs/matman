const fs = require('fs');
const _ = require('lodash');
const path = require('path');

const util = require('../../util');
const mocker = require('../../mocker');

/**
 * 获取所有的 mocker 列表，包括各个mocker的mock module信息
 */
function getMockerList(mockerFullPath) {
  // 1. 获取所有的 mocker name
  let mockerNameArr = [];

  util.file.getAll(mockerFullPath, { globs: ['*'] }).forEach((item) => {
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
    mockerArr.push(getMocker(mockerFullPath, mockerName));
  });

  return mockerArr;
}

/**
 * 获取指定 mocker 的信息，包括mock module信息
 */
function getMocker(mockerFullPath, mockerName) {
  let curMockerPath = path.join(mockerFullPath, mockerName);
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

  if (!mockerConfigDBState.cgi) {
    console.error(mockerConfigFile + ' should define property of "cgi"! ');
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
  mockerDBState.activeModule = mockerDBState.activeModule || mockerDBState.defaultModule;

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
    mockModuleData.cgi = mockModuleData.cgi || mockerDBState.cgi + (mockerDBState.cgi.indexOf('?') > -1 ? '&' : '?') + '_m_target=' + mockModuleName;

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

  return _.merge({}, mockerDBState, {
    _fullPath: curMockerPath,
  });
}

/**
 * 获取某个 mock module 的结果
 * @param {Object} req Express的req对象，详见 http://expressjs.com/en/4x/api.html#req
 * @param {Object} entry 入口文件对象
 * @return {Promise}
 */
function getMockModuleResult(req, entry) {
  // 例如：/test/two/?t=1，
  // req.query.t=1
  // req.params[0]="test/two"

  // 当前请求的 url
  let url = req.params[0];

  // 获取对应的mocker路径，可能是绝对路径，也可能是相对于 entry.MOCKER_PATH 的相对路径
  // 注意 url 的值前面是没有 / 的，但用户配置 route 时可能会增加，因此需要增加之后再去获取
  let mockerPath = entry.route[url] || entry.route['/' + url];
  if (!mockerPath) {
    return Promise.reject('UNKNOWN_CGI');
  }

  let mockerFullPath = path.isAbsolute(mockerPath) ? mockerPath : path.join(entry.MOCKER_PATH, mockerPath);

  // 返回哪个数据
  let db = mocker.db.getDB(path.join(mockerFullPath, 'matman.json'));

  let mockModuleName = req.query._m_target ? req.query._m_target : mocker.db.getActiveModule(db);

  // 组装获取 mock module 的文件地址
  let mockModulePath = path.join(mockerFullPath, 'mock_modules', mockModuleName);

  return mocker.mockerModuleTool.getResult(mockModulePath);
}

/**
 * 设置 mocker 的 activeModule
 */
function setActiveModule(mockerFullPath, mockerName, activeModule) {
  let curMockerPath = path.join(mockerFullPath, mockerName);

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
  getMockModuleResult: getMockModuleResult,
  setActiveModule: setActiveModule,
};


