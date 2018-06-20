const path = require('path');
const matman = require('../../../../../../../lib');

const getPreloadScriptPath = (name) => {
  let clientScript = new matman.ClientScript(path.resolve(__dirname, '../../../matman.config.js'));

  return clientScript.getPath(name);
};

module.exports = getPreloadScriptPath;

// console.log(getPreloadScriptPath('page_rule/crawlers/get-page-info'));