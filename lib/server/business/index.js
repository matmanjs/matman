'use strict';

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var fs = require('fs');
var _ = require('lodash');
var path = require('path');
var marked = require('marked');

var util = require('../../util');
var mocker = require('../../mocker');

/**
 * 获取所有的 mocker 列表，包括各个mocker的mock module信息
 */
function getMockerList(mockerBasePath) {
  // 1. 获取所有的 mocker name
  var mockerNameArr = [];

  util.file.getAll(mockerBasePath, { globs: ['*'] }).forEach(function (item) {
    // 限制只处理文件夹类型的
    if (item.isDirectory()) {
      mockerNameArr.push(path.basename(item.relativePath));
    } else {
      console.error(path.join(item.basePath, item.relativePath) + ' SHOULD BE Directory!');
    }
  });

  console.log(mockerNameArr);

  // 2. 根据 mocker name 获取该 mocker 下的所有 mock modules
  var mockerArr = [];

  mockerNameArr.forEach(function (mockerName) {
    mockerArr.push(getMocker(mockerBasePath, mockerName));
  });

  return mockerArr;
}

function getCurMocker(jsonFileArr, route) {
  var params = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

  var arr = [];

  // 循环查找所有的 matman.json 文件，对比 route 字段，可能会有多个匹配
  for (var i = 0, length = jsonFileArr.length; i < length; i++) {
    var item = jsonFileArr[i];

    // 获取每个 mocker 中的 matman.json 文件内容，以便寻找到相同 route 的那个 mocker
    var db = mocker.db.getDB(path.join(item.basePath, item.relativePath));
    var dbState = db.getState();
    // console.log(dbState);

    // 不仅校验 dbState.route ，还需要校验 dbState.routeExtra
    if (route === dbState.route) {
      arr.push(dbState);
    }
  }

  // 如果只有一个匹配，则一定是它
  if (arr.length < 2) {
    return arr[0];
  }

  var paramsKeyLength = (0, _keys2.default)(params).length;

  var pureOne = void 0;

  // 有多个匹配时，要比对 routeExtra 值
  for (var j = 0, lengthj = arr.length; j < lengthj; j++) {
    var curMockerData = arr[j],
        routeExtra = curMockerData.routeExtra || {},
        routeExtraKeys = (0, _keys2.default)(routeExtra),
        routeExtraKeyLength = routeExtraKeys.length;

    if (!routeExtraKeyLength) {
      // 如果没有配置限定

      if (!paramsKeyLength) {
        // 如果请求参数也为空，则就是它了
        return curMockerData;
      }

      // 如果请求参数不为空，这个很难判断，但如果没有其他精准匹配结果，则返回它
      pureOne = curMockerData;
    } else {
      // 如果配置了限定

      if (!paramsKeyLength) {
        // 如果请求参数也为空，则肯定不是它
        continue;
      }

      var isFound = true;

      // 如果请求参数不为空，则对比参数值
      for (var k = 0; k < routeExtraKeyLength; k++) {
        var field = routeExtraKeys[k];

        // 这里都转化为字符串来比较，一旦不相等，则不再判断了
        if (routeExtra[field] + '' !== params[field] + '') {
          isFound = false;
          break;
        }
      }

      if (isFound) {
        return curMockerData;
      }
    }
  }

  return pureOne;
}

/**
 * 根据 route 请求，获取某个 mock module 的结果
 *
 * @param {String} mockerBasePath
 * @param {String} route 当前请求的 route
 * @param {Object} params 请求参数值
 * @param {Object} req req
 * @return {Promise}
 */
function getMockModule(mockerBasePath, route, params, req) {
  var jsonFileArr = util.file.getAll(mockerBasePath, { globs: ['*/matman.json'] });

  // 匹配 mocker
  var mockerData = getCurMocker(jsonFileArr, route, params);

  if (!mockerData) {
    return _promise2.default.reject('UNKNOWN_CGI');
  }

  // 有可能是指定的 mock module， 也可能是当前的 mock module
  var mockModuleName = params._m_target ? params._m_target : mockerData.activeModule;

  // 组装获取 mock module 的文件地址
  var mockModulePath = path.join(mockerBasePath, mockerData.name, 'mock_modules', mockModuleName);

  // 还有部分参数在 mock module 的 query 字段中
  for (var j = 0, lengthj = mockerData.modules.length; j < lengthj; j++) {
    var mockModuleItem = mockerData.modules[j];
    if (mockModuleName === mockModuleItem.name) {
      params = _.merge({}, mockModuleItem.query, params);
    }
  }

  return mocker.mockerModuleTool.getResult(mockModulePath, params, req).then(function (data) {
    return {
      data: data,
      mockerDBState: mockerData,
      mockModuleName: mockModuleName,
      params: params
    };
  });
}

/**
 * 获取指定 mocker 的信息，包括mock module信息
 */
function getMocker(mockerBasePath, mockerName) {
  var curMockerPath = path.join(mockerBasePath, mockerName);
  var curMockModulesPath = path.join(curMockerPath, 'mock_modules');
  var mockerConfigFile = path.join(curMockerPath, 'config.json');

  // mocker 的 config.json 可能不存在
  if (!fs.existsSync(mockerConfigFile)) {
    console.error(mockerConfigFile + ' is not exist!');
    return;
  }

  // 获取这个 mocker 模块的 config 信息
  var mockerConfigDB = mocker.db.getDB(mockerConfigFile);
  var mockerConfigDBState = mockerConfigDB.getState();

  // 至少得有 route 字段，否则报错
  if (!mockerConfigDBState.route) {
    console.error(mockerConfigFile + ' should define property of "route"! ');
    return;
  }

  // matman.json 可能不存在，此时新增
  var mockerDBFile = path.join(curMockerPath, 'matman.json');

  // 获取这个 mocker 模块的详细信息
  var mockerDB = mocker.db.getDB(mockerDBFile);

  var mockerDBState = void 0;

  if (!fs.existsSync(mockerDBFile)) {
    mockerDBState = _.merge({}, mockerConfigDBState);
  } else {
    mockerDBState = _.merge({}, mockerDB.getState(), mockerConfigDBState);
  }

  mockerDBState.name = mockerDBState.name || mockerName;
  mockerDBState.disable = mockerDBState.disable || false;
  mockerDBState.description = mockerDBState.description || mockerDBState.name;
  mockerDBState.activeModule = mockerDBState.activeModule || mockerDBState.defaultModule;
  mockerDBState.method = mockerDBState.method || 'get';
  mockerDBState.priority = mockerDBState.priority || 0;
  mockerDBState.tags = _.union(['全部'], mockerDBState.tags || []);

  // 获取当前的 mocker 下的 modules 列表
  var modules = [];
  util.file.getAll(curMockModulesPath, { globs: ['*'] }).forEach(function (item) {
    if (!item.isDirectory()) {
      console.error('SHOULD BE Directory!', item);
      return;
    }

    // 获取模块名
    var mockModuleName = path.basename(item.relativePath);

    // config.json 的作用是用于用户自定义，拥有最高的优先级
    var mockModuleDBFile = path.join(curMockModulesPath, mockModuleName, 'config.json');
    var mockModuleData = void 0;

    if (!fs.existsSync(mockModuleDBFile)) {
      // config.json不存在，则设置默认值
      mockModuleData = {};
    } else {
      // config.json不存在，则获取这个模块的详细信息
      var mockModuleDB = mocker.db.getDB(mockModuleDBFile);

      mockModuleData = mockModuleDB.getState();
    }

    mockModuleData.name = mockModuleData.name || mockModuleName;
    mockModuleData.description = mockModuleData.description || mockModuleName;

    // TODO 如果是 /id/:id 类型的，则此处可能会有问题，或许还需要把请求值放入到query中
    mockModuleData.query = _.merge({}, mockModuleData.query, { _m_target: mockModuleName });

    mockModuleData.priority = mockModuleData.priority || 0;

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
    _fullPath: curMockerPath
  });
}

/**
 * 获取指定 mocker 的 README 信息
 */
function getMockerReadme(mockerBasePath, mockerName) {
  var curMockerPath = path.join(mockerBasePath, mockerName);

  var mockerReadmeFile = path.join(curMockerPath, 'readme.md');
  if (!fs.existsSync(mockerReadmeFile)) {
    mockerReadmeFile = path.join(curMockerPath, 'readme.MD');
    if (!fs.existsSync(mockerReadmeFile)) {
      mockerReadmeFile = path.join(curMockerPath, 'README.md');
      if (!fs.existsSync(mockerReadmeFile)) {
        mockerReadmeFile = path.join(curMockerPath, 'README.MD');
        if (!fs.existsSync(mockerReadmeFile)) {
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
    return marked(fs.readFileSync(mockerReadmeFile, 'utf8'));
  } catch (e) {
    return e.stack;
  }
}

/**
 * 更新 mocker 的 信息
 * @param mockerBasePath
 * @param mockerName
 * @param newState
 */
function updateMocker(mockerBasePath, mockerName, newState) {
  var curMockerPath = path.join(mockerBasePath, mockerName);

  // 获取这个 mocker 模块的详细信息
  var mockerDB = mocker.db.getDB(path.join(curMockerPath, 'matman.json'));

  // 更新 mocker db 数据
  var mockerDBState = mockerDB.getState();
  mockerDBState = _.merge({}, mockerDBState, newState);
  mockerDB.setState(mockerDBState);

  return mockerDBState;
}

module.exports = {
  getMockerList: getMockerList,
  getMocker: getMocker,
  getMockerReadme: getMockerReadme,
  updateMocker: updateMocker,
  getMockModule: getMockModule
};
//# sourceMappingURL=index.js.map