const ClientScript = require('./ClientScript');
const getConfigFilePath = require('./get-config-file-path');

const getPreloadScriptPath = (name, configPath) => {
  let clientScript = new ClientScript(getConfigFilePath(configPath));

  return clientScript.getPath(name);
};

module.exports = getPreloadScriptPath;