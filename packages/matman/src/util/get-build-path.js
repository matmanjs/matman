const path = require('path');
const getConfigFilePath = require('./get-config-file-path');

const getBuildPath = (configPath) => {
  let configFilePath = getConfigFilePath(configPath);

  let config = require(configFilePath);

  if (!config.rootPath) {
    config.rootPath = path.dirname(configFilePath);
  }

  let result = config.buildPath || './build';

  if (!path.isAbsolute(result)) {
    result = path.join(config.rootPath, result);
  }

  return result;
};

module.exports = getBuildPath;