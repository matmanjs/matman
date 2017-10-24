'use strict';

var fs = require('fs');
var _ = require('lodash');
var path = require('path');
var marked = require('marked');

var file = require('./file');
var db = require('./db');

/**
 * 获取所有的 target 模块名字列表
 * @param {String} targetBasePath 目标的基础路径
 */
function getTargetNameList(targetBasePath) {
  var targetNameArr = [];

  file.getAll(targetBasePath, { globs: ['*'] }).forEach(function (item) {
    // 限制只处理文件夹类型的
    if (item.isDirectory()) {
      targetNameArr.push(path.basename(item.relativePath));
    } else {
      console.error(path.join(item.basePath, item.relativePath) + ' SHOULD BE Directory!');
    }
  });

  return targetNameArr;
}

/**
 * 获取当前的处理对象
 * @param {Array} jsonFileArr db文件的地址数组
 * @param {Function} matchCall 检查函数，接受一个参数dbState
 * @return {Array}
 */
function getTargetListByMatch(jsonFileArr, matchCall) {
  var arr = [];

  // 循环查找所有的 matman.json 文件，对比 target 字段，可能会有多个匹配
  for (var i = 0, length = jsonFileArr.length; i < length; i++) {
    var item = jsonFileArr[i];

    // 获取每个 target 中的 matman.json 文件内容，以便寻找到 target
    var targetDB = db.getDB(path.join(item.basePath, item.relativePath));
    var dbState = targetDB.getState();
    // console.log(dbState);

    // 自定义方法来校验是否是目标对象
    if (matchCall(dbState)) {
      arr.push(dbState);
    }
  }

  return arr;
}

/**
 * 获取所有的 matman.json 文件
 *
 * @param {String} targetBasePath 目标的基础路径
 * @return {Array}
 */
function getAllMatmanFiles(targetBasePath) {
  return file.getAll(targetBasePath, { globs: ['*/matman.json'] });
}

/**
 * 获取这个 target 模块的 config 信息
 *
 * @param {String} curTargetPath 当前目标路径
 */
function getTargetConfigDBState(curTargetPath) {
  var targetConfigFile = path.join(curTargetPath, 'config.json');

  // target 的 config.json 可能不存在
  if (!fs.existsSync(targetConfigFile)) {
    console.error(targetConfigFile + ' is not exist!');
    return null;
  }

  // 获取这个 target 模块的 config 信息
  return db.getDB(targetConfigFile).getState();
}

/**
 * 获取这个 target 模块的 config 信息
 *
 * @param {String} curTargetPath 当前目标路径
 */
function getTargetDB(curTargetPath) {
  var targetDBFile = path.join(curTargetPath, 'matman.json');

  return db.getDB(targetDBFile);
}

/**
 *
 * @param targetName
 * @param targetDB
 * @param targetConfigDBState
 */
function getTargetDBState(targetName, targetDB, targetConfigDBState) {
  var targetDBState = _.merge({}, targetDB.getState(), targetConfigDBState);

  targetDBState.name = targetDBState.name || targetName;
  targetDBState.disable = targetDBState.disable || false;
  targetDBState.description = targetDBState.description || targetDBState.name;
  targetDBState.activeModule = targetDBState.activeModule || targetDBState.defaultModule;
  targetDBState.priority = targetDBState.priority || 0;
  targetDBState.tags = _.union(['全部'], targetDBState.tags || []);

  return targetDBState;
}

/**
 * 获取这个 target 的modules列表
 *
 * @param {String} curTargetPath 当前目标路径
 * @param {Function} dealTargetModuleCall 处理函数
 * @return {Array}
 */
function getTargetModules(curTargetPath, dealTargetModuleCall) {
  var curTargetModulesPath = path.join(curTargetPath, 'result_modules');

  // 获取当前的 target 下的 modules 列表
  var modules = [];

  file.getAll(curTargetModulesPath, { globs: ['*'] }).forEach(function (item) {
    if (!item.isDirectory()) {
      console.error('SHOULD BE Directory!', item);
      return;
    }

    // 获取模块名
    var targetModuleName = path.basename(item.relativePath);

    // config.json 的作用是用于用户自定义，拥有最高的优先级
    var targetModuleDBFile = path.join(curTargetModulesPath, targetModuleName, 'config.json');
    var targetModuleData = void 0;

    if (!fs.existsSync(targetModuleDBFile)) {
      // config.json不存在，则设置默认值
      targetModuleData = {};
    } else {
      // config.json不存在，则获取这个模块的详细信息
      var targetModuleDB = db.getDB(targetModuleDBFile);

      targetModuleData = targetModuleDB.getState();
    }

    targetModuleData.name = targetModuleData.name || targetModuleName;
    targetModuleData.description = targetModuleData.description || targetModuleName;
    targetModuleData.priority = targetModuleData.priority || 0;

    // 自定义处理
    targetModuleData = dealTargetModuleCall(targetModuleData);

    modules.push(targetModuleData);
  });

  return modules;
}

/**
 * 获取指定 target 的 README 信息
 */
function getTargetReadme(targetBasePath, targetName) {
  var curTargetPath = path.join(targetBasePath, targetName);

  var targetReadmeFile = path.join(curTargetPath, 'readme.md');
  if (!fs.existsSync(targetReadmeFile)) {
    targetReadmeFile = path.join(curTargetPath, 'readme.MD');
    if (!fs.existsSync(targetReadmeFile)) {
      targetReadmeFile = path.join(curTargetPath, 'README.md');
      if (!fs.existsSync(targetReadmeFile)) {
        targetReadmeFile = path.join(curTargetPath, 'README.MD');
        if (!fs.existsSync(targetReadmeFile)) {
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
    var content = fs.readFileSync(targetReadmeFile, 'utf8');

    content = content.replace(/__MOCKER__/g, targetName);

    return marked(content);
  } catch (e) {
    return e.stack;
  }
}

/**
 * 更新 target 的 信息
 * @param targetBasePath
 * @param targetName
 * @param newState
 */
function updateTarget(targetBasePath, targetName, newState) {
  var curTargetPath = path.join(targetBasePath, targetName);

  // 获取这个 target 模块的详细信息
  var targetDB = getTargetDB(curTargetPath);

  // 更新 target db 数据
  var targetDBState = targetDB.getState();
  targetDBState = _.merge({}, targetDBState, newState);
  targetDB.setState(targetDBState);

  return targetDBState;
}

module.exports = {
  getTargetNameList: getTargetNameList,
  getTargetConfigDBState: getTargetConfigDBState,
  getTargetDB: getTargetDB,
  getTargetDBState: getTargetDBState,
  getTargetModules: getTargetModules,
  getTargetListByMatch: getTargetListByMatch,
  getTargetReadme: getTargetReadme,
  updateTarget: updateTarget,
  getAllMatmanFiles: getAllMatmanFiles
};
//# sourceMappingURL=deal-target.js.map