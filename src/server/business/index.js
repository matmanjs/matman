const _ = require('lodash');
const path = require('path');

const util = require('../../util');
const mocker = require('../../mocker');

/**
 * 获得所有的 mock module 文件
 * @param {Object} entry 入口文件对象
 * @return {Array} mock module 的文件列表
 */
function getAllMockModules(entry) {
  let allMockFiles = [];

  util.file.getAll(entry.MOCKER_PATH, { globs: ['*/mock_modules/*.js'] }).forEach((item) => {
    // console.log(item.relativePath, path.parse(item.relativePath));
    allMockFiles.push(item.relativePath);
  });

  return allMockFiles;
}

/**
 * 获取所有的 mocker 列表
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
    let curMockerPath = path.join(mockerFullPath, mockerName);
    let curMockModulesPath = path.join(curMockerPath, 'mock_modules');

    // 获取这个 mocker 模块的详细信息
    let mockerDB = mocker.db.getDB(path.join(curMockerPath, 'db.json'));

    // 更新 mocker db 数据
    let mockerDBState = mockerDB.getState();
    mockerDBState.name = mockerName;
    mockerDB.setState(mockerDBState);

    // 获取当前的 mocker 下的 modules 列表
    let modules = [];
    util.file.getAll(curMockModulesPath, { globs: ['*'] }).forEach((item) => {
      if (!item.isDirectory()) {
        console.error('SHOULD BE Directory!');
        return;
      }

      // 获取模块名
      let mockModuleName = path.basename(item.relativePath);

      // 获取这个模块的详细信息
      let mockModuleDB = mocker.db.getDB(path.join(curMockModulesPath, mockModuleName, 'db.json'));

      // 更新 mock module db 数据
      let mockModuleDBState = mockModuleDB.getState();
      mockModuleDBState.name = mockModuleName;
      mockModuleDBState.cgi = mockerDBState.cgi + (mockerDBState.cgi.indexOf('?') > -1 ? '&' : '?') + '_m_target=' + mockModuleName;
      mockModuleDB.setState(mockModuleDBState);

      modules.push(mockModuleDBState);
    });

    mockerArr.push(_.merge({}, mockerDBState, {
      fullPath: curMockerPath,
      modules: modules,
    }));
  });

  return mockerArr;
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
    return Promise.reject('unknown cgi');
  }

  let mockerFullPath = path.isAbsolute(mockerPath) ? mockerPath : path.join(entry.MOCKER_PATH, mockerPath);

  // 返回哪个数据
  let db = mocker.db.getDB(path.join(mockerFullPath, 'db.json'));

  let mockModuleName = req.query._m_target ? req.query._m_target : mocker.db.getActiveModule(db);

  // 组装获取 mock module 的文件地址
  let mockModulePath = path.join(mockerFullPath, 'mock_modules', mockModuleName);

  return mocker.mockerModuleTool.getResult(mockModulePath);
}

module.exports = {
  getAllMockModules: getAllMockModules,
  getMockerList: getMockerList,
  getMockModuleResult: getMockModuleResult,
};


