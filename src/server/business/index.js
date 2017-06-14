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

  util.file.getAll(entry.MOCKER_PATH, { globs: ['*/mock_modules/*.js'] }).forEach((entry) => {
    // console.log(entry.relativePath, path.parse(entry.relativePath));
    allMockFiles.push(entry.relativePath);
  });

  return allMockFiles;
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

  let mockModuleName = mocker.db.getReturnId(db);

  // 组装获取 mock module 的文件地址
  let mockModulePath = path.join(mockerFullPath, 'mock_modules', mockModuleName);

  return mocker.mockerModuleTool.getResult(mockModulePath);
}

module.exports = {
  getAllMockModules: getAllMockModules,
  getMockModuleResult: getMockModuleResult,
};


