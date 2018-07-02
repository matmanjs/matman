const matmanQuery = require('./business/matman-query');

module.exports = {
  util: require('./util'),
  Mocker: require('./model/Mocker'),
  MockerParser: require('./model/MockerParser'),
  MatmanQuery: matmanQuery.MatmanQuery,
  QUERY_KEY: matmanQuery.QUERY_KEY,
  mockerUtil: require('./util'),
  ClientScript: require('./tester/ClientScript'),
  E2eTestAction: require('./tester/E2eTestAction'),
  getPreloadScriptPath: require('./tester/get-preload-script-path'),
  getBuildPath: require('./tester/get-build-path'),
  getConfigFilePath: require('./tester/get-config-file-path'),
  e2e: {
    scan: require('./tester/e2e-test-scan-page')
  }
};