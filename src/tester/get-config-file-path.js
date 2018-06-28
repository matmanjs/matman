const fs = require('fs');
const path = require('path');

const configFileName = 'matman.config.js';

const getConfigFilePath = (configPath) => {
  // 非法的路径时，默认为本文件夹的 dirname
  if (!configPath || !fs.existsSync(configPath)) {
    // console.log('Unknow configPath=' + configPath);
    configPath = __dirname;
  }

  // 如果不是 config file，则从当前路径往上找 config file
  if (configPath.indexOf(configFileName) < 0) {
    let result = _search(configPath);
    if (!result) {
      throw new Error('Can not find ' + configFileName + ' ! configPath=' + configPath);
    }

    configPath = path.resolve(result, configFileName);
  }

  return configPath;
};

/**
 * 在指定的路径中，获得配置文件的路径。
 *
 * 寻找的规则：从指定的路径开始，依次往上级目录查找，一直到根目录为止，如果找到，则停止。
 *
 * @param {String} [targetPath] 目标路径
 * @return {String}
 */
function _search(targetPath) {
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

module.exports = getConfigFilePath;