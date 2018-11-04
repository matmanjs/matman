const path = require('path');

module.exports = {
  rootPath: __dirname,
  e2eTestPath: path.resolve(__dirname, './e2e_test'),
  clientScriptBuildPath: path.join(__dirname, './build/client-script'),
  clientScriptMatch: /crawlers[\/|\\].*\.js$/
};
