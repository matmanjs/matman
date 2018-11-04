'use strict';

var path = require('path');
var getConfigFilePath = require('./get-config-file-path');

var getBuildPath = function getBuildPath(configPath) {
  var configFilePath = getConfigFilePath(configPath);

  var config = require(configFilePath);

  if (!config.rootPath) {
    config.rootPath = path.dirname(configFilePath);
  }

  var result = config.buildPath || './build';

  if (!path.isAbsolute(result)) {
    result = path.join(config.rootPath, result);
  }

  return result;
};

module.exports = getBuildPath;
//# sourceMappingURL=get-build-path.js.map