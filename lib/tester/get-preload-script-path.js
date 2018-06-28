'use strict';

var ClientScript = require('./ClientScript');
var getConfigFilePath = require('./get-config-file-path');

var getPreloadScriptPath = function getPreloadScriptPath(name, configPath) {
  var clientScript = new ClientScript(getConfigFilePath(configPath));

  return clientScript.getPath(name);
};

module.exports = getPreloadScriptPath;