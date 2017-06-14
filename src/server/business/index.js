const path = require('path');
const util = require('../../util');
const mocker = require('../../mocker');

const ROOT_PROJECT = path.join(__dirname, '../../../');
const MOCK_MODULES_PATH = path.join(ROOT_PROJECT, './tmp/demo/src/mock_modules');

function getAllMockFiles() {
  let allMockFiles = [];

  util.getAll(MOCK_MODULES_PATH, { globs: ['*/mock/*.js'] }).forEach((entry) => {
    // console.log(entry.relativePath, path.parse(entry.relativePath));
    allMockFiles.push(entry.relativePath)
  });

  return allMockFiles;
}

function getMockResult(req, entry) {
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
  let db = require(path.join(mockerFullPath, 'db.json'));
  let mockModuleName = db.returnId;

  // 组装获取 mock module 的文件地址
  let mockModulePath = path.join(mockerFullPath, 'mock_modules', mockModuleName);

  return mocker.mockerModuleTool.getResult(mockModulePath);
}

module.exports = {
  getAllMockFiles: getAllMockFiles,
  getMockResult: getMockResult,
};


