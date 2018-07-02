'use strict';

const fs = require('fs');
const path = require('path');
const fsHandler = require('fs-handler');

const configFileName = 'matman.config.js';

/**
 * 在指定的路径中，获得配置文件的路径。
 *
 * 寻找的规则：从指定的路径开始，依次往上级目录查找，一直到根目录为止，如果找到，则停止。
 *
 * @param {String} [targetPath] 目标路径
 * @return {String}
 */
function getConfigPath(targetPath) {
  let currDir = targetPath || process.cwd();
  let isExist = true;

  while (!fs.existsSync(path.join(currDir, configFileName))) {
    currDir = path.join(currDir, '../');

    // unix跟目录为/， win32系统根目录为 C:\\格式的
    if (currDir === '/' || /^[a-zA-Z]:\\$/.test(currDir)) {
      isExist = false;
      console.log('未找到 ' + configFileName);
      break;
    }
  }

  return isExist ? currDir : '';
}

/**
 * 获得 config 的内容
 *
 * @param {String} [targetPath] 目标路径
 * @return {Promise}
 */
function getConfig(targetPath) {
  let configPath = getConfigPath(targetPath);

  // 如果没有找到包含了配置文件的目录，则返回空对象
  if (!configPath) {
    return Promise.reject('lost configPath');
  }

  const configFile = path.join(configPath, configFileName);

  // 如果没有存在配置文件，则返回空对象
  if (!fs.existsSync(configFile)) {
    return Promise.reject('lost config file');
  }

  // 获取文件内容并返回
  return fsHandler.handle.getModuleResult(configFile)
    .then((config) => {

      // rootPath 默认值为 matman.config.js 当前目录
      if (!config.rootPath) {
        config.rootPath = path.dirname(configFile);
      }

      return config;
    });
}

module.exports = {
  getConfig: getConfig
};
