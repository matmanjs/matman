const path = require('path');

module.exports = {
  rootPath: __dirname,
  buildPath: path.resolve(__dirname, './build'),
  logPath: path.resolve(__dirname, './build/logs'),
  mockServerPath: path.resolve(__dirname, '../../../../matman-mock/test/data/fixtures/mock_server/mockers'),
  e2eTestPath: path.resolve(__dirname, './e2e_test'),
  clientScriptBuildPath: path.join(__dirname, './build/client-script'),
  clientScriptMatch: /crawlers\/.*\.js$/
};
