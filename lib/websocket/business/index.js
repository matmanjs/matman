'use strict';

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var fs = require('fs');
var _ = require('lodash');
var path = require('path');
var marked = require('marked');

var dealTarget = require('../../util/deal-target');
var moduleTool = require('../../util/module-tool');

/**
 * 获取所有的 stub 列表
 * @param {String} stubBasePath 目标的基础路径
 */
function getStubList(stubBasePath) {
  // 1. 获取所有的 target name
  var targetNameArr = dealTarget.getTargetNameList(stubBasePath);

  // 2. 根据 target name 获取该 target 下的所有  result modules
  var targetArr = [];

  targetNameArr.forEach(function (targetName) {
    targetArr.push(getStub(stubBasePath, targetName));
  });

  return targetArr;
}

/**
 * 根据比对值，找出对应的 stub
 * @param jsonFileArr
 * @param checkVal
 * @return {*}
 */
function getStubByMatch(jsonFileArr, checkVal) {
  var arr = dealTarget.getTargetListByMatch(jsonFileArr, function (dbState) {
    return checkVal === dbState.target;
  });

  return arr[0];
}

/**
 * 根据 route 请求，获取某个 mock module 的结果
 *
 * @param {String} stubBasePath
 * @param {String} target 当前要处理的目标
 * @param {Object} params 请求参数值
 * @param {Object} req req
 * @return {Promise}
 */
function getStubModule(stubBasePath, checkVal) {
  var jsonFileArr = dealTarget.getAllMatmanFiles(stubBasePath);

  // 匹配 stub
  var stubData = getStubByMatch(jsonFileArr, checkVal);

  if (!stubData) {
    return _promise2.default.reject('UNKNOWN_STUB');
  }

  // 当前激活的 stub module
  var stubModuleName = stubData.activeModule;

  // 组装获取 stub module 的文件地址
  var stubModulePath = path.join(stubBasePath, stubData.name, 'result_modules', stubModuleName);

  return moduleTool.getResult(stubModulePath).then(function (data) {
    return {
      data: data,
      stubDBState: stubData,
      stubModuleName: stubModuleName
    };
  });
}

/**
 * 获取指定 mocker 的信息，包括mock module信息
 */
function getStub(stubBasePath, stubName) {
  var curStubPath = path.join(stubBasePath, stubName);

  // 1. 获取 stub 下的 config.js 文件内容
  var mockerConfigDBState = dealTarget.getTargetConfigDBState(curStubPath);

  // 至少得有 target 字段，否则报错
  if (!mockerConfigDBState || !mockerConfigDBState.target) {
    console.error(stubName + ' should define property of "target"! ');
    return;
  }

  // 2. 获取这个 stub 模块的 db 对象
  var stubDB = dealTarget.getTargetDB(curStubPath);

  // 3. 获取 stub 的db信息
  var stubDBState = dealTarget.getTargetDBState(stubName, stubDB, mockerConfigDBState);

  // 4. 获取当前的 stub 下的 modules 列表
  var modules = dealTarget.getTargetModules(curStubPath, function (targetModuleData) {
    return targetModuleData;
  });

  // mock module
  stubDBState.modules = modules;

  // 5. 其他处理
  // 如果不存在默认的activeModule，则设置第一个mock module为默认
  if (!stubDBState.activeModule && modules.length) {
    stubDBState.activeModule = modules[0].name;
  }

  // 6. 更新到 matman.json
  stubDB.setState(stubDBState);

  return _.merge({}, stubDBState, {
    _fullPath: curStubPath
  });
}

/**
 * 获取指定 mocker 的 README 信息
 */
function getStubReadme(stubBasePath, stubName) {
  return dealTarget.getTargetReadme(stubBasePath, stubName);
}

/**
 * 更新 stub 的 信息
 * @param stubBasePath
 * @param stubName
 * @param newState
 */
function updateStub(stubBasePath, stubName, newState) {
  return dealTarget.updateTarget(stubBasePath, stubName, newState);
}

module.exports = {
  getStubList: getStubList,
  getStub: getStub,
  getStubByMatch: getStubByMatch,
  getStubReadme: getStubReadme,
  updateStub: updateStub,
  getStubModule: getStubModule
};
//# sourceMappingURL=index.js.map